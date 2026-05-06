import Link from "next/link"
import { Sparkles } from "lucide-react"
import { siteConfig } from "@/config/site"
import { ROUTES } from "@/constants/routes"

export function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
                <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl tracking-tight text-stone-900 mb-4 hover:opacity-80 transition-opacity w-fit">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <span>{siteConfig.name}</span>
                </Link>
                <p className="text-stone-500 max-w-xs leading-relaxed">
                    A thoughtfully crafted Next.js starter template. Skip the setup, start building what matters.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-stone-900 mb-4">Resources</h4>
                <ul className="space-y-3 text-stone-600">
                    <li><Link href="#" className="hover:text-orange-600 transition-colors">Documentation</Link></li>
                    <li><Link href="#" className="hover:text-orange-600 transition-colors">Quick Start</Link></li>
                    <li><Link href="#" className="hover:text-orange-600 transition-colors">Examples</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-stone-900 mb-4">Community</h4>
                <ul className="space-y-3 text-stone-600">
                    <li><Link href="#" className="hover:text-orange-600 transition-colors">GitHub</Link></li>
                    <li><Link href="#" className="hover:text-orange-600 transition-colors">Discussions</Link></li>
                    <li><Link href="#" className="hover:text-orange-600 transition-colors">Contributing</Link></li>
                </ul>
            </div>
        </div>
        <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-stone-400 hover:text-orange-600 transition-colors">
              X (Twitter)
            </Link>
            <Link href="#" className="text-stone-400 hover:text-orange-600 transition-colors">
              GitHub
            </Link>
            <Link href="#" className="text-stone-400 hover:text-orange-600 transition-colors">
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
