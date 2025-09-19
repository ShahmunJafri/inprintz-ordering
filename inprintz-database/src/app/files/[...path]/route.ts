import { NextResponse } from "next/server";
import { UPLOAD_ROOT } from "@/lib/uploads";
import path from "node:path";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
};

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const rel = params.path.join("/");
    const abs = path.join(UPLOAD_ROOT, rel);

    const normalized = path.normalize(abs);
    if (!normalized.startsWith(UPLOAD_ROOT)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const stat = await fs.stat(normalized);
    if (!stat.isFile()) return new NextResponse("Not Found", { status: 404 });

    const ext = path.extname(normalized).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const stream = createReadStream(normalized);

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": type,
        "Content-Length": String(stat.size),
        "Content-Disposition": `inline; filename="${path.basename(normalized)}"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (err: any) {
    if (err?.code === "ENOENT") return new NextResponse("Not Found", { status: 404 });
    return new NextResponse("Server Error", { status: 500 });
  }
}
