"use client";

import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function Collapsible({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <RadixCollapsible.Root open={open} onOpenChange={setOpen}>
      <RadixCollapsible.Trigger className="flex w-full items-center justify-between gap-2 rounded-lg py-1.5 text-left text-sm font-medium text-text-secondary hover:text-text-primary">
        {label}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content className="overflow-hidden data-[state=open]:[animation:slide-down-in_180ms_ease-out] data-[state=closed]:[animation:slide-down-out_150ms_ease-in]">
        <div className="flex flex-col gap-3 pb-1 pt-3">{children}</div>
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
}
