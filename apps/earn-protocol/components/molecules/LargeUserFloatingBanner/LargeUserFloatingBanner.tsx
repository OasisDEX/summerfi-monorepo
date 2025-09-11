'use client'

import { type FC, useMemo, useState } from 'react'
import { FloatingBanner, Text, useUserWallet } from '@summerfi/app-earn-ui'
import { getCookie, setCookie } from '@summerfi/app-utils'
import Image from 'next/image'

import summerLogo from '@/public/img/branding/dot-dark.svg'

import styles from './LargeUserFloatingBanner.module.css'

const cookieName = 'large-user-banner'

interface SavedLargeUserBannerSettings {
  isClosed: boolean
}

interface LargeUserFloatingBannerProps {
  largeUsersData?: string[]
}

export const LargeUserFloatingBanner: FC<LargeUserFloatingBannerProps> = ({ largeUsersData }) => {
  const [isClosed, setIsClosed] = useState(false)
  const cookie = getCookie(cookieName)

  const { userWalletAddress } = useUserWallet()

  const cookieSettings = useMemo(() => {
    try {
      return cookie ? (JSON.parse(cookie) as SavedLargeUserBannerSettings) : { isClosed: false }
    } catch {
      return { isClosed: false }
    }
  }, [cookie])

  const setValue = (value: SavedLargeUserBannerSettings) => {
    setCookie(cookieName, JSON.stringify(value), 7, { secure: true })
  }

  const isLargerUser = largeUsersData?.includes(userWalletAddress?.toLowerCase() ?? '')

  return cookieSettings.isClosed || isClosed || !isLargerUser ? null : (
    <FloatingBanner
      icon={
        <div className={styles.iconMainWrapper}>
          <div className={styles.colorfulWrapper}>
            <Image src={summerLogo} alt="Summer" width={16} height={16} />
          </div>
        </div>
      }
      title={
        <Text as="p" variant="p3semi">
          You’re one of Lazy Summer’s top users.
        </Text>
      }
      description={
        <Text as="p" variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
          You have significant assets outside of Lazy Summer. Learn how to save time, earn extra
          rewards and get the best yields with Lazy Summer.
        </Text>
      }
      closeButton={{
        action: () => {
          setValue({ isClosed: true })
          setIsClosed(true)
        },
      }}
      button={{
        label: 'Book a call',
        link: 'https://calendly.com/oasis-app/lazy-summer-protocol-launch-collaboration',
        variant: 'primaryMedium',
        className: styles.gradientButton,
        target: '_blank',
        rel: 'noopener noreferrer',
      }}
    />
  )
}
