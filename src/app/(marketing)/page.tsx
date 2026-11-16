import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import { LeaguePicker } from '@/components/league/league-picker'

// Facts about the app only: no player stats or form claims that would go stale
// or need sourcing.
const TICKER_ITEMS = [
  '🏀 Unrivaled 2027 tips off Jan 8 in Boston & Los Angeles',
  '🟢 Jan 8 picks are open: lock yours in',
  '🎯 5 calls + 1 tiebreaker every week',
  '🔒 Picks lock before tip-off: no take-backs',
  '🏆 Weekly and season leaderboards for each league',
  '🏀 WNBA sample week open now',
]

// Mirrors real questions from the open weeks, in the same shape the picks page uses.
const MOCK_PICKS = [
  {
    league: 'Unrivaled',
    matchup: 'Phantom BC vs Mist BC',
    when: 'Jan 8 · Boston',
    question: 'Will Phantom BC defeat Mist BC?',
    flavor: 'Unrivaled takes the show on the road for 2027, and it all starts at TD Garden. First game of the season, first chance to look like a genius.',
    pickedYes: true,
  },
  {
    league: 'WNBA',
    matchup: 'Wings at Lynx',
    when: 'Sample week',
    question: 'Will Paige Bueckers score 20+ points against the Minnesota Lynx?',
    flavor: 'Over or under twenty? Your call.',
    pickedYes: false,
  },
]

