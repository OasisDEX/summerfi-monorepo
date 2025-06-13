import { useState } from 'react'
import { FloatingBanner, Icon, INTERNAL_LINKS, Text } from '@summerfi/app-earn-ui'
import { getCookie, setCookie } from '@summerfi/app-utils'

import { PortfolioTabs } from '@/features/portfolio/types'
import { useUserWallet } from '@/hooks/use-user-wallet'

import styles from './BeachClubFloatingBanner.module.css'

const cookieName = 'beach-club-banner'

interface SavedBeachClubBannerSettings {
  isClosed: boolean
}

export const BeachClubFloatingBanner = () => {
  const [isClosed, setIsClosed] = useState(false)
  const cookie = getCookie(cookieName)

  const { userWalletAddress } = useUserWallet()

  const cookieSettings = cookie
    ? (JSON.parse(cookie) as SavedBeachClubBannerSettings)
    : {
        isClosed: false,
      }

  const setValue = (value: SavedBeachClubBannerSettings) => {
    setCookie(cookieName, JSON.stringify(value), 7, { secure: true })
  }

  const host = typeof window !== 'undefined' ? window.location.origin : ''

  const resolvedBeachClubLink = userWalletAddress
    ? `/portfolio/${userWalletAddress}?tab=${PortfolioTabs.BEACH_CLUB}`
    : `${host}${INTERNAL_LINKS.beachClub}`

  return cookieSettings.isClosed || isClosed ? null : (
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
        action: () => {
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
