import { type SDKUserActivityType, type SDKUsersActivityType } from '@summerfi/app-types'

const userActivityFilterStrategies = ({
  strategyFilter,
  userActivity,
}: {
  strategyFilter: string[]
  userActivity: SDKUserActivityType
}) => !strategyFilter.length || strategyFilter.includes(userActivity.vault.id)

const userActivityFilterTokens = ({
  tokenFilter,
  userActivity,
}: {
  tokenFilter: string[]
  userActivity: SDKUserActivityType
}) => !tokenFilter.length || tokenFilter.includes(userActivity.vault.inputToken.symbol)

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
