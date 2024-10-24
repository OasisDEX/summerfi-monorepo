import { StrategyGridDetails, subgraphNetworkToId } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { StrategyDetailsView } from '@/components/layout/StrategyDetailsView/StrategyDetailsView'
import { getVaultDetails } from '@/server-handlers/sdk/getVaultDetails'

type EarnStrategyDetailsPageProps = {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}

const EarnStrategyDetailsPage = async ({ params }: EarnStrategyDetailsPageProps) => {
  const networkId = subgraphNetworkToId(params.network)

  const selectedVault = await getVaultDetails({
    vaultAddress: params.vaultId,
    chainId: networkId,
  })

  return (
    <StrategyGridDetails strategy={selectedVault}>
      <StrategyDetailsView />
    </StrategyGridDetails>
  )
}

export default EarnStrategyDetailsPage
