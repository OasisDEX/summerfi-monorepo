'use client'
import { useLayoutEffect, useMemo, useState } from 'react'
import {
  FloatingBanner,
  type FloatingBannerActionType,
  Icon,
  INTERNAL_LINKS,
  Text,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { getCookie, setCookie } from '@summerfi/app-utils'

import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { PortfolioTabs } from '@/features/portfolio/types'
import { useDisplayBannerEvent, useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

import { beachClubCookieName } from './config'

import styles from './BeachClubFloatingBanner.module.css'

export interface SavedBeachClubBannerSettings {
  isClosed: boolean
}

export const BeachClubFloatingBanner = () => {
  const [isClosed, setIsClosed] = useState(false)
  const cookie = getCookie(beachClubCookieName)
  const handleButtonClick = useHandleButtonClickEvent()
  const handleDisplayBanner = useDisplayBannerEvent()
  const { userWalletAddress } = useUserWallet()
  const { features } = useSystemConfig()

  const beachClubEnabled = !!features?.BeachClub

  const cookieSettings = useMemo(() => {
    try {
      return cookie ? (JSON.parse(cookie) as SavedBeachClubBannerSettings) : { isClosed: false }
    } catch {
      return { isClosed: false }
    }
  }, [cookie])

  const setValue = (value: SavedBeachClubBannerSettings) => {
    setCookie(beachClubCookieName, JSON.stringify(value), 7, { secure: true })
  }

  const host = typeof window !== 'undefined' ? window.location.origin : ''

  const resolvedBeachClubLink = userWalletAddress
    ? `/portfolio/${userWalletAddress}?tab=${PortfolioTabs.BEACH_CLUB}`
    : `${host}${INTERNAL_LINKS.beachClub}`

  useLayoutEffect(() => {
    if (!cookieSettings.isClosed && !isClosed) {
      handleDisplayBanner({
        bannerName: 'beach-club-banner',
      })
    }
  }, [cookieSettings.isClosed, handleDisplayBanner, isClosed])

  return cookieSettings.isClosed || isClosed || !beachClubEnabled ? null : (
    <FloatingBanner
      icon={
        <div className={styles.iconMainWrapper}>
          <div className={styles.colorfulWrapper}>
            <Icon iconName="beach_club_icon" size={24} />
          </div>
        </div>
      }
      title={
        <Text as="p" variant="p3semi">
          Boost your $SUMR rewards with Beach Club!
        </Text>
      }
      description={
        <Text as="p" variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
          Share Lazy Summer and earn more while you relax. Soon it will be Summer. Time to chill,
          not chase yields.
        </Text>
      }
      closeButton={{
        action: (type: FloatingBannerActionType) => {
          handleButtonClick(`beach-club-banner-${type}`)
          setValue({ isClosed: true })
          setIsClosed(true)
        },
      }}
      button={{
        label: 'Go to Beach Club',
        link: resolvedBeachClubLink,
        variant: 'beachClubMedium',
      }}
    />
  )
}
