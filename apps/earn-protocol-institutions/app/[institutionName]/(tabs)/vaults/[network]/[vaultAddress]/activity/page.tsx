import { Text } from '@summerfi/app-earn-ui'
import {
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetworkId,
} from '@summerfi/app-utils'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionVaultActivityLog,
  getCachedRwaVaultActivity,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { PanelActivity } from '@/features/panels/vaults/components/PanelActivity/PanelActivity'
import { PanelRwaActivity } from '@/features/panels/vaults/components/PanelRwaActivity/PanelRwaActivity'
import { getRwaClientIdForVault } from '@/helpers/rwa'

export default async function InstitutionVaultActivityPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { vaultAddress, network, institutionName } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const chainId = supportedSDKNetworkId(subgraphNetworkToId(parsedNetwork))
  const parsedVaultAddress = vaultAddress.toLowerCase()

  const config = await getCachedConfig()
  const isRwa = !!getRwaClientIdForVault({
    systemConfig: config,
    networkId: subgraphNetworkToId(parsedNetwork),
    vaultAddress: parsedVaultAddress,
  })

  // RWA deposits/withdrawals flow through the rounds vaults and are recorded as receipt activities in
  // the institutions-v2 subgraph — not on the standard `vault.deposits/withdraws`. Show those instead.
  if (isRwa) {
    const activity = await getCachedRwaVaultActivity({
      institutionName,
      network: parsedNetwork,
      vaultAddress: parsedVaultAddress,
    })

    return <PanelRwaActivity activity={activity} />
  }

  const vault = await getCachedVaultDetails({
    institutionName,
    vaultAddress: parsedVaultAddress,
    network: parsedNetwork,
  })

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultAddress} on the network {parsedNetwork}
      </Text>
    )
  }

  const activityLogBaseDataRaw = await getCachedInstitutionVaultActivityLog({
    vaultAddress: parsedVaultAddress,
    chainId,
    weekNo: 0,
    institutionName,
    targetContractsList: [parsedVaultAddress, ...vault.arks.map((ark) => ark.id)],
  })

  return (
    <PanelActivity
      institutionName={institutionName}
      activityLogBaseDataRaw={activityLogBaseDataRaw}
      vault={vault}
    />
  )
}
