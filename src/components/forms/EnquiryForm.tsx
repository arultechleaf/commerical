"use client";

import emailjs from "@emailjs/browser";
import { FormEvent, useState } from "react";

type FormStatus = { kind: "success" | "error"; message: string } | null;

export default function EnquiryForm() {
  const [status, setStatus] = useState<FormStatus>(null);
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus({
        kind: "error",
        message: "Email enquiries are not configured yet. Add the three EmailJS values from .env.example to your local environment and restart the site.",
      });
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.get("name"),
          from_email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          message: data.get("message"),
          reply_to: data.get("email"),
        },
        { publicKey },
      );
      form.reset();
      setStatus({ kind: "success", message: "Your note is on its way. We’ll get back to you as soon as we can!" });
    } catch (error) {
      console.error("EmailJS enquiry failed", error);
      setStatus({ kind: "error", message: "We couldn’t send your enquiry. Please try again or email us directly." });
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
      {status && <p className={`form-status ${status.kind}`} role="status">{status.message}</p>}
      <button className="button button-dark form-submit" type="submit" disabled={sending}>
        {sending ? "Sending your note..." : "Send your enquiry"}
      </button>
      <p className="form-disclaimer">Your details are only used to reply to this enquiry.</p>
    </form>
  );
}
