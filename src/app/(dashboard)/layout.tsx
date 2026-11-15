import { StatusBar } from '@/components/layout/status-bar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { isAdmin } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adminUser = await isAdmin()

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col noise">
      <StatusBar />
      <main className="flex-1 pb-32 pt-4">
        <div className="max-w-107.5 mx-auto px-5">
          {children}
        </div>
      </main>
      <BottomNav isAdmin={adminUser} />
    </div>
  )
}
