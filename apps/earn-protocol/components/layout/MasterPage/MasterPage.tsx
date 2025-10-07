'use client'
import { type FC, type PropsWithChildren } from 'react'
import {
  analyticsCookieVersion,
  CookieBanner,
  Footer,
  NewsletterWrapper,
  type SavedAnalyticsCookiesSettings,
  Text,
  useAnalyticsCookies,
} from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { type SavedBeachClubBannerSettings } from '@/components/molecules/BeachClubFloatingBanner/BeachClubFloatingBanner'
import { FloatingBanners } from '@/components/molecules/FloatingBanners/FloatingBanners'
import { type SavedLargeUserBannerSettings } from '@/components/molecules/LargeUserFloatingBanner/LargeUserFloatingBanner'
import { manageAnalyticsCookies } from '@/features/manage-analytics-cookies/manage-analytics-cookies'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'
import { useScrollTracker } from '@/hooks/use-scroll-tracker'

import './global.css'
import masterPageStyles from './MasterPage.module.css'

interface MasterPageProps {
  skipNavigation?: boolean
  noNavMargin?: boolean
  analyticsCookie: SavedAnalyticsCookiesSettings | null
  beachClubCookie: SavedBeachClubBannerSettings | null
  largeUsersCookie: SavedLargeUserBannerSettings | null
  largeUsersData?: string[]
}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({
  children,
  skipNavigation = false,
  analyticsCookie,
  beachClubCookie,
  largeUsersCookie,
  largeUsersData,
}) => {
  const [cookieSettings, setCookieSettings] = useAnalyticsCookies(analyticsCookie)
  const pathname = usePathname()
  const handleButtonClick = useHandleButtonClickEvent()

  useScrollTracker({})

  const onFooterItemClick = ({ buttonName }: { buttonName: string }) => {
    handleButtonClick(buttonName)
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
        errorId: 'ep-newsletter-subscribe-failure',
        errorMessage,
        page: pathname,
      })
    } else {
      handleButtonClick('ep-newsletter-subscribe')
    }
  }

  return (
    <div className={masterPageStyles.mainContainer}>
      {!skipNavigation && <NavigationWrapper />}
      <div className={masterPageStyles.appContainer}>{children}</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '32px',
          marginBottom: '32px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <Footer
          logo="/earn/img/branding/logo-light.svg"
          onFooterItemClick={onFooterItemClick}
          newsletter={
            <div>
              <Text
                as="h3"
                variant="p1semi"
                style={{
                  marginBottom: 'var(--general-space-16)',
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
                  isEarnApp
                  handleNewsletterEvent={handleNewsletterEvent}
                />
              </div>
            </div>
          }
        />
      </div>
      <CookieBanner
        value={cookieSettings}
        setValue={setCookieSettings}
        manageCookie={manageAnalyticsCookies}
      />
      {/* Condition to show banner after cookie banner */}
      {cookieSettings?.version === analyticsCookieVersion && (
        <FloatingBanners
          largeUsersData={largeUsersData}
          largeUsersCookie={largeUsersCookie}
          beachClubCookie={beachClubCookie}
        />
      )}
    </div>
  )
}
