import { z } from "zod";

export const onboardSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  collegeEmail: z.string().email("Invalid email address"),
  department: z.string().min(2, "Department is required"),
  year: z.string().min(1, "Year is required"),
  leetcodeUsername: z
    .string()
    .min(1, "LeetCode username is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid LeetCode username format"),
  collegeId: z.string().cuid("Please select a valid college"),
});

export type OnboardInput = z.infer<typeof onboardSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  leetcodeUsername: z
    .string()
    .min(1, "LeetCode username is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid LeetCode username format"),
  collegeId: z.string().cuid("Invalid college ID").optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  leetcodeUsername: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid LeetCode username format")
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
