"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export default function FormButton({
  children,
  isLoading = false,
  variant = "primary",
  disabled,
  ...props
}: FormButtonProps) {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        relative w-full rounded-lg px-6 py-3.5 text-sm font-semibold tracking-wide
        transition-all duration-200
        ${isPrimary
          ? `bg-moss-600 text-white shadow-lg shadow-moss-900/50
             hover:bg-moss-500 hover:shadow-moss-800/60
             active:bg-moss-700 active:scale-[0.98]`
          : `border border-moss-700/50 bg-transparent text-moss-300
             hover:border-moss-600/60 hover:text-white hover:bg-moss-900/30`
        }
        ${isDisabled ? "cursor-not-allowed opacity-50" : ""}
      `}
      disabled={isDisabled}
      {...props}
    >
      <span className={`flex items-center justify-center gap-2 ${isLoading ? "opacity-0" : ""}`}>
        {children}
      </span>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
