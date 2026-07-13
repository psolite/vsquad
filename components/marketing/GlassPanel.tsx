import { cn } from "@/lib/utils";

export function GlassPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border border-white/10 bg-white/4 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
        className,
      )}
      {...props}
    />
  );
}
