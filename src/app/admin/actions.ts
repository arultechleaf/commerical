"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { categories } from "@/data/categories";
import { endAdminSession, isAdmin, credentialsMatch, startAdminSession } from "@/lib/adminAuth";
import { deleteProduct, getProduct, removeUpload, saveProduct, saveUpload } from "@/lib/productStore";
import type { CategorySlug } from "@/types/product";

export async function login(formData: FormData) {
  if (!(await credentialsMatch(String(formData.get("email") ?? ""), String(formData.get("password") ?? "")))) redirect("/admin/login?error=1");
  await startAdminSession();
  redirect("/admin");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin/login");
}

export async function saveProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "") || undefined;
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as CategorySlug;
  const price = Number(formData.get("price"));
  const compareRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const compareAtPrice = compareRaw ? Number(compareRaw) : undefined;
  const fail = (message: string) => redirect(`/admin?${id ? `edit=${id}&` : ""}error=${encodeURIComponent(message)}`);

  if (!name) return fail("Please enter a product name.");
  if (!categories.some((item) => item.slug === category)) return fail("Please choose a category.");
  if (!Number.isFinite(price) || price < 0) return fail("Please enter a valid price.");
  if (compareAtPrice !== undefined && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)) return fail("Please enter a valid old price.");

  const existing = id ? await getProduct(id) : undefined;
  let image = existing?.image ?? "";
  const upload = formData.get("imageFile");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  try {
    if (upload instanceof File && upload.size > 0) {
      image = await saveUpload(upload);
    } else if (imageUrl) {
      if (!/^https?:\/\//.test(imageUrl)) return fail("Image link must start with http:// or https://");
      image = imageUrl;
    }
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Image upload failed.");
  }
  if (!image) return fail("Please upload an image or paste an image link.");
  if (existing && existing.image !== image) await removeUpload(existing.image);

  await saveProduct({
    id,
    name,
    category,
    price: Math.round(price),
    compareAtPrice: compareAtPrice === undefined ? undefined : Math.round(compareAtPrice),
    image,
    description: String(formData.get("description") ?? "").trim() || `${name} is a lovely little finishing touch.`,
    material: String(formData.get("material") ?? "").trim(),
    featured: formData.get("featured") === "on",
    newArrival: formData.get("newArrival") === "on",
  });
  revalidatePath("/", "layout");
  redirect("/admin?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const removed = await deleteProduct(String(formData.get("id") ?? ""));
  if (removed) await removeUpload(removed.image);
  revalidatePath("/", "layout");
  redirect("/admin?deleted=1");
}
