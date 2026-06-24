import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getCachedVaultDetails } from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelAssetReallocation } from '@/features/panels/vaults/components/PanelAssetReallocation/PanelAssetReallocation'

export default async function InstitutionVaultAssetReallocationPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  const vault = await getCachedVaultDetails({
    institutionName,
    vaultAddress,
    network: parsedNetwork,
  })

  if (!vault) {
    return <div>Vault not found</div>
  }

  return (
    <ClientSideSdkWrapper>
      <PanelAssetReallocation vault={vault} institutionName={institutionName} network={network} />
    </ClientSideSdkWrapper>
  )
}
