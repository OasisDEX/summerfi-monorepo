import { type SDKNetwork } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, parseServerResponseToClient } from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

type EarnNetworkVaultsPageProps = {
  params: Promise<{
    network: SDKNetwork | 'all-networks'
  }>
}

const EarnNetworkVaultsPage = async ({ params }: EarnNetworkVaultsPageProps) => {
  const { network } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)
  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  return <VaultListViewComponent vaultsList={vaultsDecorated} selectedNetwork={parsedNetwork} />
}

export default EarnNetworkVaultsPage
