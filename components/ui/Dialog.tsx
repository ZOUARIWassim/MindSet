"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const DialogRoot = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

export function DialogContent({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-[#2b2420]/40 data-[state=open]:[animation:fade-in_180ms_ease-out] data-[state=closed]:[animation:fade-out_120ms_ease-in] dark:bg-black/60" />
      <RadixDialog.Content className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/60 bg-surface p-6 shadow-elevated data-[state=open]:[animation:scale-in_180ms_ease-out] data-[state=closed]:[animation:scale-out_120ms_ease-in]">
        <div className="mb-4 flex items-center justify-between">
          <RadixDialog.Title className="text-lg font-semibold text-text-primary">{title}</RadixDialog.Title>
          <RadixDialog.Close aria-label="Close" className="text-text-muted hover:text-text-primary">
            <X size={18} aria-hidden="true" />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
