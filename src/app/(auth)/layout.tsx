import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] noise">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
      <Footer league={null} />
    </div>
  )
}
