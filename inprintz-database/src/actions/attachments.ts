"use server";

import prisma from "@/lib/db";
import fs from "node:fs/promises";
import { urlToAbs, UPLOAD_ROOT } from "@/lib/uploads";
import path from "node:path";
import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteAttachment(formData: FormData) {
  const id = formData.get("attachmentId") as string;
  if (!id) return;

  const att = await prisma.attachment.findUnique({
    where: { id },
    select: { url: true, orderId: true },
  });
  if (!att) return;

  const abs = urlToAbs(att.url);
  if (abs) {
    try { await fs.unlink(abs); } catch (e: any) { if (e?.code !== "ENOENT") throw e; }
  }

  await prisma.attachment.delete({ where: { id } });

  const pathTo = `/orders/update/${att.orderId}`;
  revalidatePath(pathTo);
  redirect(pathTo);
}

function hashedName(original: string) {
  const ext = path.extname(original) || "";
  const name = crypto.randomUUID().replace(/-/g, "");
  const y = new Date().getFullYear();
  const m = String(new Date().getMonth() + 1).padStart(2, "0");
  const rel = `${y}/${m}/${name}${ext}`;
  const abs = path.join(UPLOAD_ROOT, rel);
  const url = `/files/${rel}`;
  return { abs, url };
}

export async function addAttachmentsToOrder(orderId: string, formData: FormData) {
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) {
    const pathTo = `/orders/update/${orderId}`;
    revalidatePath(pathTo);
    redirect(pathTo);
  }

  const toCreate: { fileName: string; url: string }[] = [];

  for (const f of files) {
    const { abs, url } = hashedName(f.name);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    const buf = Buffer.from(await f.arrayBuffer());
    await fs.writeFile(abs, buf, { mode: 0o640 });
    toCreate.push({ fileName: f.name, url });
  }

  await prisma.attachment.createMany({
    data: toCreate.map(a => ({ orderId, fileName: a.fileName, url: a.url })),
  });

  const pathTo = `/orders/update/${orderId}`;
  revalidatePath(pathTo);
  redirect(pathTo);
}
