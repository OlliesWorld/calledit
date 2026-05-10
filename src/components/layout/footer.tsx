import Link from "next/link"
import { siteConfig } from "@/config/site"
import { ROUTES } from "@/constants/routes"

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/8 py-10">
      <div className="max-w-sm mx-auto px-5 flex flex-col items-center gap-4 text-center">
        <Link
          href={ROUTES.HOME}
          className="font-(family-name:--font-bebas) text-2xl tracking-widest text-orange leading-none"
        >
          {siteConfig.name}
        </Link>
        <p className="text-white/30 text-xs leading-relaxed">
          WNBA pick&apos;em. Call it. Prove it.
        </p>
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
