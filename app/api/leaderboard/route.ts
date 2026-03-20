import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLeaderboard } from "@/services/leaderboard.service";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "STUDENT" && role !== "COLLEGE" && role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const collegeId = searchParams.get("collegeId") || undefined;

    const data = await getLeaderboard(search, collegeId);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[LEADERBOARD_GET]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
