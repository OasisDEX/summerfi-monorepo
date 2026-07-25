'use client'
import { type FC, type PropsWithChildren } from 'react'
import {
  analyticsCookieVersion,
  CookieBanner,
  Footer,
  type SavedAnalyticsCookiesSettings,
  useAnalyticsCookies,
} from '@summerfi/app-earn-ui'

import { NavigationWrapper } from '@/components/layout/Navigation/NavigationWrapper'
import { FloatingBanners } from '@/components/molecules/FloatingBanners/FloatingBanners'
import { type SavedLargeUserBannerSettings } from '@/components/molecules/LargeUserFloatingBanner/LargeUserFloatingBanner'
import { manageAnalyticsCookies } from '@/features/manage-analytics-cookies/manage-analytics-cookies'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'
import { useScrollTracker } from '@/hooks/use-scroll-tracker'

import masterPageStyles from './MasterPage.module.css'

interface MasterPageProps {
  skipNavigation?: boolean
  noNavMargin?: boolean
  analyticsCookie: SavedAnalyticsCookiesSettings | null
  largeUsersCookie: SavedLargeUserBannerSettings | null
  largeUsersData?: string[]
  sumrPriceUsd?: number
}

export const MasterPage: FC<PropsWithChildren<MasterPageProps>> = ({
  children,
  skipNavigation = false,
  analyticsCookie,
  largeUsersCookie,
  largeUsersData,
  sumrPriceUsd,
}) => {
  const [cookieSettings, setCookieSettings] = useAnalyticsCookies(analyticsCookie)
  const handleButtonClick = useHandleButtonClickEvent()

  useScrollTracker({})

  const onFooterItemClick = ({ buttonName }: { buttonName: string }) => {
    handleButtonClick(buttonName)
  }

  return (
    <div className={masterPageStyles.mainContainer}>
      {!skipNavigation && <NavigationWrapper sumrPriceUsd={sumrPriceUsd} />}
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
        <Footer logo="/earn/img/branding/logo-light.svg" onFooterItemClick={onFooterItemClick} />
      </div>
      <CookieBanner
        value={cookieSettings}
        setValue={setCookieSettings}
        manageCookie={manageAnalyticsCookies}
      />
      {/* Condition to show banner after cookie banner */}
      {cookieSettings?.version === analyticsCookieVersion && (
        <FloatingBanners largeUsersData={largeUsersData} largeUsersCookie={largeUsersCookie} />
      )}
    </div>
  )
}
