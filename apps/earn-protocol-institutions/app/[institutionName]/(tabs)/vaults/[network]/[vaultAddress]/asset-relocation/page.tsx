import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { PanelAssetRelocation } from '@/features/panels/vaults/components/PanelAssetRelocation/PanelAssetRelocation'

export default async function InstitutionVaultAssetRelocationPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  // tags yet to be determined
  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
    tags: [REVALIDATION_TAGS.PORTFOLIO_DATA, parsedNetwork],
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

  return <PanelAssetRelocation vault={vault} />
}
