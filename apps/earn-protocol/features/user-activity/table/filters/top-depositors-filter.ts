import { getDisplayToken, getUniqueVaultId } from '@summerfi/app-earn-ui'
import {
  type SDKUserActivityType,
  type SDKUsersActivityType,
  type SDKVaultishType,
} from '@summerfi/app-types'

const userActivityFilterStrategies = ({
  strategyFilter,
  userActivity,
}: {
  strategyFilter: string[]
  userActivity: SDKUserActivityType
}) =>
  !strategyFilter.length ||
  strategyFilter.includes(getUniqueVaultId(userActivity.vault as SDKVaultishType))

const userActivityFilterTokens = ({
  tokenFilter,
  userActivity,
}: {
  tokenFilter: string[]
  userActivity: SDKUserActivityType
}) =>
  !tokenFilter.length || tokenFilter.includes(getDisplayToken(userActivity.vault.inputToken.symbol))

export const topDepositorsFilter = ({
  topDepositorsList,
  strategyFilter,
  tokenFilter,
}: {
  topDepositorsList: SDKUsersActivityType
  strategyFilter: string[]
  tokenFilter: string[]
}) =>
  topDepositorsList
    .filter((userActivity) => userActivityFilterStrategies({ strategyFilter, userActivity }))
    .filter((userActivity) => userActivityFilterTokens({ tokenFilter, userActivity }))
