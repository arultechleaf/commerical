import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { storageDir } from "@/lib/productStore";

export type RequestKind = "enquiry" | "order";

export type RequestRecord = {
  id: string;
  kind: RequestKind;
  createdAt: number;
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  items?: { id: string; name: string; price: number; quantity: number }[];
  total?: number;
};

const requestsFile = path.join(storageDir, "requests.json");
const prefix: Record<RequestKind, string> = { enquiry: "ENQ", order: "ORD" };

export async function getRequests(): Promise<RequestRecord[]> {
  try {
    return JSON.parse(await fs.readFile(requestsFile, "utf8")) as RequestRecord[];
  } catch {
    return [];
  }
}

// Saves the request and returns its number (ENQ-0001, ORD-0001 ...).
// On a read-only host the save fails; a unique time-based number is still
// returned so the customer can quote it, and `saved` is false.
export async function saveRequest(input: Omit<RequestRecord, "id" | "createdAt">) {
  const all = await getRequests();
  const used = all
    .filter((record) => record.kind === input.kind)
    .map((record) => Number(record.id.split("-").pop()) || 0);
  const id = `${prefix[input.kind]}-${String(Math.max(0, ...used) + 1).padStart(4, "0")}`;
  const record: RequestRecord = { ...input, id, createdAt: Date.now() };
  try {
    await fs.mkdir(storageDir, { recursive: true });
    const tmp = `${requestsFile}.tmp`;
    await fs.writeFile(tmp, JSON.stringify([record, ...all], null, 2), "utf8");
    await fs.rename(tmp, requestsFile);
    return { id, saved: true };
  } catch {
    return { id: `${prefix[input.kind]}-${Date.now().toString(36).toUpperCase()}`, saved: false };
  }
}
