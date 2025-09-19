import path from "node:path";

export const UPLOAD_ROOT = path.join(process.cwd(), "data", "uploads");

export function urlToAbs(url: string) {
  const prefix = "/files/";
  if (!url.startsWith(prefix)) return null;
  const rel = url.slice(prefix.length);
  return path.join(UPLOAD_ROOT, rel);
}
