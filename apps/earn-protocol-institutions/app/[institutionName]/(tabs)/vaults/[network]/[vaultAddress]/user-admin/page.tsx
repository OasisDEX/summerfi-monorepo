import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedAQWhitelist,
  getCachedInstitutionBasicData,
  getCachedInstitutionVaultActiveUsers,
  getCachedVaultWhitelist,
} from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelUserAdmin } from '@/features/panels/vaults/components/PanelUserAdmin/PanelUserAdmin'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultUserAdminPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const chainId = urlNetworkToChainId(network)
  const parsedNetwork = humanNetworktoSDKNetwork(network)

  // Standard fleet-management tab — not applicable to RWA (rounds-based) vaults. Bounce an RWA vault
  // (resolved from config by address) to its overview so it never reaches the v1 whitelist SDK path.
  // (Also replaces the old `networkNameToSDKId` check that threw on the `mainnet` slug.)
  const config = await getCachedConfig()
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: chainId,
    vaultAddress,
  })

  if (rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview`)
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
