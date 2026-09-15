import { Sidebar } from "./Sidebar";
import { BottomTabBar } from "./BottomTabBar";

interface Identity {
  id: string;
  name: string;
}

export function AppShell({
  userName,
  identities,
  children,
}: {
  userName: string | null;
  identities: Identity[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar userName={userName} identities={identities} />
      <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8">{children}</main>
      <BottomTabBar userName={userName} identities={identities} />
    </div>
  );
}
