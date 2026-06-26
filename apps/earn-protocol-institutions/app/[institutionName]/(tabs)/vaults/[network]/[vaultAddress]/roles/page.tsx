import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import { getCachedVaultDetails } from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRwaRoles } from '@/features/panels/vaults/components/PanelRwaRoles/PanelRwaRoles'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultRolesPage({
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

  // RWA-only tab: bounce a standard vault to its overview (standard vaults use the Role admin tab).
  if (!rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview`)
  }

  // Ark addresses are candidate targets for reversing raw Commander-role hashes in the grants table.
  const vault = await getCachedVaultDetails({
    institutionName,
    vaultAddress: vaultAddress.toLowerCase(),
    network: humanNetworktoSDKNetwork(network),
  })
  const arks = vault?.arks.map((ark) => ark.id) ?? []

  return (
    <ClientSideSdkWrapper>
      <PanelRwaRoles
        institutionName={institutionName}
        clientId={rwaClientId}
        vaultAddress={vaultAddress}
        network={network}
        arks={arks}
      />
    </ClientSideSdkWrapper>
  )
}
