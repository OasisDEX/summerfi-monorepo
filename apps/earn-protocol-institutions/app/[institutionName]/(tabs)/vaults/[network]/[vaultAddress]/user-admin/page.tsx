import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, networkNameToSDKId } from '@summerfi/app-utils'

import {
  getCachedAQWhitelist,
  getCachedInstitutionBasicData,
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
  const [institutionBasicData, whitelistedWallets] = await Promise.all([
    getCachedInstitutionBasicData({
      institutionName,
      network: parsedNetwork,
    }),
    getCachedVaultWhitelist({
      institutionName,
      vaultAddress,
      network: parsedNetwork,
    }),
  ])

  const [activeUsers, whitelistedAQWallets] = await Promise.all([
    getCachedInstitutionVaultActiveUsers({
      vaultAddress,
      chainId,
      institutionName,
    }),
    getCachedAQWhitelist({
      institutionName,
      vaultAddress,
      network: parsedNetwork,
      addressesList: whitelistedWallets.map((w) => w.owner as `0x${string}`),
    }),
  ])

  return (
    <ClientSideSdkWrapper>
      <PanelUserAdmin
        whitelistedWallets={whitelistedWallets}
        whitelistedAQWallets={whitelistedAQWallets}
        institutionBasicData={institutionBasicData}
        activeUsers={activeUsers}
        vaultAddress={vaultAddress}
        network={network}
        institutionName={institutionName}
      />
    </ClientSideSdkWrapper>
  )
}
