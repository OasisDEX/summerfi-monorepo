import { getDisplayToken, getUniqueVaultId } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type UserActivity, type UsersActivity } from '@summerfi/app-types'

const userActivityFilterStrategies = ({
  strategyFilter,
  userActivity,
}: {
  strategyFilter: string[]
  userActivity: UserActivity
}) =>
  !strategyFilter.length ||
  strategyFilter.includes(getUniqueVaultId(userActivity.vault as SDKVaultishType))

const userActivityFilterTokens = ({
  tokenFilter,
  userActivity,
}: {
  tokenFilter: string[]
  userActivity: UserActivity
}) =>
  !tokenFilter.length || tokenFilter.includes(getDisplayToken(userActivity.vault.inputToken.symbol))

export const userActivityFilter = ({
  userActivityList,
  strategyFilter,
  tokenFilter,
}: {
  userActivityList: UsersActivity
  strategyFilter: string[]
  tokenFilter: string[]
}) =>
  userActivityList
    .filter((userActivity) => userActivityFilterStrategies({ strategyFilter, userActivity }))
    .filter((userActivity) => userActivityFilterTokens({ tokenFilter, userActivity }))
