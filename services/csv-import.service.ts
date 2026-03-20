import { prisma } from "@/lib/prisma";

export async function importStudentsBatch(collegeId: string, rows: any[]) {
  const results = { successful: 0, failed: 0, errors: [] as string[] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1; // 1-indexed for logging
    try {
      // 1. Validate required fields safely
      if (!row.name || !row.collegeEmail || !row.department || !row.year || !row.leetcodeUsername) {
        results.failed++;
        results.errors.push(`Row ${rowNum}: Missing required fields.`);
        continue;
      }

      const email = row.collegeEmail.toLowerCase().trim();
      const leetcodeUsername = row.leetcodeUsername.trim();

      // 2. Reject existing global emails safely
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        results.failed++;
        results.errors.push(`Row ${rowNum}: Email [${email}] is already registered.`);
        continue;
      }

      // 3. Reject duplicated LeetCode accounts globally to prevent sync collision loops
      const existingLc = await prisma.user.findFirst({ where: { leetcodeUsername } });
      if (existingLc) {
        results.failed++;
        results.errors.push(`Row ${rowNum}: LeetCode ID [${leetcodeUsername}] is already bound to another profile.`);
        continue;
      }

      // 4. Create base user natively with role "STUDENT"
      // They authenticate by logging in with Google using this EXACT collegeEmail later!
      await prisma.user.create({
        data: {
          name: row.name.trim(),
          email: email, 
          collegeEmail: email,
          department: row.department.trim(),
          year: row.year.trim(),
          leetcodeUsername: leetcodeUsername,
          collegeId: collegeId,
          role: "STUDENT",
        }
      });
      
      results.successful++;
    } catch (e: any) {
      console.error(`Error importing row ${rowNum}:`, e);
      results.failed++;
      results.errors.push(`Row ${rowNum}: Database collision or schema failure.`);
    }
  }

  return results;
}
