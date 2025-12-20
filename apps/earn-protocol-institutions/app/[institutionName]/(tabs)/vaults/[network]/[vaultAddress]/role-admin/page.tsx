import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, networkNameToSDKId } from '@summerfi/app-utils'

import { getCachedVaultSpecificRoles } from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelRoleAdmin } from '@/features/panels/vaults/components/PanelRoleAdmin/PanelRoleAdmin'

export default async function InstitutionVaultRoleAdminPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const chainId = networkNameToSDKId(network)
  const parsedNetwork = humanNetworktoSDKNetwork(network)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!chainId) {
    throw new Error(`Unsupported network: ${network}`)
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
