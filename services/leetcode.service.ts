import { prisma } from "@/lib/prisma";

const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

export async function fetchLeetCodeStats(username: string) {
  const solvedQuery = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const contestQuery = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        rating
      }
    }
  `;

  try {
    // 1. Fetch solved stats
    const solvedRes = await fetch(LEETCODE_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: solvedQuery, variables: { username } }),
      cache: "no-store",
    });

    if (!solvedRes.ok) {
      console.error(`LeetCode API HTTP error for ${username}: ${solvedRes.status}`);
      return null;
    }

    const solvedData = await solvedRes.json();

    if (solvedData.errors) {
      console.error(`LeetCode GraphQL error for ${username}:`, solvedData.errors);
      return null;
    }

    const matchedUser = solvedData.data?.matchedUser;
    if (!matchedUser) {
      // If matchedUser is null, the username is invalid or does not exist
      console.warn(`LeetCode username not found: ${username}`);
      return null;
    }

    const acStats = matchedUser.submitStatsGlobal?.acSubmissionNum;
    if (!acStats) {
      return null; 
    }

    let easy = 0, medium = 0, hard = 0, total = 0;
    acStats.forEach((stat: any) => {
      if (stat.difficulty === "All") total = stat.count;
      if (stat.difficulty === "Easy") easy = stat.count;
      if (stat.difficulty === "Medium") medium = stat.count;
      if (stat.difficulty === "Hard") hard = stat.count;
    });

    // 2. Fetch contest rating
    const contestRes = await fetch(LEETCODE_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: contestQuery, variables: { username } }),
      cache: "no-store",
    });

    const contestData = await contestRes.json();
    
    // Some users might not have participated in contests
    const ratingRaw = contestData.data?.userContestRanking?.rating;
    const rating = ratingRaw ? Math.round(ratingRaw) : null;

    return { total, easy, medium, hard, rating };
  } catch (error) {
    console.error(`Network or parsing error fetching LeetCode stats for ${username}:`, error);
    return null;
  }
}

export async function syncUserStats(userId: string, username: string) {
  try {
    const stats = await fetchLeetCodeStats(username);
    
    // If stats are null (e.g., user not found or api failed), we skip updating
    if (!stats) {
      console.warn(`Skipping DB update for ${username} due to failed fetch.`);
      return false;
    }

    await prisma.leetCodeStats.upsert({
      where: { userId },
      update: {
        solved: stats.total,
        easy: stats.easy,
        medium: stats.medium,
        hard: stats.hard,
        rating: stats.rating,
        lastSyncedAt: new Date(),
      },
      create: {
        userId,
        solved: stats.total,
        easy: stats.easy,
        medium: stats.medium,
        hard: stats.hard,
        rating: stats.rating,
      },
    });

    return true;
  } catch (error) {
    console.error(`Error saving stats to DB for user ${userId}:`, error);
    return false;
  }
}

export async function syncAllOnboardedUsers() {
  const users = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      leetcodeUsername: { not: null },
    },
    select: { id: true, leetcodeUsername: true },
  });

  const results = { successful: 0, failed: 0 };

  // Sequential fetch for MVP to avoid rate-limiting from LeetCode
  for (const user of users) {
    if (!user.leetcodeUsername) continue;
    
    try {
      const synced = await syncUserStats(user.id, user.leetcodeUsername);
      if (synced) {
        results.successful++;
      } else {
        results.failed++;
      }
    } catch (e) {
      console.error(`Unexpected crash syncing user ${user.leetcodeUsername}:`, e);
      results.failed++;
    }
  }

  return results;
}
