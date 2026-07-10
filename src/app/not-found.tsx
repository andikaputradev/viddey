import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center space-y-5">
          <p className="text-8xl font-bold text-[#fb5d80] select-none">404</p>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Page not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The page you are looking for does not exist.
            </p>
          </div>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
