import type { Product } from "@/types/product";

const NEW_DAYS = 30;

// A product counts as "new" only if it carries the Just-arrived tag AND was added
// (or tagged) in the last NEW_DAYS days. Old sample data never qualifies.
export function isNewArrival(product: Product, now = Date.now()) {
  return Boolean(product.newArrival && product.createdAt && now - product.createdAt <= NEW_DAYS * 86_400_000);
}
