import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { categories } from "@/data/categories";
import { isAdmin } from "@/lib/adminAuth";
import { getProducts } from "@/lib/productStore";
import { deleteProductAction, logout, saveProductAction } from "./actions";

export const metadata: Metadata = { title: "Manage products", robots: { index: false } };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; category?: string; error?: string; saved?: string; deleted?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { edit, category = "all", error, saved, deleted } = await searchParams;
  const products = await getProducts();
  const editing = edit ? products.find((product) => product.id === edit) : undefined;
  const visible = category === "all" ? products : products.filter((product) => product.category === category);

  return (
    <section className="section shell admin-page">
      <div className="admin-head">
        <h1>Manage products</h1>
        <form action={logout}><button className="button button-outline" type="submit">Log out</button></form>
      </div>
      {error && <p className="admin-error">{error}</p>}
      {saved && <p className="admin-ok">Product saved.</p>}
      {deleted && <p className="admin-ok">Product deleted.</p>}

      <form action={saveProductAction} className="admin-form admin-card" key={editing?.id ?? "new"}>
        <h2>{editing ? `Edit: ${editing.name}` : "Add a new product"}</h2>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <label>Name<input name="name" required defaultValue={editing?.name} /></label>
        <label>Category
          <select name="category" required defaultValue={editing?.category ?? categories[0].slug}>
            {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <div className="admin-row">
          <label>Price (₹)<input name="price" type="number" min="0" required defaultValue={editing?.price} /></label>
          <label>Old price (₹), optional<input name="compareAtPrice" type="number" min="0" defaultValue={editing?.compareAtPrice} /></label>
        </div>
        <label>Material / finish<input name="material" defaultValue={editing?.material} /></label>
        <label>Description<textarea name="description" rows={3} defaultValue={editing?.description} /></label>
        <label>Upload image (JPG, PNG, SVG, WEBP, GIF, AVIF up to 8 MB){editing ? " (leave empty to keep the current one)" : ""}<input name="imageFile" type="file" accept=".jpg,.jpeg,.png,.svg,.webp,.gif,.avif,image/*" /></label>
        <label>Or paste an image link<input name="imageUrl" type="url" placeholder="https://" /></label>
        {editing && <div className="admin-thumb" style={{ backgroundImage: `url("${editing.image}")` }} role="img" aria-label="Current image" />}
        <div className="admin-checks">
          <label><input type="checkbox" name="featured" defaultChecked={editing?.featured} /> Featured on home page</label>
          <label><input type="checkbox" name="newArrival" defaultChecked={editing?.newArrival} /> Just arrived tag</label>
        </div>
        <div className="admin-row">
          <button className="button button-dark" type="submit">{editing ? "Save changes" : "Add product"}</button>
          {editing && <a className="button button-outline" href="/admin">Cancel</a>}
        </div>
      </form>

      <div className="admin-filter">
        <strong>{visible.length} products</strong>
        {["all", ...categories.map((item) => item.slug)].map((slug) => (
          <a key={slug} href={`/admin?category=${slug}`} className={slug === category ? "is-active" : ""}>{slug === "all" ? "All" : categories.find((item) => item.slug === slug)?.name}</a>
        ))}
      </div>
      <div className="admin-list">
        {visible.map((product) => (
          <div className="admin-item" key={product.id}>
            <div className="admin-thumb small" style={{ backgroundImage: `url("${product.image}")` }} />
            <div className="admin-item-copy"><b>{product.name}</b><small>{product.id} · ₹{product.price.toLocaleString("en-IN")}</small></div>
            <a className="button button-outline" href={`/admin?edit=${product.id}`}>Edit</a>
            <form action={deleteProductAction}><input type="hidden" name="id" value={product.id} /><button className="button button-outline admin-delete" type="submit">Delete</button></form>
          </div>
        ))}
      </div>
    </section>
  );
}
