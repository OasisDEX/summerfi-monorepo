import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'

import { getVaultWhitelist } from '@/app/server-handlers/sdk/get-vault-whitelist'
import { PanelUserAdmin } from '@/features/panels/vaults/components/PanelUserAdmin/PanelUserAdmin'

export default async function InstitutionVaultUserAdminPage({
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
    <PanelUserAdmin
      whitelistedWallets={whitelistedWallets}
      vaultAddress={vaultAddress}
      network={network}
      institutionName={institutionName}
    />
  )
}