export default function Home() {
  const tickerText = TICKER_ITEMS.join('  ·  ')

  return (
    <main className="min-h-screen bg-[#0a0a0b] flex flex-col noise">

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 pt-16 pb-8 text-center">
        <div className="max-w-sm w-full space-y-8">

          {/* Badge */}
          <div className="animate-fade-up flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime/30 bg-lime/10 text-lime font-(family-name:--font-dm-mono) text-[10px] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              Unrivaled 2027 · Picks Open
            </span>
          </div>

          {/* Headline */}
          <div className="animate-fade-up stagger-1 space-y-0 leading-none">
            <h1 className="font-(family-name:--font-bebas) text-[88px] tracking-tight text-white leading-[0.9]">
              CALL
            </h1>
            <h1 className="font-(family-name:--font-bebas) text-[88px] tracking-tight leading-[0.9]"
              style={{ background: 'linear-gradient(135deg, #FF5F1F, #FF3B6E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              IT.
            </h1>
          </div>

          {/* Sub */}
          <div className="animate-fade-up stagger-2 space-y-2">
            <p className="text-white/70 text-base leading-relaxed">
              A weekly pick&apos;em for women&apos;s basketball. Make your WNBA and Unrivaled calls before tip-off, lock them in, and prove you called it.
            </p>
            <p className="text-white/55 text-sm font-(family-name:--font-dm-mono) uppercase tracking-widest">
              New matchups every week · Free to play
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-fade-up stagger-3 flex flex-col gap-3 w-full">
            <Link
              href={ROUTES.SIGNUP}
              className="w-full rounded-full bg-orange px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange/25 hover:opacity-90 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Start calling picks
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="w-full rounded-full border border-white/10 px-6 py-3.5 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white/80 transition-colors"
            >
              Sign in
            </Link>
          </div>

          {/* League choice */}
          <div className="animate-fade-up stagger-3">
            <LeaguePicker />
          </div>

        </div>
      </section>

      {/* Ticker */}
      <div className="bg-orange overflow-hidden py-2.5 select-none">
        <div className="animate-ticker whitespace-nowrap">
          {[tickerText, tickerText].map((text, i) => (
            <span key={i} className="font-(family-name:--font-dm-mono) text-[11px] uppercase tracking-widest text-black px-8">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Mock picks preview */}
      <section className="px-5 py-12 flex flex-col items-center">
        <div className="max-w-sm w-full space-y-4">

          <div className="text-center space-y-1 mb-6">
            <p className="font-(family-name:--font-dm-mono) text-[10px] uppercase tracking-widest text-white/55">
              This week&apos;s picks
            </p>
            <h2 className="font-(family-name:--font-bebas) text-3xl text-white tracking-wide">
              Make Your Call
            </h2>
          </div>

          {MOCK_PICKS.map((pick, i) => (
            <div
              key={i}
              className="rounded-[14px] border border-white/8 bg-surface2 p-4 space-y-3 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Matchup header */}
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-orange/30 bg-orange/10 px-2.5 py-1 font-(family-name:--font-dm-mono) text-[10px] uppercase tracking-widest text-orange">
                  {pick.league}
                </span>
                <div className="text-right">
                  <p className="text-white text-sm font-semibold leading-tight">{pick.matchup}</p>
                  <p className="text-white/55 text-[11px] font-(family-name:--font-dm-mono) uppercase tracking-wide">{pick.when}</p>
                </div>
              </div>

              {/* Question */}
              <p className="text-[15px] font-medium text-white/90 leading-snug">{pick.question}</p>

              {/* Flavor */}
              <div className="rounded-[10px] bg-violet/10 border border-violet/20 px-3 py-2">
                <p className="text-[12px] text-white/70 leading-relaxed italic">{pick.flavor}</p>
              </div>

              {/* Pick buttons — locked/blurred for non-users */}
              <div className="grid grid-cols-2 gap-2 pt-1 relative">
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[10px] bg-[#0a0a0b]/60 backdrop-blur-[2px]">
                  <Link href={ROUTES.SIGNUP} className="font-(family-name:--font-bebas) text-lg tracking-wide text-orange hover:text-orange/80 transition-colors">
                    Sign up to pick →
                  </Link>
                </div>
                <div className={`rounded-[14px] py-3 font-(family-name:--font-bebas) text-2xl tracking-wide text-center ${pick.pickedYes ? 'bg-orange text-black' : 'bg-surface3 text-white/55'}`}>
                  YES
                </div>
                <div className={`rounded-[14px] py-3 font-(family-name:--font-bebas) text-2xl tracking-wide text-center ${!pick.pickedYes ? 'bg-coral text-black' : 'bg-surface3 text-white/55'}`}>
                  NO
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* How it works */}
      <section className="px-5 pb-12 flex flex-col items-center">
        <div className="max-w-sm w-full space-y-3">
          <p className="font-(family-name:--font-dm-mono) text-[10px] uppercase tracking-widest text-white/55 text-center mb-5">How it works</p>
          {[
            { num: '01', label: 'Make 5 calls', desc: 'Yes or no on this week’s games and players, plus a tiebreaker' },
            { num: '02', label: 'Lock it in', desc: 'Picks lock before tip-off. No take-backs.' },
            { num: '03', label: 'Climb the board', desc: 'One point per correct call. Weekly and season standings for each league.' },
          ].map((step) => (
            <div key={step.num} className="bg-surface2 border border-white/8 rounded-2xl p-4 flex items-center gap-4">
              <p className="font-(family-name:--font-bebas) text-3xl text-orange leading-none w-10 shrink-0">{step.num}</p>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{step.label}</p>
                <p className="text-white/60 text-[12px] leading-snug mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-16 flex flex-col items-center">
        <div className="max-w-sm w-full bg-surface2 border border-white/8 rounded-3xl p-8 text-center space-y-4">
          <p className="font-(family-name:--font-bebas) text-4xl text-white tracking-wide leading-tight">
            Ready to prove<br />
            <span className="text-orange">you know ball?</span>
          </p>
          <p className="text-white/60 text-sm">Free to play. No credit card. Just picks.</p>
          <Link
            href={ROUTES.SIGNUP}
            className="block w-full rounded-full bg-orange px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange/25 hover:opacity-90 transition-all hover:-translate-y-0.5"
          >
            Create your account
          </Link>
        </div>
      </section>

      <p className="px-5 pb-10 text-center text-[11px] text-white/55">
        Fan-made. Not affiliated with the WNBA or Unrivaled.
      </p>

    </main>
  )
}
