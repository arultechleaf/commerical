"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ name = "password", autoComplete = "current-password" }: { name?: string; autoComplete?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="password-field">
      <input type={visible ? "text" : "password"} name={name} required autoComplete={autoComplete} />
      <button type="button" className="password-toggle" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </span>
  );
}
