import Link from 'next/link'
import { VideoOff } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function VideoNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center space-y-5 max-w-sm">
          <div className="mx-auto w-fit rounded-full bg-muted p-4">
            <VideoOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Video not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This video does not exist or has been deleted.
            </p>
          </div>
          <Button asChild>
            <Link href="/">Upload a new video</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
