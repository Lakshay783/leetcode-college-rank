"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Trophy, Medal, Loader2, Award } from "lucide-react";

type LeaderboardStudent = {
  rank: number;
  userId: string;
  name: string;
  leetcodeUsername: string;
  college: string;
  department: string;
  year: string;
  solved: number;
  rating: number | null;
};

// Extracted UI component for Top 3 Medals
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center gap-1.5 font-black text-amber-500">
        <Trophy className="h-5 w-5 fill-amber-500/20" /> 1st
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center gap-1.5 font-bold text-slate-400 dark:text-slate-300">
        <Medal className="h-5 w-5 fill-slate-400/20" /> 2nd
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-orange-500">
        <Medal className="h-5 w-5 fill-orange-600/20 dark:fill-orange-500/20" /> 3rd
      </div>
    );
  }
  return <span className="font-bold text-zinc-500 dark:text-zinc-400">#{rank}</span>;
}

export default function LeaderboardPage() {
  const [students, setStudents] = useState<LeaderboardStudent[]>([]);
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch colleges for filter dropdown
  useEffect(() => {
    fetch("/api/colleges")
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch leaderboard data with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (collegeId) params.append("collegeId", collegeId);

      fetch(`/api/leaderboard?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setStudents(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, collegeId]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header & Controls Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <Award className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Global Leaderboard</h1>
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ml-[52px]">
            Real-time algorithmic rankings across all verified institutions.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Search by username..."
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white/70 pl-9 pr-4 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 shadow-sm backdrop-blur-md transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:w-[240px] dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* College Filter */}
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-blue-500" />
            <select
              className="flex h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white/70 pl-9 pr-10 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur-md transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:w-[220px] dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
            >
              <option value="">All Institutions</option>
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Table Container */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-zinc-200/60 bg-zinc-50/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-400">
              <tr>
                <th className="h-14 px-6 align-middle font-semibold w-[100px]">Standings</th>
                <th className="h-14 px-6 align-middle font-semibold">Student Profile</th>
                <th className="h-14 px-6 align-middle font-semibold text-right w-[140px]">Questions Solved</th>
                <th className="h-14 px-6 align-middle font-semibold text-right w-[120px]">LC Rating</th>
                <th className="h-14 px-6 align-middle font-semibold">Institution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="h-48 text-center align-middle">
                    <div className="flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-sm font-medium">Syncing live standings...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-48 text-center align-middle">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <Award className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                       <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No students found matching your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr 
                    key={student.userId} 
                    className="group transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40"
                  >
                    <td className="px-6 py-4 align-middle">
                       <RankBadge rank={student.rank} />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{student.name}</span>
                        <a 
                          href={`https://leetcode.com/u/${student.leetcodeUsername}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs font-medium text-zinc-500 transition-colors hover:text-blue-600 hover:underline dark:text-zinc-400 dark:hover:text-blue-400 mt-0.5"
                        >
                          @{student.leetcodeUsername}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                       <div className="inline-flex items-center justify-end font-bold text-emerald-600 dark:text-emerald-400">
                         {student.solved.toLocaleString()}
                       </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right font-semibold text-zinc-600 dark:text-zinc-300">
                      {student.rating ? Math.round(student.rating).toLocaleString() : <span className="text-zinc-300 dark:text-zinc-700 font-medium">—</span>}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{student.college}</span>
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mt-0.5">{student.department} • {student.year}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
