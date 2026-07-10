import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 mt-auto">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-medium text-[#fb5d80]">VIDDEY</span>
          {' '}— {siteConfig.tagline}
        </p>
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          <Link href={siteConfig.links.terms} className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href={siteConfig.links.privacy} className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <a href={siteConfig.links.contact} className="hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}
