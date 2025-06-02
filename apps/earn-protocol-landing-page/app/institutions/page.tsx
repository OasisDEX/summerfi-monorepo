'use client'
import { Button, Emphasis, Text, WithArrow } from '@summerfi/app-earn-ui'
import { redirect } from 'next/navigation'

import { useLandingPageData } from '@/contexts/LandingPageContext'

import institutionsPageStyles from './institutionsPage.module.css'

export default function InstitutionsPage() {
  const { landingPageData } = useLandingPageData()

  const institutionsEnabled = landingPageData?.systemConfig.features.BeachClub

  if (institutionsEnabled === false) {
    redirect('/')
  }

  return (
    <div className={institutionsPageStyles.wrapper}>
      <div className={institutionsPageStyles.pageHeader}>
        <Text as="h1" variant="h1">
          Crypto native yield, built for
          <br />
          <Emphasis variant="h1colorful">forward thinking institutions</Emphasis>
        </Text>
        <div className={institutionsPageStyles.pageHeaderDetails}>
          <Text as="p" variant="p1semi">
            Institutional access to the DeFi ecosystem for advanced use cases and full control.
          </Text>
          <Text as="span" variant="p1">
            Lazy Summer Protocol gives professional allocators a single entry point to on-chain
            yield. Institutions can now access DeFi’s highest quality protocols, all in one.
          </Text>
          <Button variant="primaryLargeColorful">
            <WithArrow variant="p2semi">Get started</WithArrow>
          </Button>
        </div>
      </div>
      <div className={institutionsPageStyles.pageSubHeader}>
        <Text as="h2" variant="h2">
          DeFi’s Highest-Quality Strategies&nbsp;
          <Emphasis variant="h2colorful">-&nbsp;on your terms.</Emphasis>
        </Text>
        <Text as="p" variant="p1">
          Effortless access to crypto’s best DeFi protocols, via closed access, fully customizable
          vaults or public access optimized for scale and best in class risk adjusted return.
        </Text>
      </div>
    </div>
  )
}
