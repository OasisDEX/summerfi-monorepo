import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import { getCachedVaultSpecificRoles } from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRoleAdmin } from '@/features/panels/vaults/components/PanelRoleAdmin/PanelRoleAdmin'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultRoleAdminPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  // Standard fleet-management tab — not applicable to RWA (rounds-based) vaults, which use a separate
  // access manager. Bounce an RWA vault (resolved from config by address) to its overview so it never
  // reaches the v1 role SDK path. (Also replaces the old `networkNameToSDKId` check that threw on the
  // `mainnet` slug.)
  const config = await getCachedConfig()
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: urlNetworkToChainId(network),
    vaultAddress,
  })

  if (rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview`)
  }

  const rolesList = await getCachedVaultSpecificRoles({
    institutionName,
    vaultAddress,
    network: parsedNetwork,
  })

  return (
    <ClientSideSdkWrapper>
      <PanelRoleAdmin
        roles={rolesList}
        vaultAddress={vaultAddress}
        network={network}
        institutionName={institutionName}
      />
    </ClientSideSdkWrapper>
  )
}
