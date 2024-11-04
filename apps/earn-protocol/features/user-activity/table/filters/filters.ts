import { type UserActivity, type UsersActivity } from '@/app/server-handlers/sdk/get-users-activity'

const userActivityFilterStrategies = ({
  strategyFilter,
  userActivity,
}: {
  strategyFilter: string[]
  userActivity: UserActivity
}) => !strategyFilter.length || strategyFilter.includes(userActivity.vault.id)

const userActivityFilterTokens = ({
  tokenFilter,
  userActivity,
}: {
  tokenFilter: string[]
  userActivity: UserActivity
}) => !tokenFilter.length || tokenFilter.includes(userActivity.vault.inputToken.symbol)

export const userActivityActivityFilter = ({
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
