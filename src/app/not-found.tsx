import { Footer } from '@/components/layout/footer'
import { NotFoundMessage } from '@/components/layout/not-found-message'

// 404 for URLs that match no route at all.
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] noise">
      <main className="flex-1 flex items-center justify-center">
        <NotFoundMessage />
      </main>
      <Footer league={null} />
    </div>
  )
}
