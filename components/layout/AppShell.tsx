import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SignOutButton } from "./SignOutButton";

export function AppShell({
  userName,
  identities,
  children,
}: {
  userName: string | null;
  identities: Array<{ id: string; name: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <nav className="flex items-center gap-6">
          <Link href="/today" className="text-sm font-semibold tracking-tight text-text-primary">
            MindSet
          </Link>
          <Link href="/today" className="text-sm text-text-secondary hover:text-text-primary">
            Today
          </Link>
          {identities.map((identity) => (
            <Link
              key={identity.id}
              href={`/identities/${identity.id}`}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              {identity.name}
            </Link>
          ))}
          <Link href="/insights" className="text-sm text-text-secondary hover:text-text-primary">
            Insights
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {userName && <span className="text-sm text-text-muted">{userName}</span>}
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
