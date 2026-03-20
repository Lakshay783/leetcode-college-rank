import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCollegeDashboardData } from "@/services/college.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, role } = session.user as any;
    
    // Natively locking route exclusively to COLLEGE authorities
    if (role !== "COLLEGE") {
      return NextResponse.json({ message: "Forbidden: COLLEGE role required" }, { status: 403 });
    }

    // Querying User dynamically to extract 100% current collegeId linkage safely
    const userRow = await prisma.user.findUnique({ where: { id } });
    if (!userRow?.collegeId) {
      return NextResponse.json({ message: "No college assignment found for this account. Contact an Admin." }, { status: 400 });
    }

    const data = await getCollegeDashboardData(userRow.collegeId);

    if (!data) {
      return NextResponse.json({ message: "College linked record not found." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[COLLEGE_DASHBOARD_GET]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
