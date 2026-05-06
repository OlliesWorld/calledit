import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-stone-900">CalledIt</h1>
      <p className="mt-4 text-lg text-stone-500">WNBA pick&apos;em. Call it. Prove it.</p>
      <div className="mt-8 flex gap-4">
        <Link
          href={ROUTES.SIGNUP}
          className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
        >
          Get started
        </Link>
        <Link
          href={ROUTES.LOGIN}
          className="rounded-full border border-stone-200 px-6 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </main>
  )
}
