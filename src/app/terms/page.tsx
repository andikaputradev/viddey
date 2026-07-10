import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${siteConfig.name}`,
  alternates: { canonical: `${siteConfig.url}/terms` },
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <Section title="1. Acceptance of Terms">
            By accessing or using VIDDEY, you agree to be bound by these Terms of Service. If you do not agree, do not use this service.
          </Section>

          <Section title="2. Service Description">
            VIDDEY is an anonymous video hosting platform that allows users to upload and share videos via public links. No account or registration is required.
          </Section>

          <Section title="3. Acceptable Use">
            <p>You agree not to upload content that:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-muted-foreground">
              <li>Violates any applicable law or regulation</li>
              <li>Infringes intellectual property rights of any third party</li>
              <li>Contains malware, spyware, or malicious code</li>
              <li>Is abusive, harassing, or promotes violence</li>
              <li>Constitutes spam or unsolicited bulk content</li>
              <li>Contains illegal or harmful material of any kind</li>
            </ul>
          </Section>

          <Section title="4. Content Removal">
            We reserve the right to remove any content at our sole discretion, without prior notice, if it violates these Terms or applicable laws. Users may delete their own uploads using the delete token provided at upload time.
          </Section>

          <Section title="5. Disclaimer of Warranties">
            VIDDEY is provided &ldquo;as is&rdquo; without any warranties of any kind, express or implied. We do not guarantee uptime, availability, or permanence of uploaded content.
          </Section>

          <Section title="6. Limitation of Liability">
            To the maximum extent permitted by law, VIDDEY and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
          </Section>

          <Section title="7. Changes to Terms">
            We may update these Terms at any time. Continued use of the service after changes constitutes acceptance of the revised Terms.
          </Section>

          <Section title="8. Contact">
            <p>
              For legal inquiries or content removal requests, contact us at{' '}
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
