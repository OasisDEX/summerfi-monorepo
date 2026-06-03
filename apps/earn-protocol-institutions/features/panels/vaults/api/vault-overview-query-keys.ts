import { INSTITUTIONS_CACHE_TAGS } from '@/constants/revalidation'

// Non-client module so a server prefetch and the client hook can share the exact same key.
const VAULT_OVERVIEW_CHARTS = 'charts'

export const getVaultOverviewChartsQueryKey = (
  institutionName: string,
  network: string,
  vaultAddress: string,
) =>
  [
    INSTITUTIONS_CACHE_TAGS.VAULT_OVERVIEW_CHARTS,
    VAULT_OVERVIEW_CHARTS,
    institutionName.toLowerCase(),
    network,
    vaultAddress.toLowerCase(),
  ] as const
