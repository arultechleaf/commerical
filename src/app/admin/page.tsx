import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { categories } from "@/data/categories";
import { isAdmin } from "@/lib/adminAuth";
import { getProducts } from "@/lib/productStore";
import ImageField from "@/components/forms/ImageField";
import { deleteProductAction, logout, saveProductAction } from "./actions";

export const metadata: Metadata = { title: "Manage products", robots: { index: false } };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; category?: string; q?: string | string[]; error?: string; saved?: string; deleted?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { edit, category = "all", q, error, saved, deleted } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const products = await getProducts();
  const editing = edit ? products.find((product) => product.id === edit) : undefined;
  const normalizedQuery = query.toLowerCase();
  const visible = products.filter((product) => {
    const categoryName = categories.find((item) => item.slug === product.category)?.name ?? "";
    const matchesCategory = category === "all" || product.category === category;
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.id.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      categoryName.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  const listParams = new URLSearchParams();
  if (category !== "all") listParams.set("category", category);
  if (query) listParams.set("q", query);

  return (
    <section className="section shell admin-page">
      <div className="admin-head">
        <h1>Manage products</h1>
        <div className="admin-row">
          <a className="button button-outline" href="/admin/requests">Orders &amp; enquiries</a>
          <form action={logout}><button className="button button-outline" type="submit">Log out</button></form>
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      {saved && <p className="admin-ok">Product saved.</p>}
      {deleted && <p className="admin-ok">Product deleted.</p>}

      <form action={saveProductAction} className="admin-form admin-card" key={editing?.id ?? "new"}>
        <h2>{editing ? `Edit: ${editing.name}` : "Add a new product"}</h2>
        <input type="hidden" name="returnCategory" value={category} />
        <input type="hidden" name="returnQuery" value={query} />
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <label>Name<input name="name" required defaultValue={editing?.name} /></label>
        {editing
          ? <label>Product code<input value={editing.id.toUpperCase()} readOnly /></label>
          : <label>Product code (optional, e.g. CHAINS-008, leave empty for automatic)<input name="code" maxLength={40} placeholder="Automatic" /></label>}
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
        <ImageField label={`Upload image (JPG, PNG, SVG, WEBP, GIF, AVIF)${editing ? " (leave empty to keep the current one)" : ""}`} />
        <label>Or paste an image link<input name="imageUrl" type="url" placeholder="https://" /></label>
        {editing && <div className="admin-thumb" style={{ backgroundImage: `url("${editing.image}")` }} role="img" aria-label="Current image" />}
        <div className="admin-checks">
          <label><input type="checkbox" name="featured" defaultChecked={editing?.featured} /> Featured on home page</label>
          <label><input type="checkbox" name="newArrival" defaultChecked={editing ? editing.newArrival : true} /> Just arrived tag</label>
        </div>
        <div className="admin-row">
          <button className="button button-dark" type="submit">{editing ? "Save changes" : "Add product"}</button>
          {editing && <a className="button button-outline" href={`/admin${listParams.size ? `?${listParams}` : ""}`}>Cancel</a>}
        </div>
      </form>

      <form className="admin-search" action="/admin">
        <input type="hidden" name="category" value={category} />
        <label htmlFor="admin-product-search">Search products</label>
        <div>
          <input
            id="admin-product-search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by product name or ID"
          />
          <button className="button button-dark" type="submit">Search</button>
          {query && <a className="button button-outline" href={`/admin${category !== "all" ? `?category=${encodeURIComponent(category)}` : ""}`}>Clear</a>}
        </div>
      </form>

      <div className="admin-filter">
        <strong>{visible.length} products</strong>
        {["all", ...categories.map((item) => item.slug)].map((slug) => (
          <a
            key={slug}
            href={`/admin?${new URLSearchParams({ ...(query ? { q: query } : {}), category: slug })}`}
            className={slug === category ? "is-active" : ""}
          >
            {slug === "all" ? "All" : categories.find((item) => item.slug === slug)?.name}
          </a>
        ))}
      </div>
      <div className="admin-list">
        {visible.length ? visible.map((product) => {
          const editParams = new URLSearchParams(listParams);
          editParams.set("edit", product.id);
          return (
            <div className="admin-item" key={product.id}>
              <div className="admin-thumb small" style={{ backgroundImage: `url("${product.image}")` }} />
              <div className="admin-item-copy"><b>{product.name}</b><small>{product.id} · ₹{product.price.toLocaleString("en-IN")}</small></div>
              <a className="button button-outline" href={`/admin?${editParams}`}>Edit</a>
              <form action={deleteProductAction}>
                <input type="hidden" name="id" value={product.id} />
                <input type="hidden" name="returnCategory" value={category} />
                <input type="hidden" name="returnQuery" value={query} />
                <button className="button button-outline admin-delete" type="submit">Delete</button>
              </form>
            </div>
          );
        }) : <p className="admin-empty">No products match “{query}”.</p>}
      </div>
    </section>
  );
}
