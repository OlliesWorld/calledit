import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LeagueSwitcher } from './league-switcher'

const meta = {
  title: 'League/LeagueSwitcher',
  component: LeagueSwitcher,
  decorators: [
    (Story) => (
      <div className="px-5 py-2" style={{ background: "#111114", borderRadius: 10 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LeagueSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const WnbaActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/wnba' } } },
}
export const UnrivaledActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/unrivaled' } } },
}
export const OnLeaderboard: Story = {
  parameters: { nextjs: { navigation: { pathname: '/unrivaled/leaderboard' } } },
}
