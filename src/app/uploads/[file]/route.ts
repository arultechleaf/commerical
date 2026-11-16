import { promises as fs } from "node:fs";
import path from "node:path";
import { uploadsDir } from "@/lib/productStore";

const types: Record<string, string> = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif", ".svg": "image/svg+xml" };

export async function GET(_request: Request, ctx: RouteContext<"/uploads/[file]">) {
  const { file } = await ctx.params;
  if (!/^[\w-]+\.(jpg|png|webp|gif|avif|svg)$/.test(file)) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(uploadsDir, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": types[path.extname(file)],
        "Cache-Control": "public, max-age=31536000, immutable",
        // Uploaded SVGs must never run scripts if opened directly.
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
