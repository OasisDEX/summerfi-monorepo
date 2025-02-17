import { getDisplayToken, getUniqueVaultId } from '@summerfi/app-earn-ui'
import type {
  SDKGlobalRebalancesType,
  SDKGlobalRebalanceType,
  SDKVaultishType,
} from '@summerfi/app-types'

const rebalanceFilterProtocols = ({
  protocolFilter,
  rebalance,
}: {
  protocolFilter: string[]
  rebalance: SDKGlobalRebalanceType
}) => {
  const fromProtocol = rebalance.from.name?.replace(/-\d+$/u, '') ?? ''
  const toProtocol = rebalance.to.name?.replace(/-\d+$/u, '') ?? ''

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
}) =>
  !strategyFilter.length ||
  // type casting is slightly hacky here since rebalance.vault doesn't contain
  // all info from SDKVaultishType, but contains enough to get the unique vault id
  strategyFilter.includes(getUniqueVaultId(rebalance.vault as SDKVaultishType))

const rebalanceFilterTokens = ({
  tokenFilter,
  rebalance,
}: {
  tokenFilter: string[]
  rebalance: SDKGlobalRebalanceType
}) =>
  !tokenFilter.length || tokenFilter.includes(getDisplayToken(rebalance.vault.inputToken.symbol))

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
