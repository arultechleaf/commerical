import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { seedProducts } from "@/data/products";
import type { Product } from "@/types/product";
import { blobEnabled, FILES_ROUTE, putImage, readJson, writeJson } from "@/lib/blobStore";
import { del } from "@vercel/blob";

export const storageDir = path.join(process.cwd(), "storage");
export const uploadsDir = path.join(storageDir, "uploads");
const productsFile = path.join(storageDir, "products.json");

async function readAll(): Promise<Product[]> {
  if (blobEnabled) {
    // Online copy wins. If it does not exist yet, start from the committed file below.
    const online = await readJson<Product[]>("data/products.json");
    if (online) return online;
  }
  try {
    return JSON.parse(await fs.readFile(productsFile, "utf8")) as Product[];
  } catch {
    // First run: start from the sample catalogue so the shop is never empty.
    // On read-only hosting (e.g. Vercel) saving fails, so just serve the samples.
    try { await writeAll(seedProducts); } catch {}
    return seedProducts;
  }
}

export const readOnlyMessage =
  "Saving is not set up on this hosting yet. In the Vercel dashboard open Storage, create a Blob store and connect it to this project (it adds BLOB_READ_WRITE_TOKEN), then redeploy.";

async function writeAll(products: Product[]) {
  try {
    if (blobEnabled) return await writeJson("data/products.json", products);
    await fs.mkdir(storageDir, { recursive: true });
    const tmp = `${productsFile}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(products, null, 2), "utf8");
    await fs.rename(tmp, productsFile);
  } catch {
    throw new Error(readOnlyMessage);
  }
}

export async function getProducts() {
  return readAll();
}

export async function getProduct(id: string) {
  return (await readAll()).find((product) => product.id === id);
}

export async function saveProduct(input: Omit<Product, "id"> & { id?: string; customId?: string }) {
  const { customId, ...rest } = input;
  input = rest;
  const products = await readAll();
  if (input.id) {
    const index = products.findIndex((product) => product.id === input.id);
    if (index === -1) throw new Error("Product not found");
    const previous = products[index];
    const createdAt = previous.createdAt ?? (input.newArrival ? Date.now() : undefined);
    products[index] = { ...input, id: input.id, createdAt };
  } else if (customId) {
    if (products.some((product) => product.id === customId)) throw new Error(`Product code ${customId.toUpperCase()} is already used.`);
    products.unshift({ ...input, id: customId, createdAt: Date.now() });
  } else {
    const numbers = products
      .filter((product) => product.category === input.category)
      .map((product) => Number(product.id.split("-").pop()) || 0);
    const next = Math.max(0, ...numbers) + 1;
    products.unshift({ ...input, id: `${input.category}-${String(next).padStart(3, "0")}`, createdAt: Date.now() });
  }
  await writeAll(products);
}

export async function deleteProduct(id: string) {
  const products = await readAll();
  const target = products.find((product) => product.id === id);
  await writeAll(products.filter((product) => product.id !== id));
  return target;
}

export async function saveUpload(file: File) {
  const types: Record<string, string> = {
    "image/jpeg": ".jpg", "image/jpg": ".jpg", "image/png": ".png", "image/webp": ".webp",
    "image/gif": ".gif", "image/avif": ".avif", "image/svg+xml": ".svg",
  };
  const byExtension: Record<string, string> = { ".jpg": ".jpg", ".jpeg": ".jpg", ".png": ".png", ".webp": ".webp", ".gif": ".gif", ".avif": ".avif", ".svg": ".svg" };
  const ext = types[file.type] ?? byExtension[path.extname(file.name).toLowerCase()];
  if (!ext) throw new Error("Please upload a JPG, PNG, SVG, WEBP, GIF or AVIF image.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be smaller than 8 MB.");
  const data = Buffer.from(await file.arrayBuffer());
  if (ext === ".svg" && !/<svg[\s>]/i.test(data.toString("utf8", 0, 4096))) throw new Error("That file is not a valid SVG image.");
  const name = `${crypto.randomUUID()}${ext}`;
  if (blobEnabled) {
    try {
      return await putImage(`uploads/${name}`, data, file.type || undefined);
    } catch {
      throw new Error("Could not upload the image to online storage. Please try again.");
    }
  }
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, name), data);
  } catch {
    throw new Error(readOnlyMessage);
  }
  return `/uploads/${name}`;
}

export async function removeUpload(imagePath: string) {
  if (blobEnabled && (/^https:\/\/[^/]+\.blob\.vercel-storage\.com\/uploads\//.test(imagePath) || imagePath.startsWith(`${FILES_ROUTE}uploads/`))) {
    // Public photos are removed by their link, private ones by their name in the store.
    try { await del(imagePath.startsWith(FILES_ROUTE) ? imagePath.slice(FILES_ROUTE.length) : imagePath); } catch {}
    return;
  }
  if (!imagePath.startsWith("/uploads/")) return;
  const name = path.basename(imagePath);
  await fs.rm(path.join(uploadsDir, name), { force: true });
}
