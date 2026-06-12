import { CACHE_TAGS } from '@/constants/revalidation'

export const getUserDataCacheHandler = (walletAddress: string) => {
  return `${CACHE_TAGS.USER_DATA}-${walletAddress.toLowerCase()}`
}

export const getVaultDaoManagedTag = (fleetAddress: string, network: string): string =>
  `${CACHE_TAGS.VAULT_DAO_MANAGED}-${fleetAddress.toLowerCase()}-${network.toLowerCase()}`

export const getVaultPerformanceTag = (chainName: string, asset: string): string =>
  `${CACHE_TAGS.VAULT_PERFORMANCE}-${chainName.toLowerCase()}-${asset.toLowerCase()}`

export const getVaultDetailsTag = (vaultAddress: string, network: string): string =>
  `${CACHE_TAGS.VAULT_LIST}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`

export const getPositionHistoryTag = (address: string): string =>
  `${CACHE_TAGS.POSITION_HISTORY}-${address.toLowerCase()}`

export const getBeachClubRecruitsTag = (referralCode: string): string =>
  `${CACHE_TAGS.BEACH_CLUB_RECRUITS}-${referralCode.toLowerCase()}`

export const getPositionsActivePeriodsTag = (walletAddress: string): string =>
  `${CACHE_TAGS.POSITIONS_ACTIVE_PERIODS}-${walletAddress.toLowerCase()}`

export const getSharePriceTag = (fleetAddress: string, chainId: number | string): string =>
  `share-price-${fleetAddress.toLowerCase()}-${chainId}`

export const getFleetFeesTag = (fleetAddress: string, chainId: number | string): string =>
  `${CACHE_TAGS.FLEET_FEES}-${fleetAddress.toLowerCase()}-${chainId}`

export const getMerkleRewardsTag = (walletAddress: string): string =>
  `claimable-merkle-rewards-${walletAddress.toLowerCase()}`
