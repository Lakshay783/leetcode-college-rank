import { signIn } from "@/lib/auth";
import { getOptionalSession } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { Trophy, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  // Already logged-in users shouldn't see the login page
  const session = await getOptionalSession();
  if (session?.user) {
    redirect("/leaderboard");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/leaderboard";

  return (
    <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      {/* Optional contextual back navigation */}
      <Link 
        href="/" 
        className="absolute left-6 top-6 hidden sm:flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
         <ChevronLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Premium Glassmorphic Auth Card */}
      <div className="w-full max-w-sm space-y-8 rounded-2xl border border-zinc-200 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
        
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25 transition-transform hover:scale-105">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back
            </h1>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Sign in to track your algorithmic progress
            </p>
          </div>
        </div>

        {/* Google sign-in — server action */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl });
          }}
          className="pt-2"
        >
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {/* Native Google SVG icon with micro-hover scale */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 transition-transform group-hover:scale-110"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
          By signing in, you agree to the platform&apos;s terms and privacy guidelines.
        </p>
      </div>
    </main>
  );
}
