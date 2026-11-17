import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminAuth";
import { getRequests } from "@/lib/requestStore";

export const metadata: Metadata = { title: "Orders & enquiries", robots: { index: false } };

export default async function RequestsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const requests = await getRequests();
  return (
    <section className="section shell admin-page">
      <div className="admin-head">
        <h1>Orders &amp; enquiries</h1>
        <a className="button button-outline" href="/admin">Back to products</a>
      </div>
      <div className="admin-list">
        {requests.length ? requests.map((r) => (
          <article className="admin-card request-card" key={r.id}>
            <div className="request-head">
              <strong className="request-id">{r.id}</strong>
              <small>{new Date(r.createdAt).toLocaleString("en-IN")}</small>
            </div>
            <p><b>{r.name}</b>{r.phone ? ` · ${r.phone}` : ""}{r.email ? ` · ${r.email}` : ""}</p>
            {r.subject && <p>{r.subject}</p>}
            {r.message && <p>{r.message}</p>}
            {r.items && (
              <ul>
                {r.items.map((item) => <li key={item.id}>{item.name} ({item.id.toUpperCase()}) × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString("en-IN")}</li>)}
                <li><b>Total ₹{(r.total ?? 0).toLocaleString("en-IN")}</b></li>
              </ul>
            )}
          </article>
        )) : <p className="admin-empty">No orders or enquiries yet.</p>}
      </div>
    </section>
  );
}
