'use client'

import { useState } from 'react'
import { Flag, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { REPORT_REASONS, type ReportReason } from '@/types/video'

interface ReportDialogProps {
  slug: string
  children: React.ReactNode
}

type DialogStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ReportDialog({ slug, children }: ReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason | ''>('')
  const [status, setStatus] = useState<DialogStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const reset = () => {
    setReason('')
    setStatus('idle')
    setErrorMsg('')
  }

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) setTimeout(reset, 300)
  }

  const handleSubmit = async () => {
    if (!reason) return
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, reason }),
      })
      const body = await res.json() as { success: boolean; error?: string }
      if (!body.success) throw new Error(body.error ?? 'Report failed.')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed.')
      setStatus('error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-[#fb5d80]" />
            Report video
          </DialogTitle>
          <DialogDescription>
            Select a reason for reporting this video. We review all reports.
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-sm font-medium text-foreground">Report submitted</p>
            <p className="text-xs text-muted-foreground">Thank you for helping keep VIDDEY safe.</p>
          </div>
        ) : (
          <>
            <Select
              value={reason}
              onValueChange={(v) => setReason(v as ReportReason)}
              disabled={status === 'submitting'}
            >
              <SelectTrigger aria-label="Select report reason">
                <SelectValue placeholder="Select a reason…" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {status === 'error' && (
              <p className="text-xs text-red-500" role="alert">{errorMsg}</p>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
                disabled={status === 'submitting'}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!reason || status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit report'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
