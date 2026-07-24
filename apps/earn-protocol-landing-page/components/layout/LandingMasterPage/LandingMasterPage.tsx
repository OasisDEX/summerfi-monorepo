'use client'

import { type PropsWithChildren, useEffect } from 'react'
import { Footer, GlobalIssueBanner } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

import { LandingPageBlobs } from '@/components/layout/LandingMasterPage/LandingPageBlobs'
import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import { usePageviewEvent } from '@/hooks/use-mixpanel-event'
import { useScrollTracker } from '@/hooks/use-scroll-tracker'

import landingMasterPageStyles from '@/components/layout/LandingMasterPage/landingMasterPage.module.css'

interface LandingMasterPageProps {}

export const LandingMasterPage: React.FC<PropsWithChildren<LandingMasterPageProps>> = ({
  children,
}) => {
  const { landingPageData } = useLandingPageData()
  const pathname = usePathname()
  const pageViewedEventHandler = usePageviewEvent()

  useScrollTracker({})

  const onFooterItemClick = ({ buttonName }: { buttonName: string }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-footer-${buttonName}`,
      page: pathname,
    })
  }

  useEffect(() => {
    pageViewedEventHandler(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

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
        <Footer logo="/img/branding/logo-light.svg" onFooterItemClick={onFooterItemClick} />
      </div>
    </div>
  )
}
