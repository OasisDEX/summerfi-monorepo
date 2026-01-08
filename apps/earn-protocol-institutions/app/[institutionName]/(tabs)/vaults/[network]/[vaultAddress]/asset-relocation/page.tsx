import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getCachedVaultDetails } from '@/app/server-handlers/institution/institution-vaults'
import { PanelAssetReallocation } from '@/features/panels/vaults/components/PanelAssetReallocation/PanelAssetReallocation'

export default async function InstitutionVaultAssetReallocationPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  const [vault] = await Promise.all([
    getCachedVaultDetails({
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
