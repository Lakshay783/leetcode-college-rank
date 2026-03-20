import { prisma } from "@/lib/prisma";

export async function getAdminDashboardData() {
  const [
    totalUsers,
    totalStudents,
    totalOnboarded,
    totalColleges,
    totalSyncedStats,
    colleges,
    users
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "STUDENT", leetcodeUsername: { not: null }, collegeId: { not: null } } }),
    prisma.college.count(),
    prisma.leetCodeStats.count(),
    prisma.college.findMany({
      include: {
        _count: { select: { users: true } }
      },
      orderBy: { name: "asc" }
    }),
    prisma.user.findMany({
      include: {
        college: true,
        stats: true
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return {
    stats: {
      totalUsers,
      totalStudents,
      totalOnboarded,
      totalColleges,
      totalSyncedStats
    },
    colleges,
    users
  };
}
