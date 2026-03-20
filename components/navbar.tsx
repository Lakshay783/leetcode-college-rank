import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { LogOut, Trophy } from "lucide-react";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-lg hover:opacity-80 transition-opacity">
          <Trophy className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline-block">LeetCode College Rank</span>
          <span className="sm:hidden">LC Rank</span>
        </Link>
        
        <nav className="flex items-center gap-4 md:gap-6">
          {session?.user && (
            <>
              {(session.user as any).role === "STUDENT" && (
                <>
                  <Link href="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">Leaderboard</Link>
                  <Link href="/compare" className="hidden sm:inline-block text-sm font-medium text-muted-foreground hover:text-foreground">Compare</Link>
                  <Link href="/onboarding" className="text-sm font-medium text-muted-foreground hover:text-foreground">Profile</Link>
                </>
              )}
              {(session.user as any).role === "COLLEGE" && (
                <>
                  <Link href="/college" className="text-sm font-medium text-muted-foreground hover:text-foreground">Hub</Link>
                  <Link href="/college/import" className="hidden sm:inline-block text-sm font-medium text-muted-foreground hover:text-foreground">Import</Link>
                </>
              )}
              {(session.user as any).role === "ADMIN" && (
                <>
                  <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">Admin Center</Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {session?.user ? (
             <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                   <span className="text-sm font-medium leading-none">{session.user.name}</span>
                   <span className="text-xs text-muted-foreground mt-1 bg-muted px-1.5 py-0.5 rounded">{(session.user as any).role}</span>
                </div>
                {/* Native NextAuth secure server action for Zero-JS logout perfectly mapped */}
                <form action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}>
                  <button type="submit" className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors p-2 rounded-md hover:bg-destructive/10">
                     <LogOut className="h-4 w-4" />
                     <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </form>
             </div>
          ) : (
             <Link href="/login" className="flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
               Sign In
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}
