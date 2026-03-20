import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAdminDashboardData } from "@/services/admin.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { role } = session.user as any;
    
    if (role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden: ADMIN only" }, { status: 403 });
    }

    const data = await getAdminDashboardData();

    return NextResponse.json(data);
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_GET]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
