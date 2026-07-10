import Link from 'next/link'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-bold text-lg tracking-tight select-none"
          aria-label="VIDDEY home"
        >
          <span className="text-[#fb5d80]">VIDDEY</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
