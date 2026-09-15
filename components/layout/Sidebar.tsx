"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { SignOutButton } from "./SignOutButton";

interface Identity {
  id: string;
  name: string;
}

function NavItem({
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
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "border-l-2 border-accent bg-surface-tertiary font-medium text-text-primary"
          : "border-l-2 border-transparent text-text-secondary hover:bg-surface-tertiary/60 hover:text-text-primary",
      )}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </Link>
  );
}

export function Sidebar({
  userName,
  identities,
}: {
  userName: string | null;
  identities: Identity[];
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden shrink-0 border-r border-border bg-surface-secondary/40 md:flex md:w-56 md:flex-col">
      <div className="px-4 py-5">
        <Link href="/today" className="font-display text-lg font-semibold text-text-primary">
          MindSet
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        <NavItem href="/today" label="Today" icon={CalendarCheck} isActive={pathname === "/today"} />
        <NavItem href="/insights" label="Insights" icon={Sparkles} isActive={pathname === "/insights"} />
      </nav>

      {identities.length > 0 && (
        <div className="mt-4 flex min-h-0 flex-1 flex-col px-2">
          <span className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-text-muted">
            Identities
          </span>
          <div className="flex-1 overflow-y-auto">
            {identities.map((identity) => {
              const href = `/identities/${identity.id}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={identity.id}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "border-l-2 border-accent bg-surface-tertiary font-medium text-text-primary"
                      : "border-l-2 border-transparent text-text-secondary hover:bg-surface-tertiary/60 hover:text-text-primary",
                  )}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent/60" aria-hidden="true" />
                  <span className="truncate">{identity.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3 border-t border-border px-4 py-4">
        {userName && <span className="truncate text-sm text-text-muted">{userName}</span>}
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
