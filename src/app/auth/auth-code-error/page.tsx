import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Footer } from '@/components/layout/footer'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0b]">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-surface2 border border-white/8 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center text-coral mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Authentication Error</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Something went wrong signing you in. The link may have expired or already been used.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" className="w-full rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              Try again
            </Link>
            <Link href="/" className="w-full rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">
              Go home
            </Link>
          </div>
        </div>
      </div>
      <Footer league={null} />
    </div>
  )
}
