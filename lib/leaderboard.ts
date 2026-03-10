const LEADERBOARD_KEY = "lol-leaderboard";
const USERNAME_KEY = "lol-username";
const MAX_ENTRIES = 20;

export type LeaderboardEntry = {
  username: string;
  score: number;
  total: number;
  date: string;
};

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function setUsername(name: string) {
  localStorage.setItem(USERNAME_KEY, name);
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function addScore(username: string, score: number, total: number) {
  const entries = getLeaderboard();
  entries.push({
    username,
    score,
    total,
    date: new Date().toISOString(),
  });

  // Sort by score descending, then by date (newest first for ties)
  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Keep top entries only
  const trimmed = entries.slice(0, MAX_ENTRIES);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  return trimmed;
}
