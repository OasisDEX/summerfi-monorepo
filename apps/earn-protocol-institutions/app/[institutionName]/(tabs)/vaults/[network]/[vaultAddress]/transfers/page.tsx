import { type NetworkNames } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRwaTransfers } from '@/features/panels/vaults/components/PanelRwaTransfers/PanelRwaTransfers'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultTransfersPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const config = await getCachedConfig()
  const chainId = urlNetworkToChainId(network)
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: chainId,
    vaultAddress,
  })

  // RWA-only tab: bounce a standard vault to its overview.
  if (!rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview/institution`)
  }

  return (
    <ClientSideSdkWrapper>
      <PanelRwaTransfers
        institutionName={institutionName}
        clientId={rwaClientId}
        vaultAddress={vaultAddress}
        network={network}
      />
    </ClientSideSdkWrapper>
  )
}
