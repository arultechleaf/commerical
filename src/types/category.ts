import type { CategorySlug } from "./product";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
};
