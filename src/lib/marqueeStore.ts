import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { blobEnabled, readJson, writeJson } from "@/lib/blobStore";
import { readOnlyMessage, storageDir } from "@/lib/productStore";

// The scrolling image strip on the home page: exactly 5 slots, set from the admin page.
export const SLIDE_COUNT = 5;
export type Slide = { image: string; title: string; link: string; offer?: string; price?: number; oldPrice?: number; productId?: string };

const file = path.join(storageDir, "marquee.json");
const empty = (): Slide[] => Array.from({ length: SLIDE_COUNT }, () => ({ image: "", title: "", link: "" }));

function normalize(list: Slide[] | null): Slide[] {
  const slides = empty();
  (list ?? []).slice(0, SLIDE_COUNT).forEach((slide, i) => (slides[i] = { ...slides[i], ...slide }));
  return slides;
}

export async function getSlides(): Promise<Slide[]> {
  if (blobEnabled) {
    const online = await readJson<Slide[]>("data/marquee.json");
    if (online) return normalize(online);
  }
  try {
    return normalize(JSON.parse(await fs.readFile(file, "utf8")) as Slide[]);
  } catch {
    return empty();
  }
}

export async function saveSlides(slides: Slide[]) {
  try {
    if (blobEnabled) return await writeJson("data/marquee.json", slides);
    await fs.mkdir(storageDir, { recursive: true });
    await fs.writeFile(file, JSON.stringify(slides, null, 2), "utf8");
  } catch (error) {
    if (blobEnabled) throw new Error(`Saving to Vercel Blob failed: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(readOnlyMessage);
  }
}
