import { Text } from '@summerfi/app-earn-ui'
import {
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetworkId,
} from '@summerfi/app-utils'

import {
  getCachedInstitutionVaultActivityLog,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { PanelActivity } from '@/features/panels/vaults/components/PanelActivity/PanelActivity'

export default async function InstitutionVaultActivityPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { vaultAddress, network, institutionName } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const chainId = supportedSDKNetworkId(subgraphNetworkToId(parsedNetwork))
  const parsedVaultAddress = vaultAddress.toLowerCase()

  const [vault] = await Promise.all([
    getCachedVaultDetails({
      institutionName,
      vaultAddress: parsedVaultAddress,
      network: parsedNetwork,
    }),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultAddress} on the network {parsedNetwork}
      </Text>
    )
  }

  const [activityLogBaseDataRaw] = await Promise.all([
    getCachedInstitutionVaultActivityLog({
      vaultAddress: parsedVaultAddress,
      chainId,
      weekNo: 0,
      institutionName,
      targetContractsList: [parsedVaultAddress, ...vault.arks.map((ark) => ark.id)],
    }),
  ])

  return (
    <PanelActivity
      institutionName={institutionName}
      activityLogBaseDataRaw={activityLogBaseDataRaw}
      vault={vault}
    />
  )
}
