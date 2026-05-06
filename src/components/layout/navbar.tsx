import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { siteConfig } from "@/config/site"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isDashboard?: boolean
}

export function Navbar({ isDashboard = false }: NavbarProps) {
  return (
    <header className="border-b border-stone-100 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href={isDashboard ? ROUTES.DASHBOARD : ROUTES.HOME}
          className="font-bold text-xl tracking-tight text-stone-900 hover:opacity-80 transition-opacity"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "w-9 h-9" } }}
            />
          </SignedIn>
          <SignedOut>
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Button
              size="sm"
              className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 shadow-sm transition-colors"
              asChild
            >
              <Link href={ROUTES.SIGNUP}>Sign up</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
