import { storeInfo } from "@/data/storeInfo";

export type Policy = {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

const contact = `${storeInfo.email} or ${storeInfo.phone}`;

// Starter wording. Please review it and adjust to how Mithu Cute Corner really works.
export const policies: Policy[] = [
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    intro: `By using the ${storeInfo.name} website and placing an order, you agree to these terms.`,
    sections: [
      { heading: "Our products", body: ["We try to show colours and details as accurately as we can. Slight differences can happen because of screens, lighting and handmade finishing.", "All prices are in Indian Rupees (₹) and may change without notice. Availability is confirmed when we reply to your order or enquiry."] },
      { heading: "Orders and payment", body: ["Placing an order on this website sends us your request. Your order is confirmed only after we contact you, usually on WhatsApp, to confirm availability, payment and delivery.", "We may cancel an order if an item is out of stock or the details are unclear, and we will let you know."] },
      { heading: "Using the website", body: ["Please give correct details when you order or enquire. Do not misuse the site or try to disrupt it.", "All photos, text and the Mithu Cute Corner name and logo belong to us and may not be copied without permission."] },
      { heading: "Contact", body: [`Questions about these terms? Reach us at ${contact}.`] },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro: `${storeInfo.name} respects your privacy. This explains what we collect and how we use it.`,
    sections: [
      { heading: "What we collect", body: ["When you place an order or send an enquiry we collect your name, phone number, email (for enquiries), your message and the items you ordered.", "Your bag and wishlist are kept in your own browser on your device."] },
      { heading: "How we use it", body: ["We use your details only to reply to you, confirm and deliver your order, and keep a record of it. We do not sell your details to anyone."] },
      { heading: "Sharing", body: ["We only share what is needed to deliver your order, for example with a courier. Messages sent through WhatsApp or email are also handled by those services under their own policies."] },
      { heading: "Your choices", body: [`You can ask us to see or delete the details we hold about you at any time by contacting ${contact}.`] },
    ],
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    intro: "How and when your Mithu order reaches you.",
    sections: [
      { heading: "Delivery area and time", body: ["We deliver across India. Orders usually arrive in 3–5 days after they are confirmed and packed. Remote areas can take a little longer."] },
      { heading: "Shipping charges", body: ["Shipping charges, if any, are confirmed with you before you pay. Every order comes with free gift wrap."] },
      { heading: "Order processing", body: ["We pack your order after payment is confirmed. We will message you on WhatsApp with tracking details once it is shipped."] },
      { heading: "Damaged or wrong items", body: [`If something arrives damaged or is not what you ordered, please contact us within 48 hours with a photo at ${contact}, and we will make it right.`] },
    ],
  },
];
