import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl font-semibold text-text-primary">Start your system</h1>
        <p className="text-sm text-text-secondary">
          A few minutes to set up who you want to become.
        </p>
      </div>
      <SignupForm />
      <p className="text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:text-accent-dark">
          Sign in
        </Link>
      </p>
    </div>
  );
}
