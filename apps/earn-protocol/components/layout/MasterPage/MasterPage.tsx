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
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import {
  BeachClubFloatingBanner,
  type SavedBeachClubBannerSettings,
} from '@/components/molecules/BeachClubFloatingBanner/BeachClubFloatingBanner'
import { LargeUserFloatingBanner } from '@/components/molecules/LargeUserFloatingBanner/LargeUserFloatingBanner'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
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
  largeUsersData?: string[]
}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({
  children,
  skipNavigation = false,
  analyticsCookie,
  beachClubCookie,
  largeUsersData,
}) => {
  const [cookieSettings, setCookieSettings] = useAnalyticsCookies(analyticsCookie)
  const { features } = useSystemConfig()
  const pathname = usePathname()
  const isSuperLazyVaults = pathname.startsWith('/super')
  const handleButtonClick = useHandleButtonClickEvent()

  useScrollTracker({})

  const beachClubEnabled = !!features?.BeachClub
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
      EarnProtocolEvents.buttonClicked({
        buttonName: 'ep-newsletter-subscribe',
        page: pathname,
      })
    }
  }

  return (
    <div
      className={clsx(masterPageStyles.mainContainer, {
        'super-lazy': isSuperLazyVaults,
      })}
    >
      {!skipNavigation && <NavigationWrapper />}
      {isSuperLazyVaults && (
        <div
          style={{
            position: 'relative',
            top: '-50px',
            width: '100vw',
            backgroundColor: '#FAF5DE',
            height: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            variant="h1"
            style={{
              color: '#F3D283',
              textShadow:
                '#2D2D2D 2px 0px 0px, #2D2D2D 1.75517px 0.958851px 0px, #2D2D2D 1.0806px 1.68294px 0px, #2D2D2D 0.141474px 1.99499px 0px, #2D2D2D -0.832294px 1.81859px 0px, #2D2D2D -1.60229px 1.19694px 0px, #2D2D2D -1.97998px 0.28224px 0px, #2D2D2D -1.87291px -0.701566px 0px, #2D2D2D -1.30729px -1.5136px 0px, #2D2D2D -0.421592px -1.95506px 0px, #2D2D2D 0.567324px -1.91785px 0px, #2D2D2D 1.41734px -1.41108px 0px, #2D2D2D 1.92034px -0.558831px 0px',
            }}
          >
            SuperLazy Vaults
          </Text>
        </div>
      )}
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
      {beachClubEnabled && cookieSettings?.version === analyticsCookieVersion && (
        <>
          <BeachClubFloatingBanner />
          {beachClubCookie?.isClosed && <LargeUserFloatingBanner largeUsersData={largeUsersData} />}
        </>
      )}
    </div>
  )
}
