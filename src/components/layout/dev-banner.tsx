import { siteConfig } from '@/config/site'

/** Site-wide notice strip. Renders nothing when siteConfig.devNotice is null. */
export function DevBanner() {
  if (!siteConfig.devNotice) return null

  return (
    <aside
      aria-label="Site notice"
      className="bg-[#0a0a0b] border-b border-gold/25 px-4 py-2 text-center"
    >
      <p className="font-(family-name:--font-dm-mono) text-[10px] uppercase tracking-widest leading-relaxed text-gold">
        {siteConfig.devNotice}
      </p>
    </aside>
  )
}
