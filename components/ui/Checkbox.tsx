"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function Checkbox({
  checked,
  onCheckedChange,
  className,
  id,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  id?: string;
}) {
  return (
    <RadixCheckbox.Root
      id={id}
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(value === true)}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded border border-border bg-surface-secondary data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        className,
      )}
    >
      <RadixCheckbox.Indicator className="text-white">
        <Check size={14} />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}
