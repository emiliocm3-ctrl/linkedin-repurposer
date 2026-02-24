import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { LayoutDashboard, History, BarChart3, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-bold text-xl">
              LinkedIn Repurposer
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <History className="h-4 w-4" />
                History
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
