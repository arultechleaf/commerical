import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { storageDir } from "@/lib/productStore";
import saved from "@/data/adminCredentials.json";

const cookieName = "mithu_admin";
const adminFile = path.join(storageDir, "admin.json");

type AdminRecord = { email: string; salt: string; hash: string; secret: string };

const hashPassword = (password: string, salt: string) => scryptSync(password, salt, 64).toString("hex");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// Fallback when no environment variables are set: the login saved in
// src/data/adminCredentials.json (password stored only as a salted scrypt hash).
function savedCredentials(): AdminRecord {
  return { ...saved, secret: createHmac("sha256", "mithu-secret").update(saved.hash).digest("hex") };
}

// The login is kept in storage/admin.json. The password is stored as a salted
// scrypt hash (one-way, so it can never be decrypted back to plain text).
// On first run the record is created from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local.
async function readAdmin(): Promise<AdminRecord | null> {
  try {
    return JSON.parse(await fs.readFile(adminFile, "utf8")) as AdminRecord;
  } catch {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return savedCredentials();
    const salt = randomBytes(16).toString("hex");
    const record: AdminRecord = { email, salt, hash: hashPassword(password, salt), secret: randomBytes(32).toString("hex") };
    try {
      await fs.mkdir(storageDir, { recursive: true });
      await fs.writeFile(adminFile, JSON.stringify(record, null, 2), "utf8");
      return record;
    } catch {
      // Read-only hosting: derive the login from the environment on every request instead.
      const fixedSalt = createHmac("sha256", "mithu-salt").update(email).digest("hex").slice(0, 32);
      return { email, salt: fixedSalt, hash: hashPassword(password, fixedSalt), secret: createHmac("sha256", "mithu-secret").update(email + password).digest("hex") };
    }
  }
}

const tokenFor = (record: AdminRecord) => createHmac("sha256", record.secret).update(`session:${record.email}`).digest("hex");

export async function adminConfigured() {
  return Boolean(await readAdmin());
}

export async function credentialsMatch(email: string, password: string) {
  const record = await readAdmin();
  if (!record) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), record.email);
  const passwordOk = safeEqual(hashPassword(password, record.salt), record.hash);
  return emailOk && passwordOk;
}

export async function startAdminSession() {
  const record = await readAdmin();
  if (!record) return;
  (await cookies()).set(cookieName, tokenFor(record), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function endAdminSession() {
  (await cookies()).delete(cookieName);
}

export async function isAdmin() {
  const record = await readAdmin();
  const value = (await cookies()).get(cookieName)?.value;
  return Boolean(record && value && safeEqual(value, tokenFor(record)));
}
