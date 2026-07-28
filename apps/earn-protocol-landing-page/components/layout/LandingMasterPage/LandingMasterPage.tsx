'use client'

import { type PropsWithChildren } from 'react'
import { Footer, GlobalIssueBanner } from '@summerfi/app-earn-ui'

import { LandingPageBlobs } from '@/components/layout/LandingMasterPage/LandingPageBlobs'
import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { useLandingPageData } from '@/contexts/LandingPageContext'

import landingMasterPageStyles from '@/components/layout/LandingMasterPage/landingMasterPage.module.css'

interface LandingMasterPageProps {}

export const LandingMasterPage: React.FC<PropsWithChildren<LandingMasterPageProps>> = ({
  children,
}) => {
  const { landingPageData } = useLandingPageData()

  return (
    <div className={landingMasterPageStyles.mainContainer}>
      {landingPageData?.systemConfig.bannerMessage && (
        <GlobalIssueBanner
          message={landingPageData.systemConfig.bannerMessage}
          readMoreUrl={landingPageData.systemConfig.bannerMessageUrl}
        />
      )}
      <LandingPageBlobs />
      <div className={landingMasterPageStyles.appContainer}>
        <NavigationWrapper />
        {children}
        <Footer logo="/img/branding/logo-light.svg" />
      </div>
    </div>
  )
}
