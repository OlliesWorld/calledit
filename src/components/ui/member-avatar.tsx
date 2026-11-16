'use client'

import { UserAvatar, AVATAR_VARIANTS, type AvatarVariant } from '@/components/ui/user-avatar'

// Clerk-hosted profile photos are the only remote images we render.
const CLERK_IMAGE_PREFIX = 'https://img.clerk.com/'

interface MemberAvatarProps {
  name: string
  /** profiles.avatar_url ("boring:<variant>") or a Clerk imageUrl */
  url: string | null
  seed: string
  size?: number
}

/**
 * Avatar for someone else's profile. Never loads an arbitrary user-supplied
 * URL: generated avatars render locally, Clerk photos come from img.clerk.com,
 * anything else falls back to initials.
 */
export function MemberAvatar({ name, url, seed, size = 32 }: MemberAvatarProps) {
  const box = { width: size, height: size }
  const variant = url?.startsWith('boring:') ? url.slice('boring:'.length) : null

  if (variant && (AVATAR_VARIANTS as readonly string[]).includes(variant)) {
    return (
      <span className="rounded-full overflow-hidden shrink-0 block" style={box}>
        <UserAvatar seed={seed} variant={variant as AvatarVariant} size={size} />
      </span>
    )
  }

  if (url?.startsWith(CLERK_IMAGE_PREFIX)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- tiny avatar, no need for the image optimizer
      <img src={url} alt="" className="rounded-full object-cover shrink-0" style={box} referrerPolicy="no-referrer" />
    )
  }

  return (
    <div className="rounded-full bg-[#2a2a30] flex items-center justify-center shrink-0" style={box} aria-hidden="true">
      <span className="text-[11px] font-(family-name:--font-dm-mono) text-white/50 uppercase">
        {name.slice(0, 2)}
      </span>
    </div>
  )
}
