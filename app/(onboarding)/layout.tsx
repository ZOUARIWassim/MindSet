import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-tight text-text-primary">MindSet</span>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 justify-center px-6 pb-16">
        <div className="w-full max-w-xl">{children}</div>
      </main>
    </div>
  );
}
