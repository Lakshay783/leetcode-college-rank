"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Users, GraduationCap, Building, Database, UserCheck, Shield } from "lucide-react";

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

  if (isLoading && !data) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Admin Dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-destructive font-bold text-xl">Access Denied: You must be an ADMIN to view this page.</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Shield className="h-8 w-8 text-primary" /> Admin Center</h1>
          <p className="text-muted-foreground">Manage users, colleges, and view platform metrics.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Triggering Bulk Sync..." : "Manual Stat Sync"}
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Users" value={data.stats.totalUsers} icon={<Users className="h-5 w-5 text-blue-500" />} />
        <StatCard title="Students" value={data.stats.totalStudents} icon={<GraduationCap className="h-5 w-5 text-indigo-500" />} />
        <StatCard title="Onboarded" value={data.stats.totalOnboarded} icon={<UserCheck className="h-5 w-5 text-green-500" />} />
        <StatCard title="Colleges" value={data.stats.totalColleges} icon={<Building className="h-5 w-5 text-orange-500" />} />
        <StatCard title="Synced Stats" value={data.stats.totalSyncedStats} icon={<Database className="h-5 w-5 text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colleges Column */}
        <div className="bg-card border rounded-lg shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b bg-muted/20">
            <h2 className="text-lg font-bold">Colleges Registry ({data.colleges.length})</h2>
          </div>
          <div className="p-0 overflow-y-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="p-3 font-medium text-muted-foreground">Name</th>
                  <th className="p-3 font-medium text-muted-foreground text-right">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.colleges.map((col: any) => (
                  <tr key={col.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium">{col.name}</td>
                    <td className="p-3 text-right">{col._count.users}</td>
                  </tr>
                ))}
                {data.colleges.length === 0 && (
                   <tr><td colSpan={2} className="p-4 text-center text-muted-foreground">No colleges found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Column */}
        <div className="lg:col-span-2 bg-card border rounded-lg shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b bg-muted/20">
            <h2 className="text-lg font-bold">Platform Users ({data.users.length})</h2>
          </div>
          <div className="p-0 overflow-y-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="p-3 font-medium text-muted-foreground">User</th>
                  <th className="p-3 font-medium text-muted-foreground">Role</th>
                  <th className="p-3 font-medium text-muted-foreground">Status</th>
                  <th className="p-3 font-medium text-muted-foreground">LeetCode</th>
                  <th className="p-3 font-medium text-muted-foreground">College</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.users.map((u: any) => {
                  const isOnboarded = u.leetcodeUsername && u.collegeId;
                  return (
                    <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-3">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.role === "ADMIN" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {u.role !== "STUDENT" ? (
                          <span className="text-muted-foreground font-medium">-</span>
                        ) : isOnboarded ? (
                          <span className="text-green-600 dark:text-green-500 font-medium">Onboarded</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-500 font-medium">Pending</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-xs">{u.leetcodeUsername || "-"}</td>
                      <td className="p-3 truncate max-w-[150px]">{u.college?.name || "-"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
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
