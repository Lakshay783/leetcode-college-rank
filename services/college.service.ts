import { prisma } from "@/lib/prisma";

export async function getCollegeDashboardData(collegeId: string) {
  const [
    college,
    totalStudents,
    onboardedStudents,
    syncedStatsCount,
    students
  ] = await Promise.all([
    prisma.college.findUnique({ where: { id: collegeId } }),
    prisma.user.count({ where: { collegeId, role: "STUDENT" } }),
    prisma.user.count({ where: { collegeId, role: "STUDENT", leetcodeUsername: { not: null } } }),
    prisma.user.count({ 
      where: { collegeId, role: "STUDENT", stats: { isNot: null } }
    }),
    prisma.user.findMany({
      where: { collegeId, role: "STUDENT" },
      include: { stats: true },
    })
  ]);

  if (!college) return null;

  // Re-use universally consistent sorting algorithm to rank the internal students reliably
  const sortedStudents = students.map((u) => ({
    id: u.id,
    name: u.name || "Anonymous",
    email: u.email,
    leetcodeUsername: u.leetcodeUsername,
    role: u.role,
    isOnboarded: !!(u.leetcodeUsername && u.collegeId),
    solved: u.stats?.solved || 0,
    rating: u.stats?.rating || null,
  })).sort((a, b) => {
    if (a.solved !== b.solved) return b.solved - a.solved;
    return (b.rating || 0) - (a.rating || 0);
  });

  const topStudent = sortedStudents.length > 0 && sortedStudents[0].isOnboarded ? sortedStudents[0] : null;

  return {
    collegeName: college.name,
    stats: {
      totalStudents,
      onboardedStudents,
      syncedStatsCount,
    },
    topStudent,
    students: sortedStudents.map((s, index) => ({ ...s, internalRank: index + 1 }))
  };
}
