import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { LogOut, Trophy, ChevronRight, LayoutDashboard, Upload, Users, BarChart3, ShieldCheck } from "lucide-react";

/**
 * Premium SaaS Role Badges with precise inset rings and soft internal gradients
 */
function RoleBadge({ role }: { role: string }) {
  if (role === "ADMIN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-purple-700 ring-1 ring-inset ring-purple-500/20 dark:bg-purple-500/20 dark:text-purple-300 dark:ring-purple-500/30">
        <ShieldCheck className="h-3 w-3" /> Admin
      </span>
    );
  }
  if (role === "COLLEGE") {
     return (
       <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/30">
         <LayoutDashboard className="h-3 w-3" /> College
       </span>
     );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-zinc-700 ring-1 ring-inset ring-zinc-500/20 dark:bg-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-500/30">
      Student
    </span>
  );
}

export default async function Navbar() {
  const session = await auth();
  const role = session?.user ? (session.user as any).role : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Configuration */}
        <Link href="/" className="group flex items-center gap-3 rounded-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:shadow-blue-500/40">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="hidden text-lg font-extrabold tracking-tight text-zinc-900 sm:inline-block dark:text-zinc-50">LC College Rank</span>
          <span className="text-lg font-extrabold tracking-tight text-zinc-900 sm:hidden dark:text-zinc-50">LCR</span>
        </Link>
        
        {/* Primary Navigation - Pill Style */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {session?.user && (
            <>
              {role === "STUDENT" && (
                <>
                  <Link href="/leaderboard" className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-100/80 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50">
                    <Trophy className="hidden h-4 w-4 text-zinc-400 sm:inline-block" /> Leaderboard
                  </Link>
                  <Link href="/compare" className="hidden items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-100/80 hover:text-zinc-900 active:scale-95 sm:flex dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50">
                    <Users className="h-4 w-4 text-zinc-400" /> Compare
                  </Link>
                  <Link href="/onboarding" className="rounded-full px-3.5 py-2 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-100/80 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50">
                    Profile
                  </Link>
                </>
              )}
              {role === "COLLEGE" && (
                <>
                  <Link href="/college" className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-100/80 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50">
                    <BarChart3 className="hidden h-4 w-4 text-zinc-400 sm:inline-block" /> Dashboard
                  </Link>
                  <Link href="/college/import" className="hidden items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-100/80 hover:text-zinc-900 active:scale-95 sm:flex dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50">
                    <Upload className="h-4 w-4 text-zinc-400" /> Import
                  </Link>
                </>
              )}
              {role === "ADMIN" && (
                <>
                  <Link href="/admin" className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-100/80 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50">
                    <ShieldCheck className="hidden h-4 w-4 text-zinc-400 sm:inline-block" /> Command Center
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* User Identity & Actions */}
        <div className="flex items-center gap-4">
          {session?.user ? (
             <div className="flex items-center gap-3 sm:gap-5">
                <div className="hidden flex-col items-end justify-center md:flex">
                   <span className="mb-1 text-sm font-bold leading-none tracking-tight text-zinc-900 dark:text-zinc-100">{session.user.name}</span>
                   <RoleBadge role={role} />
                </div>
                
                <div className="hidden h-8 w-px bg-zinc-200 md:block dark:bg-zinc-800" aria-hidden="true" />
                
                {/* Premium Pill Sign Out */}
                <form action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}>
                  <button type="submit" className="group flex h-9 w-9 items-center justify-center gap-2 rounded-full border border-zinc-200/80 bg-white px-0 text-sm font-semibold text-zinc-600 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 sm:w-auto sm:px-4 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
                     <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                     <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </form>
             </div>
          ) : (
             <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-sm shadow-blue-500/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98]">
               Sign In <ChevronRight className="ml-1 h-4 w-4" />
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}
