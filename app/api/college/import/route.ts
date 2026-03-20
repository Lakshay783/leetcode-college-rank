import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { importStudentsBatch } from "@/services/csv-import.service";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, role } = session.user as any;
    
    if (role !== "COLLEGE") {
      return NextResponse.json({ message: "Forbidden: COLLEGE role required" }, { status: 403 });
    }

    const userRow = await prisma.user.findUnique({ where: { id } });
    if (!userRow?.collegeId) {
      return NextResponse.json({ message: "No college assignment strictly found." }, { status: 400 });
    }

    const body = await req.json();
    if (!body || !Array.isArray(body.rows) || body.rows.length === 0) {
       return NextResponse.json({ message: "Invalid payload or empty rows array." }, { status: 400 });
    }

    // Limit batch size purely for MVP execution safety
    if (body.rows.length > 3000) {
       return NextResponse.json({ message: "Please upload maximum 3000 students per batch." }, { status: 400 });
    }

    const importResults = await importStudentsBatch(userRow.collegeId, body.rows);

    return NextResponse.json({ message: "Import cycle completed.", results: importResults });
  } catch (error) {
    console.error("[CSV_IMPORT_POST]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
