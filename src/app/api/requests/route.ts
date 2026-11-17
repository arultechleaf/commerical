import { NextResponse } from "next/server";
import { getProducts } from "@/lib/productStore";
import { saveRequest } from "@/lib/requestStore";

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });

  if (body.kind === "order") {
    if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    const products = await getProducts();
    const rawItems = Array.isArray(body.items) ? body.items.slice(0, 100) : [];
    // Prices always come from the store, never from the browser.
    const items = rawItems.flatMap((raw) => {
      const line = raw as { id?: unknown; quantity?: unknown };
      const product = products.find((item) => item.id === line.id);
      const quantity = Math.min(99, Math.max(1, Math.floor(Number(line.quantity)) || 1));
      return product ? [{ id: product.id, name: product.name, price: product.price, quantity }] : [];
    });
    if (!items.length) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = await saveRequest({ kind: "order", name, phone, message: clean(body.message, 500), items, total });
    return NextResponse.json({ ...result, total, items });
  }

  const email = clean(body.email, 254);
  const message = clean(body.message, 3000);
  if (!email || !message) return NextResponse.json({ error: "Please fill in your email and message." }, { status: 400 });
  const result = await saveRequest({ kind: "enquiry", name, phone, email, subject: clean(body.subject, 120), message });
  return NextResponse.json(result);
}
