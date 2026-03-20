"use client";

import { useEffect, useState } from "react";
import { Search, Trophy, Medal } from "lucide-react";

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
      setError("Please select two students to compare.");
      return;
    }
    setError("");
    setIsLoading(true);
    setStudent1(null);
    setStudent2(null);
    try {
      const res = await fetch(`/api/compare?u1=${encodeURIComponent(u1)}&u2=${encodeURIComponent(u2)}`);
      if (!res.ok) throw new Error("Failed to fetch comparison data");
      const data = await res.json();
      
      if (!data.student1) setError(`Could not find stats for ${u1}`);
      if (!data.student2) setError(`Could not find stats for ${u2}`);
      
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
    if (isWinner) return "text-green-600 font-bold dark:text-green-500 bg-green-50 dark:bg-green-900/20";
    if (isLoser) return "text-muted-foreground";
    return "font-semibold";
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compare Students</h1>
        <p className="text-muted-foreground">Go head-to-head and see who maps out better stats.</p>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <datalist id="students-list">
          {candidates.map(s => (
            <option key={s.userId} value={s.leetcodeUsername}>
              {s.name} ({s.college}) - Rank #{s.rank}
            </option>
          ))}
        </datalist>

        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="relative w-full">
            <label className="text-sm font-medium mb-1.5 block">Student 1 (LeetCode Username)</label>
            <Search className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
            <input
              list="students-list"
              className="pl-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g. neetcode"
              value={u1}
              onChange={(e) => setU1(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center pb-2 px-2 text-muted-foreground font-bold">VS</div>
          <div className="relative w-full">
            <label className="text-sm font-medium mb-1.5 block">Student 2 (LeetCode Username)</label>
            <Search className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
            <input
              list="students-list"
              className="pl-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g. touryst"
              value={u2}
              onChange={(e) => setU2(e.target.value)}
            />
          </div>
          <button
            onClick={handleCompare}
            disabled={isLoading}
            className="flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shrink-0 w-full md:w-auto mt-4 md:mt-0"
          >
            {isLoading ? "Comparing..." : "Compare"}
          </button>
        </div>
        {error && <p className="text-destructive text-sm mt-4 font-medium">{error}</p>}
      </div>

      {student1 && student2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className={`p-6 border-b ${student1.rank < student2.rank ? "bg-amber-50/50 dark:bg-amber-900/10" : "bg-muted/20"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{student1.name}</h2>
                  <a href={`https://leetcode.com/u/${student1.leetcodeUsername}`} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                    @{student1.leetcodeUsername}
                  </a>
                </div>
                {student1.rank < student2.rank && <Trophy className="h-6 w-6 text-amber-500" />}
              </div>
              <div className="mt-4 text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium text-foreground">College:</span> {student1.college}</p>
                <p><span className="font-medium text-foreground">Department:</span> {student1.department} ({student1.year})</p>
              </div>
            </div>

            <div className="p-0 flex-1">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground w-1/3 border-r">Global Rank</td>
                    <td className={`p-4 text-xl ${getWinnerClass(student1.rank, student2.rank, true)}`}>
                      #{student1.rank}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground border-r">Total Solved</td>
                    <td className={`p-4 text-xl ${getWinnerClass(student1.solved, student2.solved)}`}>
                      {student1.solved}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground border-r">Easy Solved</td>
                    <td className={`p-4 ${getWinnerClass(student1.easy, student2.easy)}`}>
                      {student1.easy}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground border-r">Medium Solved</td>
                    <td className={`p-4 ${getWinnerClass(student1.medium, student2.medium)}`}>
                      {student1.medium}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground border-r">Hard Solved</td>
                    <td className={`p-4 ${getWinnerClass(student1.hard, student2.hard)}`}>
                      {student1.hard}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-muted-foreground border-r">Contest Rating</td>
                    <td className={`p-4 ${getWinnerClass(student1.rating || 0, student2.rating || 0)}`}>
                      {student1.rating ? student1.rating : "Unrated"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className={`p-6 border-b ${student2.rank < student1.rank ? "bg-amber-50/50 dark:bg-amber-900/10" : "bg-muted/20"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{student2.name}</h2>
                  <a href={`https://leetcode.com/u/${student2.leetcodeUsername}`} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                    @{student2.leetcodeUsername}
                  </a>
                </div>
                {student2.rank < student1.rank && <Trophy className="h-6 w-6 text-amber-500" />}
              </div>
              <div className="mt-4 text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium text-foreground">College:</span> {student2.college}</p>
                <p><span className="font-medium text-foreground">Department:</span> {student2.department} ({student2.year})</p>
              </div>
            </div>

            <div className="p-0 flex-1">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground w-1/3 border-r">Global Rank</td>
                    <td className={`p-4 text-xl ${getWinnerClass(student2.rank, student1.rank, true)}`}>
                      #{student2.rank}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground border-r">Total Solved</td>
                    <td className={`p-4 text-xl ${getWinnerClass(student2.solved, student1.solved)}`}>
                      {student2.solved}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground border-r">Easy Solved</td>
                    <td className={`p-4 ${getWinnerClass(student2.easy, student1.easy)}`}>
                      {student2.easy}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground border-r">Medium Solved</td>
                    <td className={`p-4 ${getWinnerClass(student2.medium, student1.medium)}`}>
                      {student2.medium}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-muted-foreground border-r">Hard Solved</td>
                    <td className={`p-4 ${getWinnerClass(student2.hard, student1.hard)}`}>
                      {student2.hard}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-muted-foreground border-r">Contest Rating</td>
                    <td className={`p-4 ${getWinnerClass(student2.rating || 0, student1.rating || 0)}`}>
                      {student2.rating ? student2.rating : "Unrated"}
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
