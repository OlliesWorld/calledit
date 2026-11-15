import { NotFoundMessage } from '@/components/layout/not-found-message'

// 404 inside the signed-in app (e.g. an unknown league slug). The dashboard
// layout already renders the status bar, footer and bottom nav around this.
export default function DashboardNotFound() {
  return <NotFoundMessage />
}
