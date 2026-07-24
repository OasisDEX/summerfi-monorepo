'use client'

import { LandingPageHero } from '@/components/layout/LandingPageContent'

export default function HomePage() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 24px',
        margin: '0 auto',
        maxWidth: '1440px',
      }}
    >
      <LandingPageHero />
    </div>
  )
}
