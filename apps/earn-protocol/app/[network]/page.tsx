import { type SDKNetwork } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'

import NotFoundPage from '@/app/not-found'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

type EarnNetworkVaultsPageProps = {
  params: Promise<{
    network: SDKNetwork | 'all-networks'
  }>
}

const EarnNetworkVaultsPage = async ({ params }: EarnNetworkVaultsPageProps) => {
  const { network: networkParam } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(networkParam)

  if (parsedNetwork === networkParam) {
    return <NotFoundPage />
  }

  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)
  const vaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  const vaultsApyByNetworkMap = await getVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(network),
    })),
  })

  return (
    <VaultListViewComponent
      vaultsList={vaultsWithConfig}
      selectedNetwork={parsedNetwork}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
    />
  )
}

export default EarnNetworkVaultsPage
