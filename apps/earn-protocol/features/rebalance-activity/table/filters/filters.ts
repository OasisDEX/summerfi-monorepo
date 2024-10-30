import type { SDKRebalancesType } from '@summerfi/app-types'

const rebalanceFilterProtocols = (
  // eslint-disable-next-line no-empty-pattern
  {
    // protocolFilter,
    // rebalance,
  }: {
    protocolFilter: string[]
    rebalance: SDKRebalancesType[0]
  },
) => true

const rebalanceFilterStrategies = ({
  strategyFilter,
  rebalance,
}: {
  strategyFilter: string[]
  rebalance: SDKRebalancesType[0]
}) => !strategyFilter.length || strategyFilter.includes(rebalance.vault.id)

const rebalanceFilterTokens = ({
  tokenFilter,
  rebalance,
}: {
  tokenFilter: string[]
  rebalance: SDKRebalancesType[0]
}) => !tokenFilter.length || tokenFilter.includes(rebalance.vault.inputToken.symbol)

export const rebalanceActivityFilter = ({
  rebalancesList,
  protocolFilter,
  strategyFilter,
  tokenFilter,
}: {
  rebalancesList: SDKRebalancesType
  protocolFilter: string[]
  strategyFilter: string[]
  tokenFilter: string[]
}) =>
  rebalancesList
    .filter((rebalance) => rebalanceFilterProtocols({ protocolFilter, rebalance }))
    .filter((rebalance) => rebalanceFilterStrategies({ strategyFilter, rebalance }))
    .filter((rebalance) => rebalanceFilterTokens({ tokenFilter, rebalance }))
