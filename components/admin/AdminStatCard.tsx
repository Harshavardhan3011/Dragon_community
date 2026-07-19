import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function AdminStatCard({
  label,
  value,
  description,
  icon,
  className,
}: AdminStatCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-dragon-neon/10 flex items-center justify-center text-dragon-neon">
          {icon}
        </div>
      </div>
      <div className="font-heading text-3xl font-bold text-dragon-text mb-1">{value}</div>
      <div className="text-sm font-medium text-dragon-text-secondary">{label}</div>
      {description && <div className="text-xs text-dragon-text-muted mt-1">{description}</div>}
    </div>
  );
}
