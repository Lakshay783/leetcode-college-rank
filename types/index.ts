export type Role = "STUDENT" | "COLLEGE" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  leetcodeUsername: string | null;
  department: string | null;
  year: string | null;
  collegeEmail: string | null;
  collegeId: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  leetcodeUsername: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  rating?: number | null;
  college?: string | null;
}

export interface College {
  id: string;
  name: string;
  domain: string | null;
}

export interface LeetCodeStats {
  userId: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  rating: number | null;
  lastSyncedAt: Date;
}

export interface ApiResponse<T = void> {
  data?: T;
  error?: string;
  message?: string;
}
