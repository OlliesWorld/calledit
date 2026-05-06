import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Week } from '@/types/calledit'

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-white/10 text-white/50',
  open: 'bg-orange/15 text-orange',
  locked: 'bg-white/10 text-white/60',
  scored: 'bg-lime/15 text-lime',
}

export default async function AdminPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  const supabase = createAdminClient()
  const { data: weeks } = await supabase!
    .from('weeks')
    .select('*')
    .order('week_number', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">Admin</p>
          <h1 className="font-(family-name:--font-bebas) text-4xl text-white tracking-wide">Weeks</h1>
        </div>
        <Link
          href="/admin/weeks/new"
          className="bg-orange text-black font-(family-name:--font-bebas) text-lg tracking-wide px-4 py-2 rounded-[10px] hover:bg-orange/90 transition-colors"
        >
          + New Week
        </Link>
      </div>

      <div className="space-y-2">
        {!weeks?.length && (
          <p className="text-white/30 text-sm text-center py-8">No weeks yet — create one to get started.</p>
        )}
        {weeks?.map((week: Week) => (
          <div key={week.id} className="bg-[#1a1a1f] border border-white/[0.08] rounded-[14px] p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`shrink-0 text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_COLORS[week.status] ?? 'bg-white/10 text-white/50'}`}>
                {week.status}
              </span>
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{week.title}</p>
                <p className="text-white/40 text-[12px]">Week {week.week_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/admin/weeks/${week.id}`} className="text-[13px] text-white/50 hover:text-white px-3 py-1.5 rounded-[8px] hover:bg-white/5 transition-colors">
                Manage
              </Link>
              {(week.status === 'locked') && (
                <Link href={`/admin/weeks/${week.id}/score`} className="text-[13px] text-orange hover:text-orange/80 px-3 py-1.5 rounded-[8px] hover:bg-orange/5 transition-colors">
                  Score
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
