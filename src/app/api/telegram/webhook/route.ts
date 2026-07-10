import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-telegram-bot-api-secret-token')
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET

  if (!expected || secret !== expected) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  let update: unknown
  try {
    update = await request.json()
  } catch {
    return new NextResponse('Bad Request', { status: 400 })
  }

  console.info('[telegram/webhook] received update:', JSON.stringify(update))

  return NextResponse.json({ ok: true })
}
