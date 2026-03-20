import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.error("[COLLEGES_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
