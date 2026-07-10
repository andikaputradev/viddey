import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { VideoPlayer } from '@/components/video/video-player'
import { VideoInfo } from '@/components/video/video-info'
import { VideoActions } from '@/components/video/video-actions'
import { getVideoPublicBySlug } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const video = await getVideoPublicBySlug(slug)

  if (!video) {
    return {
      title: 'Video not found',
      description: 'This video does not exist or has been deleted.',
    }
  }

  const streamUrl = `${siteConfig.url}/api/stream/${slug}`
  const pageUrl = `${siteConfig.url}/v/${slug}`

  return {
    title: video.title,
    description: `Watch "${video.title}" on VIDDEY — ${siteConfig.tagline}`,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'video.other',
      title: video.title,
      description: `Watch "${video.title}" on VIDDEY`,
      url: pageUrl,
      videos: [{ url: streamUrl, type: video.mime_type }],
    },
    twitter: {
      card: 'player',
      title: video.title,
      description: `Watch "${video.title}" on VIDDEY`,
      players: [{ playerUrl: pageUrl, streamUrl, width: 1280, height: 720 }],
    },
  }
}

export default async function VideoPage({ params }: PageProps) {
  const { slug } = await params
  const video = await getVideoPublicBySlug(slug)

  if (!video) notFound()

  const streamUrl = `${siteConfig.url}/api/stream/${slug}`

  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 space-y-5">
        <VideoPlayer
          src={`/api/stream/${slug}`}
          title={video.title}
          mimeType={video.mime_type}
        />
        <VideoInfo video={video} />
        <VideoActions slug={slug} streamUrl={streamUrl} title={video.title} />
      </main>
      <Footer />
    </>
  )
}
