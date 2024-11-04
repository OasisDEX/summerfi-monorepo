import type { SDKGlobalRebalancesType, SDKGlobalRebalanceType } from '@summerfi/app-types'

const rebalanceFilterProtocols = ({
  protocolFilter,
  rebalance,
}: {
  protocolFilter: string[]
  rebalance: SDKGlobalRebalanceType
}) =>
  !protocolFilter.length ||
  protocolFilter.includes(rebalance.from.name?.split('-')[0] ?? '') ||
  protocolFilter.includes(rebalance.to.name?.split('-')[0] ?? '')

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
