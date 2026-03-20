import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/services/user.service";
import { NextResponse } from "next/server";

/**
 * GET /api/users/me
 *
 * Returns the currently authenticated user's profile including role and college.
 * Returns 401 if not authenticated.
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Return a safe subset — never expose raw DB fields to client
  return NextResponse.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      department: user.department,
      year: user.year,
      collegeEmail: user.collegeEmail,
      leetcodeUsername: user.leetcodeUsername,
      college: user.college
        ? { id: user.college.id, name: user.college.name }
        : null,
    },
  });
}
