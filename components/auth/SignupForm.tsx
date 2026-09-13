"use client";

import { useActionState, useRef } from "react";
import { signup, type SignupState } from "@/app/actions/auth";

const initialState: SignupState = { error: null };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const timezoneRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action={formAction}
      onSubmit={() => {
        if (timezoneRef.current) {
          timezoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
      }}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <input ref={timezoneRef} type="hidden" name="timezone" defaultValue="UTC" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-text-secondary">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-text-secondary">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-text-secondary">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <p className="text-xs text-text-muted">At least 8 characters.</p>
      </div>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
