import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, networkNameToSDKId } from '@summerfi/app-utils'

import {
  getCachedInstitutionVaultActiveUsers,
  getCachedVaultWhitelist,
} from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelUserAdmin } from '@/features/panels/vaults/components/PanelUserAdmin/PanelUserAdmin'

export default async function InstitutionVaultUserAdminPage({
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

  const [whitelistedWallets, activeUsers] = await Promise.all([
    getCachedVaultWhitelist({
      institutionName,
      vaultAddress,
      network: parsedNetwork,
    }),
    getCachedInstitutionVaultActiveUsers({
      vaultAddress,
      chainId,
      institutionName,
    }),
  ])

  return (
    <ClientSideSdkWrapper>
      <PanelUserAdmin
        whitelistedWallets={whitelistedWallets}
        activeUsers={activeUsers}
        vaultAddress={vaultAddress}
        network={network}
        institutionName={institutionName}
      />
    </ClientSideSdkWrapper>
  )
}
