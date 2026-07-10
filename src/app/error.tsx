'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center space-y-5 max-w-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            {error.digest && (
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
          <Button onClick={reset}>Try again</Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
