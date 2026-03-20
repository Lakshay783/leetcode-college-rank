import { prisma } from "@/lib/prisma";

export async function getLeaderboard(search?: string, collegeId?: string) {
  const users = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      leetcodeUsername: { not: null },
      ...(collegeId ? { collegeId } : { collegeId: { not: null } }),
      ...(search
        ? { leetcodeUsername: { contains: search, mode: "insensitive" } }
        : {}),
    },
    include: {
      college: { select: { name: true } },
      stats: true, // Fetch stats for sorting and display
    },
  });

  // Sort in memory to allow secondary sorting smoothly even with null stats:
  // 1. Solved Descending
  // 2. Rating Descending
  users.sort((a, b) => {
    const solvedA = a.stats?.solved || 0;
    const solvedB = b.stats?.solved || 0;
    if (solvedA !== solvedB) {
      return solvedB - solvedA; 
    }
    
    const ratingA = a.stats?.rating || 0;
    const ratingB = b.stats?.rating || 0;
    return ratingB - ratingA;
  });

  return users.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    name: user.name || "Anonymous",
    leetcodeUsername: user.leetcodeUsername!,
    college: user.college?.name || "Unknown",
    department: user.department || "-",
    year: user.year || "-",
    solved: user.stats?.solved || 0,
    easy: user.stats?.easy || 0,
    medium: user.stats?.medium || 0,
    hard: user.stats?.hard || 0,
    rating: user.stats?.rating || null,
  }));
}

export async function getUserStats(userId: string) {
  return prisma.leetCodeStats.findUnique({
    where: { userId },
  });
}
