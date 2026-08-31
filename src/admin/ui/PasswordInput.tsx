"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}

export function PasswordInput({
  value,
  onChange,
  ariaLabel,
  placeholder,
  autoComplete,
  required,
  className,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const show = visible ? "text" : "password";

  return (
    <div className="relative">
      <input
        type={show}
        aria-label={ariaLabel}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={"pr-10 " + (className ?? "")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
