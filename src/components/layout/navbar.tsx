import Link from "next/link"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { siteConfig } from "@/config/site"
import { ROUTES } from "@/constants/routes"
import { UserMenu } from "@/components/ui/user-menu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-white/8">
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href={ROUTES.HOME}
          className="font-(family-name:--font-bebas) text-2xl tracking-widest text-orange leading-none"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <UserMenu />
          </SignedIn>
          <SignedOut>
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href={ROUTES.SIGNUP}
              className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Sign up
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
