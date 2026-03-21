"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Users, GraduationCap, Building, Database, UserCheck, Shield } from "lucide-react";

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">{value.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/admin/dashboard")
      .then(res => res.json().then(d => ({ status: res.status, data: d })))
      .then(({ status, data }) => {
        if (status === 200) setData(data);
        else setData(null);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/leaderboard/sync", { method: "POST" });
      const status = await res.json();
      if (res.ok) {
        alert(`Synced ${status.results?.successful || 0} students successfully!`);
        setRefreshKey(k => k + 1);
      } else {
        alert(status.message || "Sync failed");
      }
    } catch {
      alert("Error triggering sync from Admin panel");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading && !data) return (
     <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Authenticating Command Center...</p>
     </div>
  );
  if (!data) return (
     <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
           <Shield className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Access Denied</h2>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">You must be an ADMIN to view this console.</p>
     </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 py-8 px-4 sm:px-6 lg:px-8">
       {/* Header Section */}
       <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
         <div className="space-y-1.5">
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
               <Shield className="h-5 w-5" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Command Center</h1>
           </div>
           <p className="ml-[52px] text-sm font-medium text-zinc-500 dark:text-zinc-400">
             Manage platform users, verify colleges, and force global synchronization.
           </p>
         </div>

         <button
           onClick={handleSync}
           disabled={isSyncing}
           className="group flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-50 md:w-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
         >
           <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : "transition-transform group-hover:rotate-180"}`} />
           {isSyncing ? "Triggering Bulk Sync..." : "Force Manual Sync"}
         </button>
       </div>

       {/* Stats Board */}
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
         <StatCard title="Total Users" value={data.stats.totalUsers} icon={<Users className="h-5 w-5 text-blue-500" />} />
         <StatCard title="Students" value={data.stats.totalStudents} icon={<GraduationCap className="h-5 w-5 text-indigo-500" />} />
         <StatCard title="Onboarded" value={data.stats.totalOnboarded} icon={<UserCheck className="h-5 w-5 text-emerald-500" />} />
         <StatCard title="Colleges" value={data.stats.totalColleges} icon={<Building className="h-5 w-5 text-orange-500" />} />
         <StatCard title="Synced Stats" value={data.stats.totalSyncedStats} icon={<Database className="h-5 w-5 text-purple-500" />} />
       </div>

       <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
         
         {/* Colleges Column */}
         <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
           <div className="border-b border-zinc-200/60 bg-white/40 p-5 dark:border-zinc-800/60 dark:bg-zinc-900/20">
             <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Colleges Registry <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{data.colleges.length}</span></h2>
           </div>
           <div className="flex-1 overflow-y-auto p-0">
             <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="sticky top-0 z-10 border-b border-zinc-200/60 bg-zinc-50/90 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/90">
                 <tr>
                   <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">Institution Name</th>
                   <th className="px-5 py-3.5 text-right font-semibold text-zinc-500 dark:text-zinc-400">Members</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                 {data.colleges.map((col: any) => (
                   <tr key={col.id} className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
                     <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{col.name}</td>
                     <td className="px-5 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">{col._count.users}</td>
                   </tr>
                 ))}
                 {data.colleges.length === 0 && (
                    <tr><td colSpan={2} className="p-8 text-center text-sm font-medium text-zinc-500">No colleges registered yet.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>

         {/* Users Column */}
         <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-xl lg:col-span-2 dark:border-zinc-800/60 dark:bg-zinc-950/50">
           <div className="border-b border-zinc-200/60 bg-white/40 p-5 dark:border-zinc-800/60 dark:bg-zinc-900/20">
             <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Platform Users <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{data.users.length}</span></h2>
           </div>
           <div className="flex-1 overflow-y-auto p-0">
             <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="sticky top-0 z-10 border-b border-zinc-200/60 bg-zinc-50/90 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/90">
                 <tr>
                   <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">User Identity</th>
                   <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">Access Role</th>
                   <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">Onboarding</th>
                   <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">LeetCode Profile</th>
                   <th className="px-5 py-3.5 font-semibold text-zinc-500 dark:text-zinc-400">Affiliation</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                 {data.users.map((u: any) => {
                   const isOnboarded = u.leetcodeUsername && u.collegeId;
                   return (
                     <tr key={u.id} className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
                       <td className="px-5 py-3">
                         <div className="font-semibold text-zinc-900 dark:text-zinc-100">{u.name}</div>
                         <div className="mt-0.5 text-xs font-medium text-zinc-500">{u.email}</div>
                       </td>
                       <td className="px-5 py-3">
                         <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ring-1 ring-inset ${
                           u.role === "ADMIN" 
                             ? "bg-purple-500/10 text-purple-700 ring-purple-500/20 dark:bg-purple-500/20 dark:text-purple-300 dark:ring-purple-500/30" 
                             : u.role === "COLLEGE"
                               ? "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/30"
                               : "bg-zinc-500/10 text-zinc-700 ring-zinc-500/20 dark:bg-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-500/30"
                         }`}>
                           {u.role}
                         </span>
                       </td>
                       <td className="px-5 py-3">
                         {u.role !== "STUDENT" ? (
                           <span className="font-medium text-zinc-400">—</span>
                         ) : isOnboarded ? (
                           <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-500">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> Complete
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-500">
                             <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div> Pending
                           </span>
                         )}
                       </td>
                       <td className="px-5 py-3">
                         {u.leetcodeUsername ? (
                           <a href={`https://leetcode.com/u/${u.leetcodeUsername}`} target="_blank" rel="noreferrer" className="font-mono text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                             @{u.leetcodeUsername}
                           </a>
                         ) : (
                           <span className="font-medium text-zinc-400">—</span>
                         )}
                       </td>
                       <td className="px-5 py-3">
                         <div className="max-w-[150px] truncate font-medium text-zinc-700 dark:text-zinc-300">
                           {u.college?.name || <span className="text-zinc-400">—</span>}
                         </div>
                       </td>
                     </tr>
                   )
                 })}
                 {data.users.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-sm font-medium text-zinc-500">No users found on the platform.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>
       </div>
    </div>
  );
}
