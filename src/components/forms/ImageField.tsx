"use client";

import { ChangeEvent, useState } from "react";

const MAX_SIDE = 1600;

// Phone photos are often 3-8 MB and hosting limits requests to ~4.5 MB, so the photo
// is shrunk in the browser (max 1600 px, JPEG) before the form is sent.
async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

export default function ImageField({ label }: { label: string }) {
  const [note, setNote] = useState("");

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return setNote("");
    try {
      const small = await shrink(file);
      if (small !== file) {
        const transfer = new DataTransfer();
        transfer.items.add(small);
        input.files = transfer.files;
      }
      setNote(`${small.name} · ${(small.size / 1024 / 1024).toFixed(2)} MB`);
    } catch {
      setNote(`${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    }
  }

  return (
    <label>
      {label}
      <input name="imageFile" type="file" accept=".jpg,.jpeg,.png,.svg,.webp,.gif,.avif,image/*" onChange={onChange} />
      {note && <small>{note}</small>}
    </label>
  );
}
