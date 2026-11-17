import "server-only";
import { createHash } from "node:crypto";
import { list, put } from "@vercel/blob";

// Online storage (Vercel Blob). Active only when BLOB_READ_WRITE_TOKEN is set;
// otherwise the site keeps using files in the local `storage` folder.
export const blobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Blob URLs are public, so files with private content get an unguessable name
// derived from the secret token.
export const privateName = (base: string) =>
  `${base}-${createHash("sha256").update(process.env.BLOB_READ_WRITE_TOKEN ?? "").digest("hex").slice(0, 24)}.json`;

export async function readJson<T>(pathname: string): Promise<T | null> {
  const { blobs } = await list({ prefix: pathname, limit: 5 });
  const hit = blobs.find((blob) => blob.pathname === pathname);
  if (!hit) return null;
  const response = await fetch(`${hit.url}?t=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not read ${pathname} (${response.status})`);
  return (await response.json()) as T;
}

export async function writeJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
