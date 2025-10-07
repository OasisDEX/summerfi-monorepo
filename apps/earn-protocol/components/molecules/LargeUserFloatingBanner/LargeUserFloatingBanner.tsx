'use client'

import { type FC, useLayoutEffect, useMemo, useState } from 'react'
import {
  FloatingBanner,
  type FloatingBannerActionType,
  Text,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { getCookie, setCookie } from '@summerfi/app-utils'
import Image from 'next/image'

import { useDisplayBannerEvent, useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'
import summerLogo from '@/public/img/branding/dot-dark.svg'

import { largeUsersCookieName } from './config'

import styles from './LargeUserFloatingBanner.module.css'

export interface SavedLargeUserBannerSettings {
  isClosed: boolean
}

interface LargeUserFloatingBannerProps {
  largeUsersData?: string[]
}

export const LargeUserFloatingBanner: FC<LargeUserFloatingBannerProps> = ({ largeUsersData }) => {
  const [isClosed, setIsClosed] = useState(false)
  const cookie = getCookie(largeUsersCookieName)
  const { userWalletAddress } = useUserWallet()

  const handleButtonClick = useHandleButtonClickEvent()
  const handleDisplayBanner = useDisplayBannerEvent()

  const cookieSettings = useMemo(() => {
    try {
      return cookie ? (JSON.parse(cookie) as SavedLargeUserBannerSettings) : { isClosed: false }
    } catch {
      return { isClosed: false }
    }
  }, [cookie])

  const setValue = (value: SavedLargeUserBannerSettings) => {
    setCookie(largeUsersCookieName, JSON.stringify(value), 7, { secure: true })
  }

  const isLargerUser = largeUsersData?.includes(userWalletAddress?.toLowerCase() ?? '')

  useLayoutEffect(() => {
    if (!cookieSettings.isClosed && isLargerUser) {
      handleDisplayBanner({
        bannerName: 'large-user-banner',
      })
    }
  }, [cookieSettings.isClosed, handleDisplayBanner, isLargerUser])

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
        action: (type: FloatingBannerActionType) => {
          handleButtonClick(`large-user-banner-${type}`)
          setValue({ isClosed: true })
          setIsClosed(true)
        },
      }}
      button={{
        label: 'Get in touch',
        link: 'https://form.typeform.com/to/N5U0v7Qc',
        variant: 'primaryMedium',
        className: styles.gradientButton,
        target: '_blank',
        rel: 'noopener noreferrer',
      }}
    />
  )
}
