import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-tight text-text-primary">
          MindSet
        </span>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        {children}
      </main>
    </div>
  );
}
