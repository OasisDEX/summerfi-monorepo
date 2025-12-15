import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { INSTITUTIONS_CACHE_TAGS, INSTITUTIONS_CACHE_TIMES } from '@/constants/revalidation'
import { PanelAssetReallocation } from '@/features/panels/vaults/components/PanelAssetReallocation/PanelAssetReallocation'

export default async function InstitutionVaultAssetReallocationPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const cacheConfig = {
    revalidate: INSTITUTIONS_CACHE_TIMES.VAULT_DETAILS,
    tags: [
      INSTITUTIONS_CACHE_TAGS.VAULT_DETAILS,
      `vault-details-${institutionName}-${vaultAddress}`,
    ],
  }

  const [vault] = await Promise.all([
    unstableCache(
      getVaultDetails,
      [parsedNetwork],
      cacheConfig,
    )({
      institutionName,
      vaultAddress,
      network: parsedNetwork,
    }),
  ])

  if (!vault) {
    return <div>Vault not found</div>
  }

  return <PanelAssetReallocation vault={vault} />
}
