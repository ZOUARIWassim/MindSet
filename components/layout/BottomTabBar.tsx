"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Menu, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { DialogRoot, DialogContent } from "@/components/ui/Dialog";
import { ThemeToggle } from "./ThemeToggle";
import { SignOutButton } from "./SignOutButton";

interface Identity {
  id: string;
  name: string;
}

function TabLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" | "false" }>;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5",
        isActive ? "text-accent" : "text-text-secondary",
      )}
    >
      <Icon size={20} aria-hidden="true" />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

export function BottomTabBar({
  userName,
  identities,
}: {
  userName: string | null;
  identities: Identity[];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-border bg-surface/95 backdrop-blur md:hidden">
        <TabLink href="/today" label="Today" icon={CalendarCheck} isActive={pathname === "/today"} />
        <TabLink href="/insights" label="Insights" icon={Sparkles} isActive={pathname === "/insights"} />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5",
            menuOpen ? "text-accent" : "text-text-secondary",
          )}
        >
          <Menu size={20} aria-hidden="true" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </nav>

      <DialogRoot open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent title="Menu">
          <div className="flex flex-col gap-4">
            {identities.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="px-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Identities
                </span>
                {identities.map((identity) => (
                  <Link
                    key={identity.id}
                    href={`/identities/${identity.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-surface-tertiary"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent/60" aria-hidden="true" />
                    {identity.name}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-4">
              {userName && <span className="truncate text-sm text-text-muted">{userName}</span>}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <SignOutButton />
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
