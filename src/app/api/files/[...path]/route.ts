import { blobEnabled, readBlob } from "@/lib/blobStore";

// Serves product photos kept in a PRIVATE Vercel Blob store. Only the uploads/ folder is exposed
// (never the product list or the customer requests).
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathname = path.join("/");
  if (!blobEnabled || !/^uploads\/[\w.-]+$/.test(pathname)) return new Response("Not found", { status: 404 });

  const file = await readBlob(pathname).catch(() => null);
  if (!file || file.statusCode !== 200) return new Response("Not found", { status: 404 });

  return new Response(file.stream, {
    headers: {
      "Content-Type": file.blob.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
