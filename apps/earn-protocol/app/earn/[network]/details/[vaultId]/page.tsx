import { StrategyGridDetails, subgraphNetworkToId } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultDetails } from '@/app/server-handlers/sdk/getVaultDetails'
import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { StrategyDetailsView } from '@/components/layout/StrategyDetailsView/StrategyDetailsView'

type EarnStrategyDetailsPageProps = {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}

export const revalidate = 60

const EarnStrategyDetailsPage = async ({ params }: EarnStrategyDetailsPageProps) => {
  const networkId = subgraphNetworkToId(params.network)

  const [selectedVault, { vaults: strategiesList }] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      chainId: networkId,
    }),
    getVaultsList(),
  ])

  return (
    <StrategyGridDetails strategy={selectedVault} strategies={strategiesList}>
      <StrategyDetailsView />
    </StrategyGridDetails>
  )
}

export default EarnStrategyDetailsPage
