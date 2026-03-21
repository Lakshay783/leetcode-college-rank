"use client";

import { useEffect, useState } from "react";
import { Search, Trophy, Swords, XCircle, Loader2 } from "lucide-react";

type CompareStudent = {
  rank: number;
  userId: string;
  name: string;
  leetcodeUsername: string;
  college: string;
  department: string;
  year: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  rating: number | null;
};

export default function ComparePage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [u1, setU1] = useState("");
  const [u2, setU2] = useState("");
  
  const [student1, setStudent1] = useState<CompareStudent | null>(null);
  const [student2, setStudent2] = useState<CompareStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all students for the datalist autocomplete purely to help users pick
  useEffect(() => {
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(data => setCandidates(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const handleCompare = async () => {
    if (!u1 || !u2) {
      setError("Please select two distinct students to compare.");
      return;
    }
    setError("");
    setIsLoading(true);
    setStudent1(null);
    setStudent2(null);
    try {
      const res = await fetch(`/api/compare?u1=${encodeURIComponent(u1)}&u2=${encodeURIComponent(u2)}`);
      if (!res.ok) throw new Error("Failed to fetch comparison data.");
      const data = await res.json();
      
      if (!data.student1) setError(`Could not find global stats for @${u1}.`);
      if (!data.student2) setError(`Could not find global stats for @${u2}.`);
      
      if (data.student1 && data.student2) {
        setStudent1(data.student1);
        setStudent2(data.student2);
        setError(""); // Clear error if both found
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getWinnerClass = (val1: number, val2: number, reverse: boolean = false) => {
    const isWinner = reverse ? val1 < val2 : val1 > val2;
    const isLoser = reverse ? val1 > val2 : val1 < val2;
    
    // Polished SaaS Highlight Matrix
    if (isWinner) return "bg-emerald-50/50 text-emerald-700 font-bold dark:bg-emerald-900/20 dark:text-emerald-400";
    if (isLoser) return "text-zinc-500 dark:text-zinc-500 font-medium";
    return "text-zinc-700 dark:text-zinc-300 font-semibold"; // Tie
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <Swords className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Head-to-Head Comparison</h1>
        </div>
        <p className="ml-[52px] text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Benchmark algorithmic performance directly between two peers.
        </p>
      </div>

      {/* Control Panel */}
      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur-xl sm:p-8 dark:border-zinc-800/60 dark:bg-zinc-950/50">
        <datalist id="students-list">
          {candidates.map(s => (
            <option key={s.userId} value={s.leetcodeUsername}>
              {s.name} ({s.college}) - Rank #{s.rank}
            </option>
          ))}
        </datalist>

        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:gap-4">
          <div className="group relative w-full">
            <label className="mb-2 block text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">Contender 1</label>
            <Search className="absolute left-3 top-9 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-blue-500" />
            <input
              list="students-list"
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white/70 pl-9 pr-4 text-sm font-medium text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              placeholder="e.g. neetcode"
              value={u1}
              onChange={(e) => setU1(e.target.value)}
            />
          </div>
          
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-black text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600">
            VS
          </div>
          
          <div className="group relative w-full">
            <label className="mb-2 block text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">Contender 2</label>
            <Search className="absolute left-3 top-9 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-blue-500" />
            <input
              list="students-list"
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white/70 pl-9 pr-4 text-sm font-medium text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              placeholder="e.g. touryst"
              value={u2}
              onChange={(e) => setU2(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleCompare}
            disabled={isLoading}
            className="group flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-50 md:w-auto"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Swords className="h-4 w-4 transition-transform group-hover:scale-110" />}
            {isLoading ? "Analyzing..." : "Compare"}
          </button>
        </div>
        
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-200/50 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Results Deck */}
      {student1 && student2 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 hover:cursor-default">
          
          {/* Card 1 */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-950/50">
            <div className={`border-b border-zinc-200/50 p-6 sm:p-8 dark:border-zinc-800/50 ${student1.rank < student2.rank ? "bg-amber-500/5 dark:bg-amber-500/10" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{student1.name}</h2>
                  <a href={`https://leetcode.com/u/${student1.leetcodeUsername}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400">
                    @{student1.leetcodeUsername}
                  </a>
                </div>
                {student1.rank < student2.rank && <Trophy className="h-8 w-8 text-amber-500 drop-shadow-sm" />}
              </div>
              <div className="mt-5 space-y-1.5 text-sm">
                <p className="font-medium text-zinc-600 dark:text-zinc-400"><span className="text-zinc-400 dark:text-zinc-500">Institution:</span> {student1.college}</p>
                <p className="font-medium text-zinc-600 dark:text-zinc-400"><span className="text-zinc-400 dark:text-zinc-500">Department:</span> {student1.department} <span className="text-zinc-400">({student1.year})</span></p>
              </div>
            </div>

            <div className="flex-1 p-0">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Global Rank</td>
                     <td className={`px-6 py-4 text-left text-lg ${getWinnerClass(student1.rank, student2.rank, true)}`}>
                       #{student1.rank.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Total Solved</td>
                     <td className={`px-6 py-4 text-left text-lg ${getWinnerClass(student1.solved, student2.solved)}`}>
                       {student1.solved.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Easy Solved</td>
                     <td className={`px-6 py-4 text-left ${getWinnerClass(student1.easy, student2.easy)}`}>
                       {student1.easy.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Medium Solved</td>
                     <td className={`px-6 py-4 text-left ${getWinnerClass(student1.medium, student2.medium)}`}>
                       {student1.medium.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Hard Solved</td>
                     <td className={`px-6 py-4 text-left ${getWinnerClass(student1.hard, student2.hard)}`}>
                       {student1.hard.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Contest Rating</td>
                     <td className={`px-6 py-4 text-left ${getWinnerClass(student1.rating || 0, student2.rating || 0)}`}>
                       {student1.rating ? Math.round(student1.rating).toLocaleString() : <span className="opacity-50">Unrated</span>}
                     </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-950/50">
            <div className={`border-b border-zinc-200/50 p-6 sm:p-8 dark:border-zinc-800/50 ${student2.rank < student1.rank ? "bg-amber-500/5 dark:bg-amber-500/10" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{student2.name}</h2>
                  <a href={`https://leetcode.com/u/${student2.leetcodeUsername}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400">
                    @{student2.leetcodeUsername}
                  </a>
                </div>
                {student2.rank < student1.rank && <Trophy className="h-8 w-8 text-amber-500 drop-shadow-sm" />}
              </div>
              <div className="mt-5 space-y-1.5 text-sm">
                <p className="font-medium text-zinc-600 dark:text-zinc-400"><span className="text-zinc-400 dark:text-zinc-500">Institution:</span> {student2.college}</p>
                <p className="font-medium text-zinc-600 dark:text-zinc-400"><span className="text-zinc-400 dark:text-zinc-500">Department:</span> {student2.department} <span className="text-zinc-400">({student2.year})</span></p>
              </div>
            </div>

            <div className="flex-1 p-0">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Global Rank</td>
                     <td className={`px-6 py-4 text-left text-lg ${getWinnerClass(student2.rank, student1.rank, true)}`}>
                       #{student2.rank.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Total Solved</td>
                     <td className={`px-6 py-4 text-left text-lg ${getWinnerClass(student2.solved, student1.solved)}`}>
                       {student2.solved.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Easy Solved</td>
                     <td className={`px-6 py-4 text-left ${getWinnerClass(student2.easy, student1.easy)}`}>
                       {student2.easy.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Medium Solved</td>
                     <td className={`px-6 py-4 text-left ${getWinnerClass(student2.medium, student1.medium)}`}>
                       {student2.medium.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Hard Solved</td>
                     <td className={`px-6 py-4 text-left ${getWinnerClass(student2.hard, student1.hard)}`}>
                       {student2.hard.toLocaleString()}
                     </td>
                  </tr>
                  <tr>
                     <td className="w-1/3 border-r border-zinc-200/40 px-6 py-4 font-medium text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-400">Contest Rating</td>
                     <td className={`px-6 py-4 text-left ${getWinnerClass(student2.rating || 0, student1.rating || 0)}`}>
                       {student2.rating ? Math.round(student2.rating).toLocaleString() : <span className="opacity-50">Unrated</span>}
                     </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
