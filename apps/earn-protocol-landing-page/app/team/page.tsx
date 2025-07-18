'use client'
import { Emphasis, Text } from '@summerfi/app-earn-ui'
import { redirect } from 'next/navigation'

import { useLandingPageData } from '@/contexts/LandingPageContext'

import teamPageStyles from './teamPage.module.css'

export default function TeamPage() {
  const { landingPageData } = useLandingPageData()

  if (landingPageData && !landingPageData.systemConfig.features.Team) {
    redirect('/')
  }

  return (
    <div className={teamPageStyles.wrapper}>
      <div className={teamPageStyles.pageHeader}>
        <Text as="h1" variant="h1">
          Making the best of DeFi
          <br />
          <Emphasis variant="h1colorful">simple and safe </Emphasis>
        </Text>
        <div className={teamPageStyles.pageHeaderDetails}>
          <Text as="p" variant="p1">
            Summer.fi is the best place to borrow and earn in DeFi
          </Text>
        </div>
      </div>
    </div>
  )
}
