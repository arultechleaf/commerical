import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { seedProducts } from "@/data/products";
import type { Product } from "@/types/product";

export const storageDir = path.join(process.cwd(), "storage");
export const uploadsDir = path.join(storageDir, "uploads");
const productsFile = path.join(storageDir, "products.json");

async function readAll(): Promise<Product[]> {
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
  "This hosting has a read-only disk, so changes can't be saved here. Run the site on a server with a writable disk (own PC or VPS), or connect a database.";

async function writeAll(products: Product[]) {
  try {
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

export async function saveProduct(input: Omit<Product, "id"> & { id?: string }) {
  const products = await readAll();
  if (input.id) {
    const index = products.findIndex((product) => product.id === input.id);
    if (index === -1) throw new Error("Product not found");
    products[index] = { ...input, id: input.id };
  } else {
    const numbers = products
      .filter((product) => product.category === input.category)
      .map((product) => Number(product.id.split("-").pop()) || 0);
    const next = Math.max(0, ...numbers) + 1;
    products.unshift({ ...input, id: `${input.category}-${String(next).padStart(3, "0")}` });
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
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, name), data);
  } catch {
    throw new Error(readOnlyMessage);
  }
  return `/uploads/${name}`;
}

export async function removeUpload(imagePath: string) {
  if (!imagePath.startsWith("/uploads/")) return;
  const name = path.basename(imagePath);
  await fs.rm(path.join(uploadsDir, name), { force: true });
}
