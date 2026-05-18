import Link from 'next/link'
import { redirect } from 'next/navigation'
import { clerkClient } from '@clerk/nextjs/server'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

interface MemberRow {
  user_id: string
  display_name: string
  username: string | null
  avatar_url: string | null
  joined_at: string | null
  last_active_at: string | null
  total_score: number
}

interface ProfileRow {
  user_id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  created_at: string | null
}

interface ClerkLite {
  id: string
  fullName: string | null
  username: string | null
  imageUrl: string | null
  email: string | null
  createdAt: string | null
}

function clerkDisplayName(u: ClerkLite): string {
  if (u.username) return u.username
  if (u.fullName) return u.fullName
  if (u.email) return u.email
  return `Player ${u.id.slice(-4).toUpperCase()}`
}

function resolveDisplayName(
  profile: ProfileRow | null | undefined,
  clerkUser: ClerkLite | null | undefined,
  userId: string,
): string {
  if (profile?.username) return profile.username
  if (profile?.full_name) return profile.full_name
  if (clerkUser) return clerkDisplayName(clerkUser)
  return `Player ${userId.slice(-4).toUpperCase()}`
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatRelative(iso: string | null): string {
  if (!iso) return 'never'
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = now - then
  const day = 86_400_000
  if (diffMs < 60_000) return 'just now'
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`
  if (diffMs < day) return `${Math.floor(diffMs / 3_600_000)}h ago`
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`
  return formatDate(iso)
}

async function fetchAllClerkUsers(): Promise<ClerkLite[]> {
  const client = await clerkClient()
  const limit = 100
  const all: ClerkLite[] = []
  let offset = 0
  while (true) {
    const page = await client.users.getUserList({ limit, offset, orderBy: '-created_at' })
    for (const u of page.data) {
      const primaryEmail = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
      all.push({
        id: u.id,
        fullName: u.fullName ?? ([u.firstName, u.lastName].filter(Boolean).join(' ') || null),
        username: u.username ?? null,
        imageUrl: u.imageUrl ?? null,
        email: primaryEmail?.emailAddress ?? null,
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
      })
    }
    if (page.data.length < limit) break
    offset += limit
  }
  return all
}

async function loadMembers(): Promise<MemberRow[]> {
  const supabase = createAdminClient()

  const clerkUsers = await fetchAllClerkUsers().catch(() => [] as ClerkLite[])
  const clerkMap = new Map(clerkUsers.map((u) => [u.id, u]))

  const profileMap = new Map<string, ProfileRow>()
  const scoreMap = new Map<string, number>()
  const lastActiveMap = new Map<string, string>()

  if (supabase) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, username, avatar_url, created_at')
    for (const p of profiles ?? []) profileMap.set(p.user_id, p as ProfileRow)

    const { data: scoredWeeks } = await supabase
      .from('weeks')
      .select('id')
      .eq('status', 'scored')
    const scoredWeekIds = (scoredWeeks ?? []).map((w) => w.id)

    const pickQuestionIds = new Set<string>()
    if (scoredWeekIds.length) {
      const { data: pickQuestions } = await supabase
        .from('questions')
        .select('id')
        .in('week_id', scoredWeekIds)
        .eq('question_type', 'pick')
      for (const q of pickQuestions ?? []) pickQuestionIds.add(q.id)
    }

    const { data: picks } = await supabase
      .from('picks')
      .select('user_id, question_id, is_correct, updated_at')

    for (const pick of picks ?? []) {
      if (pick.is_correct === true && pickQuestionIds.has(pick.question_id)) {
        scoreMap.set(pick.user_id, (scoreMap.get(pick.user_id) ?? 0) + 1)
      }
      const prev = lastActiveMap.get(pick.user_id)
      if (pick.updated_at && (!prev || pick.updated_at > prev)) {
        lastActiveMap.set(pick.user_id, pick.updated_at)
      }
    }
  }

  const allUserIds = new Set<string>([...clerkMap.keys(), ...profileMap.keys()])

  const rows: MemberRow[] = []
  for (const userId of allUserIds) {
    const profile = profileMap.get(userId)
    const clerkUser = clerkMap.get(userId)
    rows.push({
      user_id: userId,
      display_name: resolveDisplayName(profile, clerkUser, userId),
      username: profile?.username ?? clerkUser?.username ?? null,
      avatar_url: profile?.avatar_url ?? clerkUser?.imageUrl ?? null,
      joined_at: clerkUser?.createdAt ?? profile?.created_at ?? null,
      last_active_at: lastActiveMap.get(userId) ?? null,
      total_score: scoreMap.get(userId) ?? 0,
    })
  }

  rows.sort((a, b) => {
    const aTime = a.joined_at ? Date.parse(a.joined_at) : 0
    const bTime = b.joined_at ? Date.parse(b.joined_at) : 0
    return bTime - aTime
  })

  return rows
}

export default async function AdminMembersPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  const members = await loadMembers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">Admin</p>
          <h1 className="font-(family-name:--font-bebas) text-4xl text-white tracking-wide">Members</h1>
        </div>
        <Link
          href="/admin"
          className="text-[13px] text-white/50 hover:text-white px-3 py-1.5 rounded-[8px] hover:bg-white/5 transition-colors"
        >
          ← Weeks
        </Link>
      </div>

      <p className="text-[11px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40">
        {members.length} {members.length === 1 ? 'Member' : 'Members'}
      </p>

      <div className="space-y-2">
        {members.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">No members yet.</p>
        )}
        {members.map((m) => (
          <div
            key={m.user_id}
            className="bg-[#1a1a1f] border border-white/[0.08] rounded-[14px] p-4 flex items-center gap-3"
          >
            {m.avatar_url ? (
              <img src={m.avatar_url} alt={m.display_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#2a2a30] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-(family-name:--font-dm-mono) text-white/50 uppercase">
                  {m.display_name.slice(0, 2)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{m.display_name}</p>
              <p className="text-[11px] font-(family-name:--font-dm-mono) text-white/40">
                Joined {formatDate(m.joined_at)} · Active {formatRelative(m.last_active_at)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-(family-name:--font-bebas) text-2xl text-white leading-none">
                {m.total_score}
              </span>
              <p className="text-[10px] font-(family-name:--font-dm-mono) text-white/30 mt-0.5">total</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
