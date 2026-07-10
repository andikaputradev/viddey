import type { Metadata } from 'next'
import { Shield, Zap, Link2, Palette } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { UploadCard } from '@/components/upload/upload-card'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
}

const features = [
  {
    icon: Shield,
    title: 'No login required',
    description: 'Upload and share immediately. No account, no friction.',
  },
  {
    icon: Zap,
    title: 'Fast upload flow',
    description: 'Direct upload with real-time progress and speed display.',
  },
  {
    icon: Link2,
    title: 'Instant share links',
    description: 'Every upload gets a clean, permanent public link.',
  },
  {
    icon: Palette,
    title: 'Light & dark mode',
    description: 'A polished UI that adapts to your system preference.',
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-16 sm:py-24 space-y-20">
        <section className="text-center space-y-6">
          <div className="inline-flex items-center rounded-full border border-[#fb5d80]/20 bg-[#fb5d80]/5 px-3 py-1 text-xs font-medium text-[#fb5d80]">
            No account required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Upload Videos Instantly
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground leading-relaxed">
            Share videos in seconds with a simple link.
            <br className="hidden sm:block" />
            No account required.
          </p>
        </section>

        <section aria-label="Upload video">
          <UploadCard />
        </section>

        <section aria-label="Features" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-5 flex items-start gap-4"
            >
              <div className="shrink-0 rounded-lg bg-[#fb5d80]/10 p-2.5">
                <Icon className="h-4 w-4 text-[#fb5d80]" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
