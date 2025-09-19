"use server";
import { ProofType, FileSource, OrderStatus, FinancialStatus } from "@/generated/prisma";
import prisma from "../lib/db";
import { redirect } from 'next/navigation';
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { urlToAbs } from "@/lib/uploads";

const UPLOAD_ROOT = path.join(process.cwd(), "data", "uploads")

function hashedName(original: string) {
  const ext = path.extname(original) || "";
  const base = crypto.randomUUID().replace(/-/g, "");
  const y = new Date().getFullYear();
  const m = String(new Date().getMonth() + 1).padStart(2, "0");
  const rel = `${y}/${m}/${base}${ext}`;  
  const abs = path.join(UPLOAD_ROOT, rel);   
  const url = `/files/${rel}`;                  
  return { rel, abs, url };
}

export async function createOrder(formData: FormData){

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    const attachmentsData: { fileName: string; url: string }[] = [];
      for (const f of files) {
        const { abs, url } = hashedName(f.name);
        await fs.mkdir(path.dirname(abs), { recursive: true });
        const buf = Buffer.from(await f.arrayBuffer());
        await fs.writeFile(abs, buf, { mode: 0o640 });
        attachmentsData.push({ fileName: f.name, url });
      }

    await prisma.order.create({
        data: {
            job_name: formData.get("job_name") as string || "Unnamed_Order",
            slug: (formData.get("job_name") as string)
                .replace(/\s+/g, "-")
                .toLowerCase() || "Unnamed_Order",
            client: formData.get("client") as string || "",
            contact: formData.get("contact") as string || "",
            po_number: formData.get("po_number") as string || "",
            sales_rep: formData.get("sales_rep") as string || "",

            orderStatus: formData.get("orderStatus") as OrderStatus || "NOT_STARTED" as OrderStatus,
            financialStatus: formData.get("financialStatus") as FinancialStatus || "PENDING" as FinancialStatus,

            proofingIsRequired: formData.get("proofingIsRequired") === "on",
            proofDueDate: typeof formData.get("proofDueDate") === "string" && formData.get("proofDueDate")
                        ? new Date(formData.get("proofDueDate") as string) : null,
            notes: formData.get("notes") as string || "",
            proofType: formData.get("proof_type") as ProofType, 
            color_match_info: formData.get("color_match_info") as string || "",

            shippingDueDate: typeof formData.get("shippingDueDate") === "string" && formData.get("shippingDueDate")
                        ? new Date(formData.get("shippingDueDate") as string) : null,
            shipTo: formData.get("shipTo") as string || "Pick Up",
            shipMethod: formData.get("shipMethod") as string || "",
            account: formData.get("account") as string || "",
            
            filesource: formData.get("filesource") as FileSource,
            filesourcedescription: formData.get("filesourcedescription") as string || "",
            fileFolderName: formData.get("fileFolderName") as string || "",

            hardware: formData.get("hardware") as string || "",
            installation: formData.get("installation") as string || "",

            additional_info_notes: formData.get("additional_info_notes") as string || "",
            production_notes: formData.get("additional_info_notes") as string || "",

            attachments: attachmentsData.length
              ? {
                  create: attachmentsData.map((a) => ({
                    fileName: a.fileName,
                    url: a.url,
                  })),
                }
              : undefined,
          },
          include: { attachments: true },
    });
    redirect('/');
}

export async function recoverOrder(formData: FormData){
  const id = formData.get("id") as string;
  if (!id) redirect("/?badid=1");

  const current = await prisma.order.findUnique({
    where: { id },
    select: { deleted: true },
  });

  if (!current) redirect("/?notfound=1");

    await prisma.order.update({
        where: { id },
        data: { deleted: false },
    });
    redirect("/")
}

export async function deleteOrder(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) redirect("/?badid=1");

  const current = await prisma.order.findUnique({
    where: { id },
    select: { deleted: true },
  });
  if (!current) redirect("/?notfound=1");

  if (!current.deleted) {
    await prisma.order.update({
      where: { id },
      data: { deleted: true },
    });
    redirect("/?softDeleted=1");
  }

  const attachments = await prisma.attachment.findMany({
    where: { orderId: id },
    select: { url: true },
  });

  await Promise.all(
    attachments.map(async ({ url }) => {
      const abs = urlToAbs(url);
      if (!abs) return;
      try {
        await fs.unlink(abs);
      } catch (err: any) {
        if (err?.code !== "ENOENT") throw err;
      }
    })
  );

  await prisma.order.delete({ where: { id } });

  redirect("/?hardDeleted=1");
}


export async function updateOrder(formData: FormData){
  try {

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    const attachmentsData: { fileName: string; url: string }[] = [];
      for (const f of files) {
        const { abs, url } = hashedName(f.name);
        await fs.mkdir(path.dirname(abs), { recursive: true });
        const buf = Buffer.from(await f.arrayBuffer());
        await fs.writeFile(abs, buf, { mode: 0o640 });
        attachmentsData.push({ fileName: f.name, url });
      }
    const id = formData.get('id') as string;
    const lastSeen = new Date(formData.get("updatedAt") as string);
        await prisma.order.update({
            where: { 
                id_updatedAt: {
                    id: id,
                    updatedAt: lastSeen
                },
            },
            data: { 
                job_name: formData.get("job_name") as string,
                slug: (formData.get("job_name") as string)
                    .replace(/\s+/g, "-")
                    .toLowerCase() || "Unnamed_Order",
                client: formData.get("client") as string,
                contact: formData.get("contact") as string || "",
                po_number: formData.get("po_number") as string || "",
                sales_rep: formData.get("sales_rep") as string || "",
                
                orderStatus: formData.get("orderStatus") as OrderStatus || "NOT_STARTED" as OrderStatus,
                financialStatus: formData.get("financialStatus") as FinancialStatus || "PENDING" as FinancialStatus,

                proofingIsRequired: formData.get("proofingIsRequired") === "on",
                proofDueDate: typeof formData.get("proofDueDate") === "string" && formData.get("proofDueDate")
                            ? new Date(formData.get("proofDueDate") as string) : null,
                notes: formData.get("notes") as string || "",
                proofType: formData.get("proof_type") as ProofType, 
                color_match_info: formData.get("color_match_info") as string || "",

                shippingDueDate: typeof formData.get("shippingDueDate") === "string" && formData.get("shippingDueDate")
                            ? new Date(formData.get("shippingDueDate") as string) : null,
                shipTo: formData.get("shipTo") as string || "Pick Up",
                shipMethod: formData.get("shipMethod") as string || "",
                account: formData.get("account") as string || "",
                
                filesource: formData.get("filesource") as FileSource,
                filesourcedescription: formData.get("filesourcedescription") as string || "",
                fileFolderName: formData.get("fileFolderName") as string || "",

                hardware: formData.get("hardware") as string || "",
                installation: formData.get("installation") as string || "",

                additional_info_notes: formData.get("additional_info_notes") as string || "",
                production_notes: formData.get("production_notes") as string || "",

               attachments: attachmentsData.length
              ? {
                  create: attachmentsData.map((a) => ({
                    fileName: a.fileName,
                    url: a.url,
                  })),
                }
              : undefined,
          },
            include: { attachments: true },
            
        });
        redirect('/')
    } catch (err: any) {
    if (err?.code === "P2025") {
      redirect(`/orders/update/${formData.get('id') as string}?stale=1`);
    }
    throw err;                                  
  }
}

