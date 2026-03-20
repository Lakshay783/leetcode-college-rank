import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncAllOnboardedUsers } from "@/services/leetcode.service";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { role } = session.user as any;
    
    // Only Admin can trigger manual bulk syncs
    if (role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden: ADMIN only" }, { status: 403 });
    }

    const results = await syncAllOnboardedUsers();

    return NextResponse.json({ 
      message: "Sync completed", 
      results
    });
  } catch (error) {
    console.error("[SYNC_POST]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
