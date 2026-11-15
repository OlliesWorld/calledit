'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { League } from '@/lib/leagues'

interface WeeklyEntry {
  rank: number
  user_id: string
  display_name: string
  avatar_url: string | null
  score: number
  total_pick_questions: number
  tiebreaker_guess: number | null
  tiebreaker_answer: number | null
}

interface SeasonEntry {
  rank: number
  user_id: string
  display_name: string
  avatar_url: string | null
  total_correct: number
  weeks_played: number
}

interface ScoredWeek {
  id: string
  week_number: number
  title: string
  scored_at: string | null
}

interface WeeklyResponse {
  week: { id: string; week_number: number; title: string } | null
  entries: WeeklyEntry[]
  scored_weeks: ScoredWeek[]
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#2a2a30] flex items-center justify-center shrink-0">
      <span className="text-[11px] font-(family-name:--font-dm-mono) text-white/50 uppercase">
        {name.slice(0, 2)}
      </span>
    </div>
  )
}

function RankCell({ rank }: { rank: number }) {
  if (MEDAL[rank]) {
    return <span className="text-base leading-none w-6 text-center">{MEDAL[rank]}</span>
  }
  return (
    <span className="text-[12px] font-(family-name:--font-dm-mono) text-white/30 w-6 text-center">
      {rank}
    </span>
  )
}

function WeeklyRow({
  entry,
  isMe,
}: {
  entry: WeeklyEntry
  isMe: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[12px] transition-colors',
        isMe
          ? 'bg-orange/10 border border-orange/25'
          : 'bg-[#1a1a1f] border border-white/[0.06]',
      )}
    >
      <RankCell rank={entry.rank} />
      <Avatar name={entry.display_name} url={entry.avatar_url} />
      <span
        className={cn(
          'flex-1 text-[14px] font-(family-name:--font-dm-sans) truncate',
          isMe ? 'text-orange font-medium' : 'text-white/80',
        )}
      >
        {entry.display_name}
        {isMe && (
          <span className="ml-2 text-[10px] font-(family-name:--font-dm-mono) text-orange/60 uppercase tracking-widest">
            you
          </span>
        )}
      </span>
      <div className="text-right shrink-0">
        <span className="font-(family-name:--font-bebas) text-xl text-white leading-none">
          {entry.score}
        </span>
        <span className="font-(family-name:--font-bebas) text-xl text-white/30 leading-none">
          /{entry.total_pick_questions}
        </span>
        {entry.tiebreaker_guess !== null && (
          <p className="text-[10px] font-(family-name:--font-dm-mono) text-white/30 mt-0.5">
            TB: {entry.tiebreaker_guess}
          </p>
        )}
      </div>
    </div>
  )
}

function SeasonRow({ entry, isMe }: { entry: SeasonEntry; isMe: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[12px] transition-colors',
        isMe
          ? 'bg-orange/10 border border-orange/25'
          : 'bg-[#1a1a1f] border border-white/[0.06]',
      )}
    >
      <RankCell rank={entry.rank} />
      <Avatar name={entry.display_name} url={entry.avatar_url} />
      <span
        className={cn(
          'flex-1 text-[14px] font-(family-name:--font-dm-sans) truncate',
          isMe ? 'text-orange font-medium' : 'text-white/80',
        )}
      >
        {entry.display_name}
        {isMe && (
          <span className="ml-2 text-[10px] font-(family-name:--font-dm-mono) text-orange/60 uppercase tracking-widest">
            you
          </span>
        )}
      </span>
      <div className="text-right shrink-0">
        <span className="font-(family-name:--font-bebas) text-2xl text-white leading-none">
          {entry.total_correct}
        </span>
        <p className="text-[10px] font-(family-name:--font-dm-mono) text-white/30 mt-0.5">
          {entry.weeks_played}w played
        </p>
      </div>
    </div>
  )
}

