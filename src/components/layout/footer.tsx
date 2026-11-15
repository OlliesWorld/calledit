import Link from "next/link"
import { siteConfig } from "@/config/site"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { DEFAULT_LEAGUE, LEAGUE_DISCLAIMERS, leagueTagline, type League } from "@/lib/leagues"

interface FooterProps {
  /**
   * The league the page belongs to. Omit for the default league (marketing
   * pages); pass null for a page with no league, which gets a neutral tagline.
   */
  league?: League | null
  /** "compact" is a two-line version for the signed-in app, where space is tight. */
  variant?: "full" | "compact"
  className?: string
}

export function Footer({ league = DEFAULT_LEAGUE, variant = "full", className }: FooterProps) {
  const disclaimer = league ? LEAGUE_DISCLAIMERS[league] : undefined
  const tagline = league ? leagueTagline(league) : siteConfig.tagline

  if (variant === "compact") {
    return (
      <footer className={cn("border-t border-white/8 px-5 py-4 text-center space-y-1", className)}>
        <p className="text-white/40 text-[11px] leading-relaxed">
          {tagline}
          {disclaimer && <> · {disclaimer}</>}
        </p>
        <p className="text-white/20 text-[10px] leading-relaxed">
          © {new Date().getFullYear()} {siteConfig.name} ·{" "}
          <Link href="#" className="hover:text-white/50 transition-colors">Privacy</Link> ·{" "}
          <Link href="#" className="hover:text-white/50 transition-colors">Terms</Link>
        </p>
      </footer>
    )
  }

  return (
    <footer className={cn("bg-surface border-t border-white/8 py-10", className)}>
      <div className="max-w-sm mx-auto px-5 flex flex-col items-center gap-4 text-center">
        <Link
          href={ROUTES.HOME}
          className="font-(family-name:--font-bebas) text-2xl tracking-widest text-orange leading-none"
        >
          {siteConfig.name}
        </Link>
        <p className="text-white/30 text-xs leading-relaxed">
          {tagline}
        </p>
        {disclaimer && (
          <p className="text-white/40 text-xs leading-relaxed">{disclaimer}</p>
        )}
        <div className="flex gap-6 text-xs text-white/20">
          <Link href="#" className="hover:text-white/50 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white/50 transition-colors">Terms</Link>
        </div>
        <p className="text-white/15 text-[10px]">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  )
}
