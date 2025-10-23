import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'

import { getVaultWhitelist } from '@/app/server-handlers/sdk/get-vault-whitelist'
import { PanelClientAdmin } from '@/features/panels/vaults/components/PanelClientAdmin/PanelClientAdmin'

export default async function InstitutionVaultClientAdminPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const chainId = networkNameToSDKId(network)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!chainId) {
    throw new Error(`Unsupported network: ${network}`)
  }

  const whitelistedWallets = await getVaultWhitelist({
    institutionName,
    vaultAddress,
    chainId,
  })

  return (
    <PanelClientAdmin
      whitelistedWallets={whitelistedWallets}
      vaultAddress={vaultAddress}
      network={network}
      institutionName={institutionName}
    />
  )
}
