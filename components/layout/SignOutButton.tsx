"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm font-medium text-text-secondary hover:text-text-primary"
    >
      Sign out
    </button>
  );
}
