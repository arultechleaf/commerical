import { blobEnabled, readBlob } from "@/lib/blobStore";

export const runtime = "nodejs";

// Serves product photos kept in a PRIVATE Vercel Blob store. Only the uploads/ folder is exposed
// (never the product list or the customer requests). Product photos are meant to be public,
// so no login is needed here.
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathname = path.join("/");
  if (!blobEnabled || !/^uploads\/[\w.-]+$/.test(pathname)) return new Response("Not found", { status: 404 });

  try {
    const file = await readBlob(pathname);
    if (!file || file.statusCode !== 200) return new Response("File not found", { status: 404 });

    return new Response(file.stream, {
      headers: {
        "Content-Type": file.blob.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (error) {
    console.error("Private Blob error:", error);
    return Response.json({ error: "Unable to retrieve file" }, { status: 500 });
  }
}
