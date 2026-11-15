'use client'

import Avatar from 'boring-avatars'

const COLORS = ['#FF5F1F', '#FF3B6E', '#B8FF3A', '#8B5CF6', '#FFD166']

export const AVATAR_VARIANTS = ['beam', 'marble', 'pixel', 'sunset', 'ring', 'bauhaus'] as const
export type AvatarVariant = typeof AVATAR_VARIANTS[number]

interface UserAvatarProps {
  seed: string
  variant?: AvatarVariant
  size?: number
}

export function UserAvatar({ seed, variant = 'beam', size = 32 }: UserAvatarProps) {
  return (
    <Avatar
      size={size}
      name={seed || 'default'}
      variant={variant}
      colors={COLORS}
      // Decorative: the control around it carries the accessible name
      aria-hidden="true"
    />
  )
}
