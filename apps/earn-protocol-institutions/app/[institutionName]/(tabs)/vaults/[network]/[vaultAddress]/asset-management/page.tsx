import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import { getCachedVaultDetails } from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelAssetManagement } from '@/features/panels/vaults/components/PanelAssetManagement/PanelAssetManagement'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultAssetManagementPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  // Standard fleet-management tab — not applicable to RWA (rounds-based) vaults, whose deposit/
  // withdraw flow through rounds vaults, not the v1 FleetCommander this panel drives. Bounce RWA
  // vaults to their overview so this never renders an invalid deposit/withdraw UI against them.
  const config = await getCachedConfig()
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: urlNetworkToChainId(network),
    vaultAddress,
  })

  if (rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview`)
  }

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

  return (
    <ClientSideSdkWrapper>
      <PanelAssetManagement vault={vault} institutionName={institutionName} />
    </ClientSideSdkWrapper>
  )
}
