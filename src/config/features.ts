export const features = {
  auth: {
    googleOAuth: true,
    githubOAuth: false,
  },
  picks: {
    weeklyPickem: true,
    seasonLeaderboard: true,
    tiebreaker: true,
  },
} as const;
