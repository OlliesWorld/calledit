import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-pink-100 via-white to-white dark:from-pink-950 dark:via-black dark:to-black opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-medium mb-6 border border-pink-100 dark:border-pink-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          v1.0.0 Now Available
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
          Build faster with <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#f396e5] to-pink-600">
            Next.js & Tailwind
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          A production-ready template featuring Next.js 15, Tailwind CSS 4, and React 19. 
          Everything you need to ship your next project in record time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto text-lg h-14 rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-1 transition-all"
          >
            <a href="#getting-started">Get Started</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-lg h-14 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <a href="#features">
              View Documentation
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
