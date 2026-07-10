import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function HomeLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-16 sm:py-24 space-y-20">
        <section className="text-center space-y-4">
          <div className="mx-auto h-6 w-36 rounded-full bg-muted animate-pulse" />
          <div className="mx-auto h-12 w-96 max-w-full rounded-xl bg-muted animate-pulse" />
          <div className="mx-auto h-5 w-80 max-w-full rounded-lg bg-muted animate-pulse" />
        </section>
        <div className="mx-auto max-w-xl">
          <div className="h-56 rounded-xl border border-border bg-muted animate-pulse" />
        </div>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
              <div className="shrink-0 h-9 w-9 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded-md bg-muted animate-pulse" />
                <div className="h-3 w-48 rounded-md bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
