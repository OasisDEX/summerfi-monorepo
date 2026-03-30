'use client'

import { type PropsWithChildren, useLayoutEffect } from 'react'
import {
  BeachClubRadialGradient,
  Footer,
  GlobalIssueBanner,
  NewsletterWrapper,
  Text,
} from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { LandingPageBlobs } from '@/components/layout/LandingMasterPage/LandingPageBlobs'
import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import { usePageviewEvent } from '@/hooks/use-mixpanel-event'
import { useScrollTracker } from '@/hooks/use-scroll-tracker'

import landingMasterPageStyles from '@/components/layout/LandingMasterPage/landingMasterPage.module.css'

import palmLeft from '@/public/img/beach-club/palm_1.png'
import palmRight from '@/public/img/beach-club/palm_2.png'

interface LandingMasterPageProps {}

export const LandingMasterPage: React.FC<PropsWithChildren<LandingMasterPageProps>> = ({
  children,
}) => {
  const { landingPageData } = useLandingPageData()
  const pathname = usePathname()
  const pageViewedEventHandler = usePageviewEvent()

  useScrollTracker({})

  const isBeachClub = pathname.includes('beach-club')

  const showPalms = isBeachClub

  const onFooterItemClick = ({ buttonName }: { buttonName: string }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-footer-${buttonName}`,
      page: pathname,
    })
  }

  const handleNewsletterEvent = ({
    eventType,
    errorMessage,
  }: {
    eventType: 'subscribe-submit' | 'subscribe-failure'
    errorMessage?: string
  }) => {
    if (eventType === 'subscribe-failure') {
      EarnProtocolEvents.errorOccurred({
        errorId: 'lp-newsletter-subscribe-failure',
        errorMessage,
        page: pathname,
      })
    } else {
      EarnProtocolEvents.buttonClicked({
        buttonName: 'lp-newsletter-subscribe',
        page: pathname,
      })
    }
  }

  useLayoutEffect(() => {
    pageViewedEventHandler(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className={landingMasterPageStyles.mainContainer}>
      {landingPageData?.systemConfig.bannerMessage && (
        <GlobalIssueBanner message={landingPageData.systemConfig.bannerMessage} />
      )}
      <LandingPageBlobs />
      <div className={landingMasterPageStyles.appContainer}>
        <NavigationWrapper />
        {showPalms && (
          <div className={landingMasterPageStyles.palms}>
            <Image
              src={palmLeft}
              alt="palm_left"
              height="577"
              style={{
                position: 'absolute',
                left: '-100px',
                transition: 'opacity 0.3s ease-in-out',
                zIndex: -1,
              }}
              className={landingMasterPageStyles.palmHidden}
              priority
            />
            <BeachClubRadialGradient isBeachClub opacity={0.7} />
            <Image
              src={palmRight}
              alt="palm_right"
              height="422"
              style={{
                position: 'absolute',
                right: '0',
                top: '130px',
                transition: 'opacity 0.3s ease-in-out',
                zIndex: -1,
              }}
              priority
            />
          </div>
        )}
        {children}
        <Footer
          logo="/img/branding/logo-light.svg"
          onFooterItemClick={onFooterItemClick}
          newsletter={
            <div>
              <Text
                as="h3"
                variant="p1semi"
                style={{
                  marginBottom: 'var(--general-space-8)',
                }}
              >
                Stay up to date
              </Text>
              <Text
                as="p"
                variant="p2"
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-space-medium)',
                }}
              >
                Subscribe to the newsletter for Summer.fi updates
              </Text>
              <div
                style={{
                  maxWidth: '380px',
                }}
              >
                <NewsletterWrapper
                  inputBtnLabel="Subscribe"
                  handleNewsletterEvent={handleNewsletterEvent}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
