import type { SDKGlobalRebalancesType, SDKGlobalRebalanceType } from '@summerfi/app-types'

const rebalanceFilterProtocols = (
  // eslint-disable-next-line no-empty-pattern
  {
    // protocolFilter,
    // rebalance,
  }: {
    protocolFilter: string[]
    rebalance: SDKGlobalRebalanceType
  },
) => true

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
