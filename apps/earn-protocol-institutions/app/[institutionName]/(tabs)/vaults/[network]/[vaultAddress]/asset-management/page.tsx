import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getCachedVaultDetails } from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelAssetManagement } from '@/features/panels/vaults/components/PanelAssetManagement/PanelAssetManagement'

export default async function InstitutionVaultAssetManagementPage({
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

  return (
    <ClientSideSdkWrapper>
      <PanelAssetManagement vault={vault} institutionName={institutionName} />
    </ClientSideSdkWrapper>
  )
}
