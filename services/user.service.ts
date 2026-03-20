import { prisma } from "@/lib/prisma";
import type { Role } from "@/types";

/**
 * Get a user by ID including their stats and college.
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { stats: true, college: true },
  });
}

/**
 * Get a user by email.
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { stats: true, college: true },
  });
}

/**
 * Get all students in a college, sorted by LeetCode solved count.
 */
export async function getUsersByCollege(collegeId: string) {
  return prisma.user.findMany({
    where: { collegeId, role: "STUDENT" },
    include: { stats: true },
    orderBy: { stats: { solved: "desc" } },
  });
}

/**
 * Update a user's role.
 */
export async function updateUserRole(id: string, role: Role) {
  return prisma.user.update({ where: { id }, data: { role } });
}

export async function updateLeetcodeUsername(id: string, username: string) {
  return prisma.user.update({
    where: { id },
    data: { leetcodeUsername: username },
  });
}

/**
 * Onboard a student with their details.
 * Throws an error if the LeetCode username is already taken.
 */
import type { OnboardInput } from "@/validators/user.validator";

export async function onboardStudent(userId: string, data: OnboardInput) {
  // Check if LeetCode username is already in use by another user
  const existing = await prisma.user.findFirst({
    where: { leetcodeUsername: data.leetcodeUsername },
  });

  if (existing && existing.id !== userId) {
    throw new Error("This LeetCode username is already registered.");
  }

  // Update the user profile
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      department: data.department,
      year: data.year,
      collegeEmail: data.collegeEmail,
      leetcodeUsername: data.leetcodeUsername,
      collegeId: data.collegeId,
    },
  });
}
