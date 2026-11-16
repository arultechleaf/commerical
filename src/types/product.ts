export type CategorySlug =
  | "jewellery"
  | "chains"
  | "bangles"
  | "earrings"
  | "accessories";

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  material: string;
  featured?: boolean;
  newArrival?: boolean;
};
