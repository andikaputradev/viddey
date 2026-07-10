import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indeterminate?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indeterminate = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-border', className)}
    {...props}
  >
    {indeterminate ? (
      <div
        className="absolute inset-y-0 w-1/3 rounded-full bg-[#fb5d80]"
        style={{ animation: 'indeterminate-slide 1.4s ease-in-out infinite' }}
        aria-hidden
      />
    ) : (
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-[#fb5d80] transition-all duration-300 ease-out"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    )}
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
