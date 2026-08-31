import { readFile, stat } from "node:fs/promises";
import { NextResponse } from "next/server";
import { mimeForPath, resolveWithinImages } from "@/admin/lib/images";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const filePath = resolveWithinImages(...path);
  if (!filePath) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const info = await stat(filePath).catch(() => null);
  if (!info || !info.isFile()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const buffer = await readFile(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeForPath(filePath),
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
