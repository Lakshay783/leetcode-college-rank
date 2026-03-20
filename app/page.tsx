import Link from "next/link";
import { Trophy, Code2, Users, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-background to-muted/20 px-4 py-16">
      <div className="max-w-4xl text-center space-y-8 fade-in-up">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-4 shadow-sm">
           <Trophy className="h-10 w-10" />
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground">
          Elevate Your <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Engineering</span> Talent
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          The ultimate platform for universities to track, rank, and showcase their students' LeetCode performance through unified real-time institutional leaderboards.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {session?.user ? (
            <Link 
              href={(session.user as any).role === "ADMIN" ? "/admin" : (session.user as any).role === "COLLEGE" ? "/college" : "/leaderboard"} 
              className="flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Go to Dashboard <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
          )}
          <Link 
            href="https://github.com/shadcn/ui" 
            target="_blank"
            className="flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-input bg-background font-semibold hover:bg-accent hover:text-accent-foreground transition-colors text-lg shadow-sm w-full sm:w-auto"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-32">
         <div className="flex flex-col items-center text-center p-8 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6 border border-blue-200 dark:border-blue-800">
               <Trophy className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Automated Rankings</h3>
            <p className="text-muted-foreground leading-relaxed">Sync directly with LeetCode to build completely hands-off competitive ladders reflecting true analytical scaling.</p>
         </div>
         <div className="flex flex-col items-center text-center p-8 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-6 border border-green-200 dark:border-green-800">
               <Users className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Institutional Hubs</h3>
            <p className="text-muted-foreground leading-relaxed">Colleges get isolated command centers to bulk-upload students via CSVs and manage cohorts securely.</p>
         </div>
         <div className="flex flex-col items-center text-center p-8 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-800">
               <Code2 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Detailed Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">Instantly compare contest ratings, total solved, and granular difficulty splits between any peers easily.</p>
         </div>
      </div>
    </div>
  );
}
