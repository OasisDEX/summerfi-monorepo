/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { type LatestActivitiesSortBy } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type TopDepositorsSortBy } from '@/app/server-handlers/tables-data/top-depositors/types'
import { type TableSortOrder } from '@/app/server-handlers/tables-data/types'

interface LatestActivitySearchParams {
  tokens: string[]
  strategies: string[]
  topDepositorsSortBy: TopDepositorsSortBy | undefined
  topDepositorsOrderBy: TableSortOrder | undefined
  latestActivitySortBy: LatestActivitiesSortBy | undefined
  latestActivityOrderBy: TableSortOrder | undefined
}

/**
 * Parses the search params for the latest activity and top depositors tables,
 * providing default values for missing params and normalizing orderBy values to lowercase.
 * It ensures that tokens and strategies are always arrays, and sort/order values are typed.
 * @param searchParamsParsed - The search params to parse.
 * @returns The parsed search params.
 */
export const parseLatestActivitySearchParams = (searchParamsParsed: {
  [key: string]: string[]
}): LatestActivitySearchParams => {
  const tokens = searchParamsParsed.tokens ?? []
  const strategies = searchParamsParsed.strategies ?? []

  const topDepositorsSortBy = (searchParamsParsed.topDepositorsSortBy?.[0] ?? undefined) as
    | TopDepositorsSortBy
    | undefined
  const topDepositorsOrderBy = (searchParamsParsed.topDepositorsOrderBy?.[0]?.toLowerCase() ??
    undefined) as TableSortOrder | undefined
  const latestActivitySortBy = (searchParamsParsed.latestActivitySortBy?.[0] ?? undefined) as
    | LatestActivitiesSortBy
    | undefined
  const latestActivityOrderBy = (searchParamsParsed.latestActivityOrderBy?.[0]?.toLowerCase() ??
    undefined) as TableSortOrder | undefined

  return {
    tokens,
    strategies,
    topDepositorsSortBy,
    topDepositorsOrderBy,
    latestActivitySortBy,
    latestActivityOrderBy,
  }
}
