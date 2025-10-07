'use client'

import { useUserWallet } from '@summerfi/app-earn-ui'

import {
  BeachClubFloatingBanner,
  type SavedBeachClubBannerSettings,
} from '@/components/molecules/BeachClubFloatingBanner/BeachClubFloatingBanner'
import {
  LargeUserFloatingBanner,
  type SavedLargeUserBannerSettings,
} from '@/components/molecules/LargeUserFloatingBanner/LargeUserFloatingBanner'

interface FloatingBannersProps {
  largeUsersData?: string[]
  largeUsersCookie: SavedLargeUserBannerSettings | null
  beachClubCookie: SavedBeachClubBannerSettings | null
}

export const FloatingBanners = ({
  largeUsersData,
  largeUsersCookie,
  beachClubCookie,
}: FloatingBannersProps) => {
  const { userWalletAddress } = useUserWallet()

  const isLargeUser = largeUsersData?.includes(userWalletAddress?.toLowerCase() ?? '')

  return isLargeUser ? (
    <>
      <LargeUserFloatingBanner largeUsersData={largeUsersData} />
      {largeUsersCookie?.isClosed && <BeachClubFloatingBanner />}
    </>
  ) : (
    <> {beachClubCookie?.isClosed && <BeachClubFloatingBanner />}</>
  )
}
