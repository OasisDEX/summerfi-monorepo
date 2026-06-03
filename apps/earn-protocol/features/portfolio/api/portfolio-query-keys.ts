import { type SupportedSDKNetworks } from '@summerfi/app-types'

import { CACHE_TAGS } from '@/constants/revalidation'

// Kept in a non-client module so the server-side prefetch (page.tsx) and the client hooks can
// share the exact same query keys. The core key leads with PORTFOLIO_DATA and the per-position
// history key with POSITION_HISTORY so the existing tag-based refresh helpers can target them; a
// discriminator separates the two units.
const PORTFOLIO_CORE = 'portfolio-core'
const PORTFOLIO_POSITION_HISTORY = 'portfolio-position-history'

export const getPortfolioCoreQueryKey = (walletAddress: string) =>
  [CACHE_TAGS.PORTFOLIO_DATA, PORTFOLIO_CORE, walletAddress.toLowerCase()] as const

export const getPortfolioPositionHistoryQueryKey = (
  walletAddress: string,
  network: SupportedSDKNetworks,
  vaultId: string,
) =>
  [
    CACHE_TAGS.POSITION_HISTORY,
    PORTFOLIO_POSITION_HISTORY,
    walletAddress.toLowerCase(),
    network,
    vaultId.toLowerCase(),
  ] as const
