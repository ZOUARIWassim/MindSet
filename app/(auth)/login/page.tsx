import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl font-semibold text-text-primary">
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary">
          Sign in to check in on your systems.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-text-secondary">
        New here?{" "}
        <Link href="/signup" className="font-medium text-accent hover:text-accent-dark">
          Create an account
        </Link>
      </p>
    </div>
  );
}
