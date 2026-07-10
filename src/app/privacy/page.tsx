import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name}`,
  alternates: { canonical: `${siteConfig.url}/privacy` },
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <Section title="1. No Account Data">
            VIDDEY does not require registration or user accounts. We do not collect personal information such as names, email addresses, or passwords.
          </Section>

          <Section title="2. Data We Store">
            <p>When you upload a video, we store the following metadata in our database:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-muted-foreground">
              <li>A randomly generated unique identifier (slug)</li>
              <li>The filename you provided (sanitized)</li>
              <li>File size and MIME type</li>
              <li>Upload timestamp</li>
              <li>View count</li>
              <li>A cryptographically generated delete token (provided only to you at upload time)</li>
            </ul>
            <p className="mt-3">We do not store your IP address in association with your uploads.</p>
          </Section>

          <Section title="3. Video Storage">
            Uploaded videos are stored on Telegram&apos;s infrastructure via the Telegram Bot API. By uploading, you acknowledge that your video is transmitted to Telegram&apos;s servers. Please refer to{' '}
            <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className="text-[#fb5d80] hover:underline">
              Telegram&apos;s Privacy Policy
            </a>{' '}
            for information on how Telegram handles stored files.
          </Section>

          <Section title="4. Cookies and Tracking">
            VIDDEY does not use cookies for tracking or analytics. We do not use third-party advertising or tracking scripts. Your delete tokens are stored locally in your browser&apos;s localStorage for your convenience and never transmitted to our servers beyond the initial upload response.
          </Section>

          <Section title="5. Server Logs">
            Our servers may temporarily retain standard access logs (IP address, request path, timestamp) for security and abuse prevention purposes. These logs are not retained beyond 30 days and are not used for profiling or marketing.
          </Section>

          <Section title="6. Rate Limiting">
            We implement IP-based rate limiting to prevent abuse. IP addresses are temporarily tracked for this purpose only and are not stored persistently.
          </Section>

          <Section title="7. Content Reports">
            When you submit a content report, we store the report reason and the associated video identifier. No personal information from reporters is retained.
          </Section>

          <Section title="8. Data Deletion">
            You can delete your uploaded video at any time using the delete token provided at upload time. Upon deletion, all associated metadata is permanently removed from our database.
          </Section>

          <Section title="9. Changes to This Policy">
            We may update this Privacy Policy periodically. Continued use of VIDDEY after changes constitutes acceptance of the updated policy.
          </Section>

          <Section title="10. Contact">
            <p>
              For privacy-related inquiries, contact us at{' '}
              <a href={siteConfig.links.contact} className="text-[#fb5d80] hover:underline">
                {siteConfig.links.contact.replace('mailto:', '')}
              </a>.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}
