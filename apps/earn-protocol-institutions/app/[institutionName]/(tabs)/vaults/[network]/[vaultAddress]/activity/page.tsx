import { Text } from '@summerfi/app-earn-ui'
import {
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetworkId,
} from '@summerfi/app-utils'

import { getInstitutionVaultActivityLog } from '@/app/server-handlers/institution/institution-vaults'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
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

  const [vault, activityLogBaseDataRaw] = await Promise.all([
    getVaultDetails({
      institutionName,
      vaultAddress: parsedVaultAddress,
      network: parsedNetwork,
    }),
    getInstitutionVaultActivityLog({
      vaultAddress: parsedVaultAddress,
      chainId,
      weekNo: 0,
    }),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultAddress} on the network {parsedNetwork}
      </Text>
    )
  }

  return (
    <PanelActivity
      institutionName={institutionName}
      activityLogBaseDataRaw={activityLogBaseDataRaw}
      vault={vault}
    />
  )
}
