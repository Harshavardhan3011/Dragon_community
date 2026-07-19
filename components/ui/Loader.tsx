import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeMap = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };

export default function Loader({ size = "md", text, className }: LoaderProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-4", className)}
      role="status"
      aria-label="Loading"
    >
      <div className={cn("relative", sizeMap[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-dragon-neon/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-dragon-neon animate-spin" />
      </div>
      {text && (
        <p className="text-sm text-dragon-text-secondary font-heading uppercase tracking-wider">
          {text}
        </p>
      )}
    </div>
  );
}
