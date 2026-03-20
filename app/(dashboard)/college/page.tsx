"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Trophy, UserCheck, Database, Building, FileUp } from "lucide-react";
import Link from "next/link";

export default function CollegeDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/college/dashboard")
      .then(async (res) => {
        const d = await res.json();
        if (res.ok) {
           setData(d);
        } else {
           setErrorMsg(d.message || "Forbidden");
           setData(null);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("Network error loading dashboard.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading && !data) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading University Hub...</div>;
  if (!data) return <div className="p-8 text-center text-destructive font-bold text-xl">{errorMsg || "Access Denied: You must be a COLLEGE supervisor to view this page."}</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" /> 
            {data.collegeName} Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor performance exclusively for your institution.</p>
        </div>
        <Link 
          href="/college/import"
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          <FileUp className="h-4 w-4" />
          Bulk Student Import
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Enrolled Students" value={data.stats.totalStudents} icon={<GraduationCap className="h-5 w-5 text-indigo-500" />} />
        <StatCard title="Onboarded" value={data.stats.onboardedStudents} icon={<UserCheck className="h-5 w-5 text-green-500" />} />
        <StatCard title="Synced Stats" value={data.stats.syncedStatsCount} icon={<Database className="h-5 w-5 text-purple-500" />} />
        
        {data.topStudent ? (
           <div className="bg-card border rounded-lg p-5 shadow-sm flex flex-col justify-center border-amber-200 dark:border-amber-900/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-bl-lg">
                <Trophy className="h-5 w-5 text-amber-500" />
             </div>
             <h3 className="text-sm font-medium text-muted-foreground mb-1">Top Performer</h3>
             <div className="text-lg font-bold truncate pr-6">{data.topStudent.name}</div>
             <div className="text-xs text-muted-foreground font-mono mt-1">
               {data.topStudent.solved} Solved | {data.topStudent.rating || 'Unrated'} Rating
             </div>
           </div>
        ) : (
           <StatCard title="Top Performer" value={0 as any} icon={<Trophy className="h-5 w-5 text-amber-500" />} />
        )}
      </div>

      <div className="bg-card border rounded-lg shadow-sm flex flex-col h-[600px]">
        <div className="p-4 border-b bg-muted/20">
          <h2 className="text-lg font-bold">Institutional Leaderboard ({data.students.length})</h2>
        </div>
        <div className="p-0 overflow-y-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="p-3 font-medium text-muted-foreground">Internal Rank</th>
                <th className="p-3 font-medium text-muted-foreground">Student Name</th>
                <th className="p-3 font-medium text-muted-foreground">LeetCode ID</th>
                <th className="p-3 font-medium text-muted-foreground">Onboarding Status</th>
                <th className="p-3 font-medium text-muted-foreground text-right">Solved</th>
                <th className="p-3 font-medium text-muted-foreground text-right">Contest Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.students.map((u: any) => (
                <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <span className="font-semibold text-muted-foreground">#{u.internalRank}</span>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="p-3 font-mono text-xs">{u.leetcodeUsername || "-"}</td>
                  <td className="p-3">
                    {u.isOnboarded ? (
                      <span className="text-green-600 dark:text-green-500 font-medium text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">Onboarded</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-500 font-medium text-xs bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">Pending</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-bold text-lg">{u.solved}</td>
                  <td className="p-3 text-right font-medium">{u.rating || "-"}</td>
                </tr>
              ))}
              {data.students.length === 0 && (
                 <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No students enrolled yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-lg p-5 shadow-sm flex flex-col justify-center">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
