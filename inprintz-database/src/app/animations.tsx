"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label?: string;
  pendingLabel?: string;
  className?: string;
}

export function SubmitButton({
  label = "Submit",
  pendingLabel = "Submitting…",
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}


