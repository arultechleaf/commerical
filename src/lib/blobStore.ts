import "server-only";
import { createHash } from "node:crypto";
import { get, put } from "@vercel/blob";

// Where data is kept, chosen with STORAGE_MODE:
//   "local"  -> always the local `storage` folder (even if a Blob token exists)
//   "online" -> always Vercel Blob (needs Blob credentials, see below)
//   unset    -> automatic: online when Blob credentials exist, otherwise local
const mode = (process.env.STORAGE_MODE ?? "").trim().toLowerCase();
// Blob credentials: a static BLOB_READ_WRITE_TOKEN, or (on Vercel) OIDC via BLOB_STORE_ID + VERCEL_OIDC_TOKEN.
const hasBlobCredentials = Boolean(
  process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && (process.env.VERCEL || process.env.VERCEL_OIDC_TOKEN)),
);
export const blobEnabled = mode !== "local" && hasBlobCredentials;

// A Vercel Blob store is either Public or Private. Both work: the first call tries the
// configured kind (BLOB_ACCESS=public|private) and falls back to the other one, then remembers it.
export type BlobAccess = "public" | "private";
let detected: BlobAccess | undefined = ["public", "private"].includes(process.env.BLOB_ACCESS ?? "")
  ? (process.env.BLOB_ACCESS as BlobAccess)
  : undefined;

async function withAccess<T>(run: (access: BlobAccess) => Promise<T>): Promise<T> {
  const first: BlobAccess = detected ?? "public";
  try {
    const result = await run(first);
    detected = first;
    return result;
  } catch (error) {
    const second: BlobAccess = first === "public" ? "private" : "public";
    try {
      const result = await run(second);
      detected = second;
      return result;
    } catch {
      throw error; // report the first, more useful, error
    }
  }
}

// Photos of a private store are not reachable by a plain link, so they are served by /api/files.
export const FILES_ROUTE = "/api/files/";

// Unguessable file name for private content (requests contain customer phone numbers).
export const privateName = (base: string) =>
  `${base}-${createHash("sha256").update(process.env.OTP_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "").digest("hex").slice(0, 24)}.json`;

export async function readBlob(pathname: string) {
  return withAccess((access) => get(pathname, { access, useCache: false }));
}

export async function readJson<T>(pathname: string): Promise<T | null> {
  const result = await readBlob(pathname);
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text()) as T;
}

export async function writeJson(pathname: string, data: unknown) {
  await withAccess((access) =>
    put(pathname, JSON.stringify(data), {
      access,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    }),
  );
}

// Uploads a photo and returns the address to store in the product.
export async function putImage(pathname: string, data: Buffer, contentType?: string) {
  return withAccess(async (access) => {
    const blob = await put(pathname, data, { access, addRandomSuffix: false, contentType });
    return access === "public" ? blob.url : `${FILES_ROUTE}${blob.pathname}`;
  });
}
