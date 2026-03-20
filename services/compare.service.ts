import { getLeaderboard } from "@/services/leaderboard.service";

export async function getComparison(u1: string, u2: string) {
  // Leverage the leaderboard service to ensure ranks and formatting match exactly
  const leaderboard = await getLeaderboard();
  
  const student1 = leaderboard.find(s => s.leetcodeUsername.toLowerCase() === u1.toLowerCase()) || null;
  const student2 = leaderboard.find(s => s.leetcodeUsername.toLowerCase() === u2.toLowerCase()) || null;

  return { student1, student2 };
}
