export const GAME_ROUNDS = 5;
export const LAUGH_THRESHOLD = 75;

export type GameVideo = {
  id: string;
  title: string;
  type: "youtube" | "file";
  url?: string; // blob URL for uploaded files
};

export const DEFAULT_VIDEOS: GameVideo[] = [];

export const FEATURES = [
  {
    title: "Try Not to Lol",
    description:
      "Community-curated videos. Your mic is hot. One laugh and you're out. Survive all five rounds to prove you're built different.",
    icon: "Gamepad2" as const,
  },
  {
    title: "Reward System",
    description:
      "Play games, contribute content, hold your bag. Active participants earn from the community treasury.",
    icon: "Gift" as const,
  },
];

export const STATS = [
  { value: "10K+", label: "Holders" },
  { value: "50M", label: "Supply" },
  { value: "100%", label: "Community" },
  { value: "0", label: "VC Funding" },
];

export const UTILITY_ITEMS = [
  {
    title: "Rewards",
    description: "Earn $lol for contributing content, playing games, and holding.",
  },
];
