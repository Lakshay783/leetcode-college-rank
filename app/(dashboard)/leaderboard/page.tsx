"use client";

import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">College Leaderboard</h1>
          <p className="text-muted-foreground">Rankings are based on total solved questions.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search username..."
              className="pl-9 flex h-10 w-full sm:w-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <select
              className="pl-9 flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
            >
              <option value="">All Colleges</option>
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Rank</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Solved</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Rating</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">College</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Loading leaderboard...
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center text-muted-foreground">
                    No onboarded students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.userId} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-bold text-xl text-primary">
                      #{student.rank}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{student.name}</span>
                        <a 
                          href={`https://leetcode.com/u/${student.leetcodeUsername}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary hover:underline hover:cursor-pointer"
                        >
                          @{student.leetcodeUsername}
                        </a>
                      </div>
                    </td>
                    <td className="p-4 align-middle font-semibold text-green-600 dark:text-green-500">
                      {student.solved}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground font-medium">
                      {student.rating ? student.rating : "-"}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="text-foreground">{student.college}</span>
                        <span className="text-xs text-muted-foreground">{student.department} • {student.year}</span>
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
