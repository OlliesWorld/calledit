import Link from 'next/link'

/** Body of the 404 page. The surrounding layout supplies the footer. */
export function NotFoundMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5">
      <p className="font-(family-name:--font-dm-mono) text-[10px] uppercase tracking-widest text-white/60">404</p>
      <h1 className="font-(family-name:--font-bebas) text-4xl text-white tracking-wide mt-1">Page not found</h1>
      <p className="text-[13px] text-white/60 mt-2">That page doesn&apos;t exist. Bad call.</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-orange px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Go home
      </Link>
    </div>
  )
}
