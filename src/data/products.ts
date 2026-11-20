import { categories } from "@/data/categories";
import type { Product } from "@/types/product";

const designs: Record<string, string[]> = {
  jewellery: [
    "Petal Glow", "Little Starlight", "Rosy Daydream", "Golden Hour",
    "Daisy Darling", "Moonbeam", "Sweetheart", "Blush Bloom",
    "Tiny Treasure", "Sunshine Spark", "Pearl Whisper", "Twinkle Charm",
  ],
  chains: [
    "Everyday Link", "Butterfly Kiss", "Heart to Heart", "Dainty Daisy",
    "Golden Ribbon", "Moonlit Charm", "Little Locket", "Sweet Spark",
    "Pearl Drop", "Starry Night", "Rosy Loop", "Dream Chain",
  ],
  bangles: [
    "Blush Stack", "Golden Petal", "Daisy Loop", "Little Spark",
    "Sweet Circle", "Sunbeam", "Rosy Glow", "Pearl Shine",
    "Twinkle Twist", "Buttercup", "Moonlight", "Charm Cuff",
  ],
  earrings: [
    "Petal Studs", "Butterfly Wings", "Daisy Drops", "Heart Huggies",
    "Golden Bloom", "Starry Studs", "Pearl Kisses", "Rosy Hoops",
    "Moonbeam Drops", "Sweet Sparkle", "Tiny Tulips", "Blush Hearts",
  ],
  accessories: [
    "Blush Bow Clip", "Daisy Hair Pin", "Sweetheart Claw",
    "Pearl Petal Clip", "Butterfly Bow", "Rosy Twist", "Little Star Pins",
    "Golden Bloom Clip", "Dreamy Scrunchie", "Candy Heart Clip",
    "Sunshine Barrette", "Mini Flower Set",
  ],
};

const finishes = [
  { label: "Rose Gold", material: "Rose-gold tone" },
  { label: "Golden", material: "Gold-tone alloy" },
  { label: "Pearl", material: "Pearl detail" },
  { label: "Blush", material: "Enamel detail" },
  { label: "Silver", material: "Silver-tone alloy" },
];

const productPhotos = [
  "photo-1611652022419-a9419f74343d",
  "photo-1599643478518-a784e5dc4c8f",
  "photo-1611591437281-460bfbe1220a",
  "photo-1535632066927-ab7c9ab60908",
  "photo-1617038220319-276d3cfab638",
  "photo-1611652022419-a9419f74343d",
];

export const seedProducts: Product[] = categories.flatMap((category, categoryIndex) =>
  designs[category.slug].flatMap((design, designIndex) =>
    finishes.map((finish, finishIndex) => {
      const number = designIndex * finishes.length + finishIndex + 1;
      const price = 149 + ((designIndex * 83 + finishIndex * 47 + categoryIndex * 61) % 850);
      return {
        id: `${category.slug}-${String(number).padStart(3, "0")}`,
        name: `${finish.label} ${design}`,
        category: category.slug,
        price,
        compareAtPrice: price + 100 + (designIndex % 4) * 25,
        image: `/images/${productPhotos[(designIndex + finishIndex + categoryIndex) % productPhotos.length]}.jpg`,
        description: `${design} is a lovely little finishing touch, selected for its playful detail and easy-to-style feel. A thoughtful treat for you or someone special.`,
        material: finish.material,
        featured: number <= 4 && designIndex < 4,
        newArrival: designIndex >= 10,
      };
    }),
  ),
);

