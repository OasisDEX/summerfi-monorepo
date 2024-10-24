import { StrategyGridDetails, subgraphNetworkToId } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultDetails } from '@/app/server-handlers/sdk/getVaultDetails'
import { StrategyDetailsView } from '@/components/layout/StrategyDetailsView/StrategyDetailsView'

type EarnStrategyDetailsPageProps = {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}

export const dynamic = 'force-dynamic'

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
