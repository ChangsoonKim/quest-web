import * as React from "react"
import { Bell, Home, User, History } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface QuestLayoutProps {
  children: React.ReactNode
}

export function QuestLayout({ children }: QuestLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">Nado Quest</span>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-5 w-5" />
          <span className="sr-only">알림</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background px-4 pb-safe pt-2">
        <div className="flex h-14 items-center justify-around">
          <NavItem icon={Home} label="홈" active />
          <NavItem icon={History} label="히스토리" />
          <NavItem icon={User} label="내 정보" />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )
}
