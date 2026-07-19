"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { ButtonVariant, ButtonSize } from "@/types";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  href?: string;
  isExternal?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-dragon-neon text-dragon-bg-900 hover:bg-dragon-light-green font-bold shadow-[0_0_16px_rgba(0,255,102,0.25)] hover:shadow-[0_0_24px_rgba(0,255,102,0.4)]",
  secondary:
    "bg-transparent border border-dragon-neon/30 text-dragon-neon hover:border-dragon-neon/70 hover:bg-dragon-neon/10",
  ghost:
    "bg-transparent text-dragon-text-secondary hover:text-dragon-neon hover:bg-dragon-neon/5",
  icon:
    "bg-transparent text-dragon-text-secondary hover:text-dragon-neon hover:bg-dragon-neon/10 p-2",
  danger:
    "bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:border-red-500/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      href,
      isExternal,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-heading uppercase tracking-wider transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dragon-neon disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
      variantStyles[variant],
      variant !== "icon" && sizeStyles[size],
      className
    );

    if (href) {
      return (
        <a
          href={href}
          className={classes}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {isLoading ? <LoadingSpinner /> : children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <LoadingSpinner /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default Button;
