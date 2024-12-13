import type { SDKGlobalRebalancesType, SDKGlobalRebalanceType } from '@summerfi/app-types'

import { getProtocolLabel } from '@/helpers/get-protocol-label'

const rebalanceFilterProtocols = ({
  protocolFilter,
  rebalance,
}: {
  protocolFilter: string[]
  rebalance: SDKGlobalRebalanceType
}) => {
  const fromProtocol = getProtocolLabel(rebalance.from.name?.split('-') ?? ['n/a'])
  const toProtocol = getProtocolLabel(rebalance.to.name?.split('-') ?? ['n/a'])

  return (
    !protocolFilter.length ||
    protocolFilter.includes(fromProtocol) ||
    protocolFilter.includes(toProtocol)
  )
}

const rebalanceFilterStrategies = ({
  strategyFilter,
  rebalance,
}: {
  strategyFilter: string[]
  rebalance: SDKGlobalRebalanceType
}) => !strategyFilter.length || strategyFilter.includes(rebalance.vault.id)

const rebalanceFilterTokens = ({
  tokenFilter,
  rebalance,
}: {
  tokenFilter: string[]
  rebalance: SDKGlobalRebalanceType
}) => !tokenFilter.length || tokenFilter.includes(rebalance.vault.inputToken.symbol)

export const rebalanceActivityFilter = ({
  rebalancesList,
  protocolFilter,
  strategyFilter,
  tokenFilter,
}: {
  rebalancesList: SDKGlobalRebalancesType
  protocolFilter: string[]
  strategyFilter: string[]
  tokenFilter: string[]
}) =>
  rebalancesList
    .filter((rebalance) => rebalanceFilterProtocols({ protocolFilter, rebalance }))
    .filter((rebalance) => rebalanceFilterStrategies({ strategyFilter, rebalance }))
    .filter((rebalance) => rebalanceFilterTokens({ tokenFilter, rebalance }))
