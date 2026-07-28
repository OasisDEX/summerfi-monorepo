'use client'
import { Button, Emphasis, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.css'

export const LandingPageHero = () => {
  return (
    <div className={landingPageHeroStyles.landingPageHeroWrapper}>
      <div className={landingPageHeroStyles.heroHeader}>
        <div className={landingPageHeroStyles.heroTextGroup}>
          <Text variant="h1" as="h1" className={landingPageHeroStyles.heroTitle}>
            <Emphasis variant="h1colorful">Summer.fi</Emphasis> will soon be shutdown
          </Text>
          <Text variant="p1" className={landingPageHeroStyles.heroSubtitle}>
            And the Lazy Summer Protocol is currently in withdraw only mode. Use Summer.fi until
            August 31st to exit all your positions and claim any outstanding rewards.
          </Text>
        </div>
        <div className={landingPageHeroStyles.heroButtons}>
          <Link href="/earn" prefetch={false} className={landingPageHeroStyles.primaryCta}>
            <Button variant="primarySmall">Launch&nbsp;App</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