export function LeaderboardTable({ currentUserId, league }: { currentUserId: string; league: League }) {
  const [tab, setTab] = useState<'weekly' | 'season'>('weekly')
  const [weeklyData, setWeeklyData] = useState<WeeklyResponse | null>(null)
  const [seasonEntries, setSeasonEntries] = useState<SeasonEntry[]>([])
  const [selectedWeekId, setSelectedWeekId] = useState<string>('latest')
  const [loadingWeekly, setLoadingWeekly] = useState(true)
  const [loadingSeason, setLoadingSeason] = useState(false)
  const [seasonFetched, setSeasonFetched] = useState(false)

  const fetchWeekly = useCallback(async (weekId: string) => {
    setLoadingWeekly(true)
    try {
      const res = await fetch(`/api/leaderboard/weekly/${weekId}?league=${league}`)
      if (res.ok) {
        const data: WeeklyResponse = await res.json()
        setWeeklyData(data)
        if (weekId === 'latest' && data.week) setSelectedWeekId(data.week.id)
      }
    } finally {
      setLoadingWeekly(false)
    }
  }, [league])

  const fetchSeason = useCallback(async () => {
    if (seasonFetched) return
    setLoadingSeason(true)
    try {
      const res = await fetch(`/api/leaderboard/season?league=${league}`)
      if (res.ok) {
        const data: { entries: SeasonEntry[] } = await res.json()
        setSeasonEntries(data.entries)
        setSeasonFetched(true)
      }
    } finally {
      setLoadingSeason(false)
    }
  }, [seasonFetched, league])

  useEffect(() => {
    fetchWeekly('latest')
  }, [fetchWeekly])

  useEffect(() => {
    if (tab === 'season') fetchSeason()
  }, [tab, fetchSeason])

  function handleWeekChange(weekId: string) {
    setSelectedWeekId(weekId)
    fetchWeekly(weekId)
  }

  const scoredWeeks = weeklyData?.scored_weeks ?? []
  const noScoredWeeks = !loadingWeekly && scoredWeeks.length === 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="animate-fade-up">
        <p className="text-[10px] font-(family-name:--font-dm-mono) uppercase tracking-widest text-white/40 mb-1">
          Standings
        </p>
        <h1 className="font-(family-name:--font-bebas) text-4xl text-white leading-none tracking-wide">
          Leaderboard
        </h1>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-[#111114] rounded-[10px] p-1 animate-fade-up" style={{ animationDelay: '40ms' }}>
        {(['weekly', 'season'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2 rounded-[8px] text-[11px] font-(family-name:--font-dm-mono) uppercase tracking-widest transition-all',
              tab === t
                ? 'bg-orange text-black font-medium'
                : 'text-white/40 hover:text-white/60',
            )}
          >
            {t === 'weekly' ? 'This Week' : 'Season'}
          </button>
        ))}
      </div>

      {/* Weekly tab */}
      {tab === 'weekly' && (
        <div className="space-y-2 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {/* Week selector */}
          {scoredWeeks.length > 1 && (
            <select
              value={selectedWeekId}
              onChange={(e) => handleWeekChange(e.target.value)}
              className="w-full bg-[#1a1a1f] border border-white/[0.08] rounded-[10px] px-3 py-2 text-[13px] text-white/70 font-(family-name:--font-dm-mono) focus:outline-none focus:border-orange/40"
            >
              {scoredWeeks.map((w) => (
                <option key={w.id} value={w.id}>
                  Week {w.week_number} — {w.title}
                </option>
              ))}
            </select>
          )}

          {loadingWeekly && <LoadingSkeleton />}

          {!loadingWeekly && noScoredWeeks && (
            <EmptyState message="No scored weeks yet" sub="Check back after the first week is scored" />
          )}

          {!loadingWeekly && weeklyData?.week && weeklyData.entries.length === 0 && (
            <EmptyState message="No picks submitted" sub="Nobody picked this week" />
          )}

          {!loadingWeekly &&
            weeklyData?.entries.map((entry) => (
              <WeeklyRow
                key={entry.user_id}
                entry={entry}
                isMe={entry.user_id === currentUserId}
              />
            ))}
        </div>
      )}

      {/* Season tab */}
      {tab === 'season' && (
        <div className="space-y-2 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {loadingSeason && <LoadingSkeleton />}

          {!loadingSeason && seasonEntries.length === 0 && (
            <EmptyState message="No season data yet" sub="Season standings appear after the first week is scored" />
          )}

          {!loadingSeason &&
            seasonEntries.map((entry) => (
              <SeasonRow
                key={entry.user_id}
                entry={entry}
                isMe={entry.user_id === currentUserId}
              />
            ))}
        </div>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-[58px] rounded-[12px] bg-[#1a1a1f] animate-pulse"
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  )
}

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="font-(family-name:--font-bebas) text-2xl text-white/30 tracking-wide">{message}</p>
      <p className="text-[13px] text-white/25 mt-1">{sub}</p>
    </div>
  )
}
