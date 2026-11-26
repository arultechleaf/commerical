import Link from "next/link";
import type { Slide } from "@/lib/marqueeStore";
import SlideActions from "./SlideActions";

// Endless scrolling strip of the admin-chosen images. Pure CSS: the list is drawn twice
// and the track slides by exactly one copy (-50%), so the loop never shows a gap.
export default function ImageMarquee({ slides }: { slides: Slide[] }) {
  if (!slides.length) return null;
  // Repeat so one copy is always wider than the screen, then double it for the seamless loop.
  const copy = Array.from({ length: Math.ceil(8 / slides.length) }, () => slides).flat();
  const items = [...copy, ...copy];

  return (
    <section className="image-marquee" aria-label="Highlights">
      <div className="image-marquee-track">
        {items.map((slide, i) => {
          const hidden = i >= slides.length;
          const name = slide.title || "this product";
          const href = slide.link || (slide.productId ? `/products/${slide.productId}` : "");
          const hasInfo = Boolean(slide.title || slide.price !== undefined);
          return (
            <div key={i} className="image-marquee-card" aria-hidden={hidden || undefined}>
              <div className="image-marquee-media">
                <div className="image-marquee-photo" role="img" aria-label={name} style={{ backgroundImage: `url("${slide.image}")` }} />
                {slide.offer && <span className="image-marquee-offer">{slide.offer}</span>}
                {slide.productId && <SlideActions productId={slide.productId} name={name} hidden={hidden} />}
              </div>
              {hasInfo && (
                <div className="image-marquee-info">
                  {slide.title && <strong>{slide.title}</strong>}
                  {slide.price !== undefined && (
                    <span className="image-marquee-price">
                      ₹{slide.price.toLocaleString("en-IN")}
                      {slide.oldPrice !== undefined && slide.oldPrice > slide.price && <s>₹{slide.oldPrice.toLocaleString("en-IN")}</s>}
                    </span>
                  )}
                </div>
              )}
              {href && <Link href={href} className="image-marquee-link" aria-label={`View ${name}`} tabIndex={hidden ? -1 : undefined} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
