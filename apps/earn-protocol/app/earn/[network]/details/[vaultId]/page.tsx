import { StrategyGridDetails } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'

import { StrategyDetailsView } from '@/components/layout/StrategyDetailsView/StrategyDetailsView'
import { getVaultsList } from '@/server-handlers/sdk/getVaultsList'

type EarnStrategyDetailsPageProps = {
  params: {
    network: NetworkNames
    vaultId: string
  }
}

const EarnStrategyDetailsPage = async ({ params }: EarnStrategyDetailsPageProps) => {
  const strategiesList = await getVaultsList()

  const selectedStrategyData = strategiesList.find((strategy) => strategy.id === params.vaultId)

  return (
    <StrategyGridDetails strategy={selectedStrategyData as (typeof strategiesList)[number]}>
      <StrategyDetailsView />
    </StrategyGridDetails>
  )
}

export default EarnStrategyDetailsPage
