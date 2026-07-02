import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import { getCachedVaultDetails } from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelAssetReallocation } from '@/features/panels/vaults/components/PanelAssetReallocation/PanelAssetReallocation'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultAssetReallocationPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  // Standard fleet-management tab — not applicable to RWA (rounds-based) vaults (no multi-ark
  // allocation). Bounce an RWA vault (resolved from config by address) to its overview.
  const config = await getCachedConfig()
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: urlNetworkToChainId(network),
    vaultAddress,
  })

  if (rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview`)
  }

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
