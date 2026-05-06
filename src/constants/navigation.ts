import { ROUTES } from './routes'

export const dashboardNav = [
  {
    name: 'This Week',
    href: ROUTES.DASHBOARD,
    icon: 'Calendar',
  },
  {
    name: 'Leaderboard',
    href: '/leaderboard',
    icon: 'BarChart',
  },
  {
    name: 'Profile',
    href: ROUTES.PROFILE,
    icon: 'User',
  },
] as const;
