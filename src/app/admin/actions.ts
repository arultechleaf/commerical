"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { categories } from "@/data/categories";
import { endAdminSession, isAdmin, credentialsMatch, startAdminSession } from "@/lib/adminAuth";
import { deleteProduct, getProduct, removeUpload, saveProduct, saveUpload } from "@/lib/productStore";
import type { CategorySlug } from "@/types/product";

function getAdminReturnParams(formData: FormData) {
  const params = new URLSearchParams();
  const category = String(formData.get("returnCategory") ?? "all");
  const query = String(formData.get("returnQuery") ?? "").trim();
  if (category !== "all" && categories.some((item) => item.slug === category)) params.set("category", category);
  if (query) params.set("q", query);
  return params;
}

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
  const returnParams = getAdminReturnParams(formData);
  const fail = (message: string) => {
    const params = new URLSearchParams(returnParams);
    if (id) params.set("edit", id);
    params.set("error", message);
    redirect(`/admin?${params}`);
  };

  if (!name) return fail("Please enter a product name.");
  if (!categories.some((item) => item.slug === category)) return fail("Please choose a category.");
  if (!Number.isFinite(price) || price < 0) return fail("Please enter a valid price.");
  if (compareAtPrice !== undefined && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)) return fail("Please enter a valid old price.");

  const customId = String(formData.get("code") ?? "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || undefined;
  const existing = id ? await getProduct(id) : undefined;
  let image = existing?.image ?? "";
  let uploadedImage: string | undefined;
  const upload = formData.get("imageFile");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  try {
    if (upload instanceof File && upload.size > 0) {
      image = await saveUpload(upload);
      uploadedImage = image;
    } else if (imageUrl) {
      if (!/^https?:\/\//.test(imageUrl)) return fail("Image link must start with http:// or https://");
      image = imageUrl;
    }
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Image upload failed.");
  }
  if (!image) return fail("Please upload an image or paste an image link.");

  try {
    await saveProduct({
      id,
      customId: id ? undefined : customId,
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
  } catch (error) {
    if (uploadedImage) await removeUpload(uploadedImage);
    return fail(error instanceof Error ? error.message : "Could not save the product.");
  }
  if (existing && existing.image !== image) await removeUpload(existing.image);
  revalidatePath("/", "layout");
  returnParams.set("saved", "1");
  redirect(`/admin?${returnParams}`);
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const returnParams = getAdminReturnParams(formData);
  let removed;
  try {
    removed = await deleteProduct(String(formData.get("id") ?? ""));
  } catch (error) {
    returnParams.set("error", error instanceof Error ? error.message : "Could not delete the product.");
    redirect(`/admin?${returnParams}`);
  }
  if (removed) await removeUpload(removed.image);
  revalidatePath("/", "layout");
  returnParams.set("deleted", "1");
  redirect(`/admin?${returnParams}`);
}
