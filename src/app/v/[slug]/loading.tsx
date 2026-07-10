import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function VideoLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 space-y-5">
        <div className="w-full aspect-video rounded-xl bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-2/3 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-1/3 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
        </div>
      </main>
      <Footer />
    </>
  )
}
