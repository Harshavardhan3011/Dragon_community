"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dragon-text-secondary mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={5}
          className={cn(
            "w-full px-4 py-3 bg-dragon-bg-700 border border-dragon-neon/16 rounded-lg text-dragon-text placeholder:text-dragon-text-muted transition-all duration-300 resize-y min-h-[120px]",
            "focus:outline-none focus:border-dragon-neon/55 focus:ring-1 focus:ring-dragon-neon/30",
            "hover:border-dragon-neon/30",
            error && "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
