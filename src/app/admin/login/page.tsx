import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import PasswordInput from "@/components/forms/PasswordInput";
import { login } from "../actions";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <section className="section shell admin-login">
      <h1>Admin login</h1>
      {!(await adminConfigured()) ? (
        <p className="admin-error">Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local and restart the server to enable the admin page.</p>
      ) : (
        <form action={login} className="admin-form">
          <label>Email<input type="email" name="email" required autoFocus autoComplete="username" /></label>
          <label>Password<PasswordInput /></label>
          {error && <p className="admin-error">Wrong email or password. Please try again.</p>}
          <button className="button button-dark" type="submit">Log in</button>
        </form>
      )}
    </section>
  );
}
