import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { onboardSchema } from "@/validators/user.validator";
import { onboardStudent, getUserByEmail } from "@/services/user.service";

export async function POST(req: Request) {
  try {
    // Only logged-in students can onboard
    const session = await requireRole(["STUDENT"]);
    
    // Parse JSON body
    const body = await req.json();
    
    // Validate with Zod
    const result = onboardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Find real database user by session email
    if (!session.user?.email) {
      return NextResponse.json({ message: "No email in session" }, { status: 401 });
    }

    const realUser = await getUserByEmail(session.user.email);
    if (!realUser) {
      return NextResponse.json({ message: "User record not found in database" }, { status: 404 });
    }

    // Call service to update DB using the real database ID
    const updatedUser = await onboardStudent(realUser.id, result.data);

    return NextResponse.json({
      message: "Onboarding successful",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        leetcodeUsername: updatedUser.leetcodeUsername,
      },
    });
  } catch (error: any) {
    console.error("[ONBOARD_POST]", error);
    
    // Catch known service errors
    if (error.message === "This LeetCode username is already registered.") {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
