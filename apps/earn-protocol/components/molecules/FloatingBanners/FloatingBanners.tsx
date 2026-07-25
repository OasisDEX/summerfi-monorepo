'use client'

import { useEarnProtocolWallet } from '@summerfi/app-earn-ui'

import {
  LargeUserFloatingBanner,
  type SavedLargeUserBannerSettings,
} from '@/components/molecules/LargeUserFloatingBanner/LargeUserFloatingBanner'

interface FloatingBannersProps {
  largeUsersData?: string[]
  largeUsersCookie: SavedLargeUserBannerSettings | null
}

export const FloatingBanners = ({ largeUsersData }: FloatingBannersProps) => {
  const { address: userWalletAddress } = useEarnProtocolWallet()

  const isLargeUser = largeUsersData?.includes(userWalletAddress?.toLowerCase() ?? '')

  return isLargeUser ? <LargeUserFloatingBanner largeUsersData={largeUsersData} /> : null
}
