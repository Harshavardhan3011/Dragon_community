"use client";

import { Package } from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-dragon-neon/10 flex items-center justify-center mb-6">
        {icon || <Package className="w-8 h-8 text-dragon-neon" />}
      </div>
      <h3 className="font-heading text-xl font-bold text-dragon-text mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-dragon-text-secondary max-w-md mb-6">{description}</p>
      )}
      {actionLabel && (
        <Button
          variant="secondary"
          href={actionHref}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
