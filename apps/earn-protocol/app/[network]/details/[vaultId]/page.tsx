import { type FC } from 'react'
import { type SDKNetwork } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

interface EarnVaultDetailsPageProps {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}

const EarnVaultDetailsPage: FC<EarnVaultDetailsPageProps> = () => {
  return redirect('/sumr')

  // const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  // const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  // const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  // const parsedVaultId = isAddress(params.vaultId)
  //   ? params.vaultId
  //   : getVaultIdByVaultCustomName(params.vaultId, String(parsedNetworkId), systemConfig)

  // const [vault, { vaults }] = await Promise.all([
  //   getVaultDetails({
  //     vaultAddress: parsedVaultId,
  //     network: parsedNetwork,
  //   }),
  //   getVaultsList(),
  // ])

  // const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  // if (!vault) {
  //   return (
  //     <Text>
  //       No vault found with the id {parsedVaultId} on the network {parsedNetwork}
  //     </Text>
  //   )
  // }

  // return (
  //   <VaultGridDetails vault={vault} vaults={vaultsDecorated}>
  //     <VaultDetailsView />
  //   </VaultGridDetails>
  // )
}

export default EarnVaultDetailsPage
