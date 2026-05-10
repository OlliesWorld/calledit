import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center px-5 text-center noise">
      <div className="max-w-sm w-full flex flex-col items-center gap-6">

        <div className="flex flex-col items-center gap-3">
          <h1 className="font-(family-name:--font-bebas) text-7xl tracking-widest text-white leading-none">
            CalledIt
          </h1>
          <p className="text-white/50 text-sm tracking-widest uppercase">
            WNBA Pick&apos;em
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-white/70 text-base leading-relaxed">
            Make your picks before tip-off, lock them in, and prove you called it.
          </p>
          <p className="text-white/35 text-sm leading-relaxed">
            Compete against friends on the leaderboard. New matchups every week.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full pt-2">
          <Link
            href={ROUTES.SIGNUP}
            className="w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Get started
          </Link>
          <Link
            href={ROUTES.LOGIN}
            className="w-full rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors"
          >
            Sign in
          </Link>
        </div>

      </div>
    </main>
  )
}
