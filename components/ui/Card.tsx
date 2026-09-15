import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type CardPadding = "sm" | "md" | "lg";

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  className,
  padding = "md",
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { padding?: CardPadding; interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface-secondary shadow-soft",
        PADDING_CLASSES[padding],
        interactive && "cursor-pointer transition-shadow duration-200 hover:shadow-elevated",
        className,
      )}
      {...props}
    />
  );
}
