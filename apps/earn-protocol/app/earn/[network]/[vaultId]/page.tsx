import { type SDKNetwork } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

const RedirectToStrategyDetails = ({
  params,
}: {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}) => {
  const { network, vaultId: strategyId } = params

  // redirect to strategy position page
  redirect(`/earn/${network.toLowerCase()}/position/${strategyId}`)
}

export default RedirectToStrategyDetails
