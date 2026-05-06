import { Navbar } from '@/components/layout/navbar'

// Force dynamic rendering - auth layout uses Clerk components
export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
