import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getComparison } from "@/services/compare.service";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const u1 = searchParams.get("u1");
    const u2 = searchParams.get("u2");

    if (!u1 || !u2) {
      return NextResponse.json({ message: "Two usernames are required to compare" }, { status: 400 });
    }

    const data = await getComparison(u1, u2);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[COMPARE_GET]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
