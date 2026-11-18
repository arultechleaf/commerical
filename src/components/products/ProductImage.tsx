import Image from "next/image";

// Hosts the image optimizer may fetch from (see next.config.ts).
const optimizable = /^https:\/\/(images\.unsplash\.com|[^/]+\.public\.blob\.vercel-storage\.com)\//;

// Shows a product photo at the size the screen needs: phones on mobile data get a
// small WebP/AVIF copy instead of the full original (which can be several MB).
export default function ProductImage({ src, alt, sizes, priority = false }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  const isLocal = src.startsWith("/");
  const canOptimize = !src.endsWith(".svg") && (isLocal || optimizable.test(src));
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!canOptimize}
      style={{ objectFit: "cover" }}
    />
  );
}
