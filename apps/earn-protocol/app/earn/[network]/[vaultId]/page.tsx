import { type NetworkNames } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

const RedirectToStrategyDetails = ({
  params,
}: {
  params: {
    network: NetworkNames
    vaultId: string
  }
}) => {
  const { network, vaultId: strategyId } = params

  // redirect to strategy position page
  redirect(`/earn/${network}/position/${strategyId}`)
}

export default RedirectToStrategyDetails
