"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Trophy, UserCheck, Database, Building, FileUp, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";

function StatCard({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">{typeof value === 'number' ? value.toLocaleString() : value}</span>
      </div>
    </div>
  );
}

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

  if (isLoading && !data) return (
     <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading University Hub...</p>
     </div>
  );
  if (!data) return (
     <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
           <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{errorMsg || "Access Denied"}</h2>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">You must be a COLLEGE supervisor to view this dashboard.</p>
     </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
              <Building className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{data.collegeName} Portal</h1>
          </div>
          <p className="ml-[52px] text-sm font-medium text-zinc-500 dark:text-zinc-400">
             Monitor student performance metrics exclusively for your institution.
          </p>
        </div>

        <Link 
          href="/college/import"
          className="group flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 md:w-auto"
        >
          <FileUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          Bulk Student Import
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Enrolled Students" value={data.stats.totalStudents} icon={<GraduationCap className="h-5 w-5 text-indigo-500" />} />
        <StatCard title="Onboarded Profiles" value={data.stats.onboardedStudents} icon={<UserCheck className="h-5 w-5 text-emerald-500" />} />
        <StatCard title="Synced LC Stats" value={data.stats.syncedStatsCount} icon={<Database className="h-5 w-5 text-purple-500" />} />
        
        {data.topStudent ? (
           <div className="group relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:border-amber-900/30 dark:from-amber-950/20 dark:to-zinc-950/50">
             <div className="absolute -right-2 -top-2 rounded-bl-2xl bg-amber-100/80 p-3 decoration-transparent backdrop-blur-md dark:bg-amber-900/40">
                <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-500" />
             </div>
             <h3 className="text-sm font-semibold text-amber-800/70 dark:text-amber-500/70">Top Performer</h3>
             <div className="mt-4 flex items-baseline gap-2 pr-8">
               <span className="truncate text-2xl font-black tracking-tight text-amber-900 dark:text-amber-100">{data.topStudent.name}</span>
             </div>
             <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-amber-700/80 dark:text-amber-400/80">
               <span>{data.topStudent.solved.toLocaleString()} Solved</span>
               <span className="h-1 w-1 rounded-full bg-amber-300 dark:bg-amber-700"></span>
               <span>{data.topStudent.rating ? Math.round(data.topStudent.rating).toLocaleString() : 'Unrated'} Rating</span>
             </div>
           </div>
        ) : (
           <StatCard title="Top Performer" value="-" icon={<Trophy className="h-5 w-5 text-amber-500" />} />
        )}
      </div>

      {/* Institutional Roster */}
      <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
        <div className="border-b border-zinc-200/60 bg-white/40 p-5 dark:border-zinc-800/60 dark:bg-zinc-900/20">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Institutional Roster <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{data.students.length}</span></h2>
        </div>
        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-10 border-b border-zinc-200/60 bg-zinc-50/90 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/90">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400 w-[100px]">Camp Rank</th>
                <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">Student Profile</th>
                <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">LeetCode ID</th>
                <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">Onboarding Route</th>
                <th className="px-5 py-3.5 font-semibold text-right text-zinc-500 dark:text-zinc-400">Problems Solved</th>
                <th className="px-5 py-3.5 font-semibold text-right text-zinc-500 dark:text-zinc-400">LC Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {data.students.map((u: any) => (
                <tr key={u.id} className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
                  <td className="px-5 py-4">
                    <span className="font-bold text-zinc-500 dark:text-zinc-400">#{u.internalRank}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{u.name}</div>
                    <div className="mt-0.5 text-xs font-medium text-zinc-500">{u.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    {u.leetcodeUsername ? (
                       <a href={`https://leetcode.com/u/${u.leetcodeUsername}`} target="_blank" rel="noreferrer" className="font-mono text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                         @{u.leetcodeUsername}
                       </a>
                    ) : (
                       <span className="font-medium text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {u.isOnboarded ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div> Pending Sync
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{u.solved.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">{u.rating ? Math.round(u.rating).toLocaleString() : <span className="text-zinc-400 dark:text-zinc-600">—</span>}</span>
                  </td>
                </tr>
              ))}
              {data.students.length === 0 && (
                 <tr><td colSpan={6} className="p-8 text-center text-sm font-medium text-zinc-500">You currently have no students enrolled on the platform.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
