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

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { BeachClubFloatingBanner } from '@/components/molecules/BeachClubFloatingBanner/BeachClubFloatingBanner'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { manageAnalyticsCookies } from '@/features/manage-analytics-cookies/manage-analytics-cookies'

import './global.css'
import masterPageStyles from './MasterPage.module.css'

interface MasterPageProps {
  skipNavigation?: boolean
  noNavMargin?: boolean
  analyticsCookie: SavedAnalyticsCookiesSettings | null
}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({
  children,
  skipNavigation = false,
  analyticsCookie,
}) => {
  const [cookieSettings, setCookieSettings] = useAnalyticsCookies(analyticsCookie)
  const { features } = useSystemConfig()

  const beachClubEnabled = !!features?.BeachClub

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
                <NewsletterWrapper inputBtnLabel="Subscribe" isEarnApp />
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
        <BeachClubFloatingBanner />
      )}
    </div>
  )
}
