'use client'

import { useUserWallet } from '@summerfi/app-earn-ui'

import { BeachClubFloatingBanner } from '@/components/molecules/BeachClubFloatingBanner/BeachClubFloatingBanner'
import {
  LargeUserFloatingBanner,
  type SavedLargeUserBannerSettings,
} from '@/components/molecules/LargeUserFloatingBanner/LargeUserFloatingBanner'

interface FloatingBannersProps {
  largeUsersData?: string[]
  largeUsersCookie: SavedLargeUserBannerSettings | null
}

export const FloatingBanners = ({ largeUsersData, largeUsersCookie }: FloatingBannersProps) => {
  const { userWalletAddress } = useUserWallet()

  const isLargeUser = largeUsersData?.includes(userWalletAddress?.toLowerCase() ?? '')

  return isLargeUser ? (
    <>
      <LargeUserFloatingBanner largeUsersData={largeUsersData} />
      {largeUsersCookie?.isClosed && <BeachClubFloatingBanner />}
    </>
  ) : (
    <BeachClubFloatingBanner />
  )
}
