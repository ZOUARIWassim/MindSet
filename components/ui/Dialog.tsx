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
      <RadixDialog.Overlay className="fixed inset-0 bg-black/40" />
      <RadixDialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <RadixDialog.Title className="text-lg font-semibold text-text-primary">{title}</RadixDialog.Title>
          <RadixDialog.Close className="text-text-muted hover:text-text-primary">
            <X size={18} />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
