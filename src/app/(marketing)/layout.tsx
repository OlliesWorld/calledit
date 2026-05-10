import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0b] noise">
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  )
}
