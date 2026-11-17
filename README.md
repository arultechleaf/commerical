# Mithu Cute Corner

A static-catalog Next.js storefront for jewellery, chains, bangles, earrings and hair accessories.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add your EmailJS settings.
3. Start the development server with `npm run dev`.

The enquiry form uses EmailJS in the browser. Configure an EmailJS template with `from_name`, `from_email`, `phone`, `subject`, `message` and `reply_to` parameters. Without those three environment values, the form reports that email is not configured instead of pretending an enquiry was sent.

The storefront includes a floating, animated robot mascot with a rotating speech bubble. Clicking it opens a product-recommendation panel with links to product details and a WhatsApp contact button. Customer mobile-number/OTP login is not configured.

## Catalogue and session behavior

- Product and category information is maintained in `src/data/products.ts` and `src/data/categories.ts`. The current static catalogue contains 300 sample products; update the source data to change products and prices.
- Cart and wishlist state is held in Redux memory for the current page session. It is not written to local storage or a database.
- Product photography uses Unsplash image URLs; replace them with your own product photography as it becomes available. The supplied logo is `public/logo/logo.jpg`.
- The storefront supports catalogue browsing, search, category filters, sorting, product details, cart, wishlist and enquiries. It does not process payments, create orders, or provide customer accounts.

## Commands

- `npm run dev` — local development
- `npm run lint` — ESLint
- `npm run build` — production build
