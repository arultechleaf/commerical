"use client";

import emailjs from "@emailjs/browser";
import { FormEvent, useState } from "react";
import { storeInfo } from "@/data/storeInfo";

type FormStatus = { kind: "success" | "error"; message: string; id?: string; whatsapp?: string } | null;

export default function EnquiryForm() {
  const [status, setStatus] = useState<FormStatus>(null);
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    setSending(true);
    try {
      // 1. Store the enquiry and get its number.
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "enquiry", ...fields }),
      });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.error || "Could not save your enquiry.");
      const id: string = saved.id;

      // 2. Email it too (optional, only when EmailJS is configured).
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              request_id: id,
              from_name: fields.name,
              from_email: fields.email,
              phone: fields.phone,
              subject: `[${id}] ${fields.subject}`,
              message: fields.message,
              reply_to: fields.email,
            },
            { publicKey },
          );
        } catch (error) {
          console.error("EmailJS enquiry failed", error);
        }
      }

      const text = `Hi ${storeInfo.name}! Enquiry ${id}\nName: ${fields.name}${fields.phone ? `\nPhone: ${fields.phone}` : ""}\nSubject: ${fields.subject}\n${fields.message}`;
      form.reset();
      setStatus({
        kind: "success",
        id,
        message: "Your note is on its way. We’ll get back to you as soon as we can!",
        whatsapp: `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(text)}`,
      });
    } catch (error) {
      console.error("Enquiry failed", error);
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "We couldn’t send your enquiry. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <div className="form-grid">
        <label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="What should we call you?" /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
      </div>
      <div className="form-grid">
        <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="+91" /></label>
        <label>What can we help with?<input name="subject" required maxLength={120} placeholder="A product, an order, a little question..." /></label>
      </div>
      <label>Your message<textarea name="message" required minLength={5} maxLength={3000} rows={5} placeholder="Tell us a little more..." /></label>
      {status && (
        <div className={`form-status ${status.kind}`} role="status">
          {status.id && <strong className="request-id">Enquiry number: {status.id}</strong>}
          <p>{status.message}</p>
          {status.whatsapp && <a className="button button-outline" href={status.whatsapp} target="_blank" rel="noopener noreferrer">Also send on WhatsApp</a>}
        </div>
      )}
      <button className="button button-dark form-submit" type="submit" disabled={sending}>
        {sending ? "Sending your note..." : "Send your enquiry"}
      </button>
      <p className="form-disclaimer">Your details are only used to reply to this enquiry.</p>
    </form>
  );
}
