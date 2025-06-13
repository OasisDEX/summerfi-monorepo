import { type ActionType, getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { NextResponse } from 'next/server'

import { userAddresesToFilterOut } from '@/app/server-handlers/tables-data/consts'
import { type TableSortOrder } from '@/app/server-handlers/tables-data/types'

import { type LatestActivitiesSortBy, type LatestActivityPagination } from './types'

export const defaultLatestActivityPagination: LatestActivityPagination = {
  data: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  totalDeposits: 0,
  medianDeposit: 0,
  totalUniqueUsers: 0,
}

/**
 * Fetches the latest activities from the database server-side with optional filters.
 *
 * @param {Object} params - Query parameters for fetching latest activities.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The number of records per page.
 * @param {LatestActivitiesSortBy} [params.sortBy='timestamp'] - Field to sort results by (default: timestamp).
 * @param {TableSortOrder} [params.orderBy='desc'] - Sorting order (`asc` or `desc`), defaulting to `desc`.
 * @param {ActionType} [params.actionType] - Optional action type to filter by.
 * @param {string} [params.userAddress] - Optional user address to filter activity for a specific user.
 * @param {string[]} [params.tokens] - Optional list of token symbols to filter by.
 * @param {string[]} [params.strategies] - Optional list of strategy IDs to filter by.
 * @param {string[]} [params.filterOutUsersAddresses] - Optional list of user addresses to filter out.
 *
 * @returns {NextResponse} A Next.js response containing the latest activities and pagination details.
 */
export const getLatestActivitiesServerSide = async ({
  page,
  limit,
  sortBy = 'timestamp',
  orderBy = 'desc',
  actionType,
  usersAddresses = [],
  tokens,
  strategies,
  filterOutUsersAddresses = userAddresesToFilterOut,
}: {
  page: number
  limit: number
  sortBy?: LatestActivitiesSortBy
  orderBy?: TableSortOrder
  actionType?: ActionType
  usersAddresses?: string[]
  tokens?: string[]
  strategies?: string[]
  filterOutUsersAddresses?: string[]
}) => {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
  }

  const resolvedTokens = tokens?.map((token) => (token === 'ETH' ? 'WETH' : token))

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })

    // Build the query with proper typing
    const baseQuery = dbInstance.db.selectFrom('latestActivity').selectAll()

    // If userAddress is provided, don't filter out any addresses
    // Testing wallets should display in the latest activity on thier position
    // page or portfolio page
    const resolvedFilterOutUsersAddresses =
      usersAddresses.length > 0
        ? []
        : filterOutUsersAddresses.map((address) => address.toLowerCase())

    // Apply filters if provided
    const filteredQuery = baseQuery
      .$if(!!actionType, (qb) => qb.where('actionType', '=', actionType as ActionType))
      .$if(usersAddresses.length > 0, (qb) =>
        qb.where(
          'userAddress',
          'in',
          usersAddresses.map((address) => address.toLowerCase()) as string[],
        ),
      )
      .$if(!!tokens && tokens.length > 0, (qb) =>
        qb.where('inputTokenSymbol', 'in', resolvedTokens as string[]),
      )
      .$if(!!strategies && strategies.length > 0, (qb) =>
        qb.where('strategyId', 'in', strategies as string[]),
      )
      .$if(resolvedFilterOutUsersAddresses.length > 0, (qb) =>
        qb.where('userAddress', 'not in', resolvedFilterOutUsersAddresses),
      )

    // Apply pagination and sorting
    const finalQuery = filteredQuery
      .orderBy(sortBy, orderBy)
      .limit(limit)
      .offset((page - 1) * limit)
      .execute()

    const offset = await baseQuery
      .clearSelect()
      .where('actionType', '=', 'deposit')
      .select((eb) => eb.fn.countAll().as('count'))
      .executeTakeFirst()
      .then((result) => Math.floor((Number(result?.count ?? 0) - 1) / 2))

    // Execute query and get total count using the same filters
    const [activities, countResult, totalDepositsCount, depositsForMedian, uniqueUsersCount] =
      await Promise.all([
        finalQuery,
        filteredQuery
          .clearSelect() // Clear the previous selectAll()
          .select((eb) => eb.fn.countAll().as('count'))
          .executeTakeFirst(),
        baseQuery
          .clearSelect() // Clear the previous selectAll()
          .where('actionType', '=', 'deposit')
          .select((eb) => eb.fn.countAll().as('count'))
          .executeTakeFirst(),
        baseQuery
          .clearSelect()
          .where('actionType', '=', 'deposit')
          .select('amountUsd')
          .orderBy('amountUsd', 'asc')
          .offset(offset === -1 ? 0 : offset)
          .limit(2)
          .execute(),
        baseQuery
          .clearSelect()
          .where('actionType', '=', 'deposit')
          .select((eb) => eb.fn.count('userAddress').as('count'))
          .groupBy('userAddress')
          .execute()
          .then((results) => results.length),
      ])

    const medianDeposit =
      (Number(depositsForMedian[0]?.amountUsd ?? 0) +
        Number(depositsForMedian[1]?.amountUsd ?? 0)) /
      2

    const totalDeposits = Number(totalDepositsCount?.count ?? 0)
    const totalUniqueUsers = uniqueUsersCount

    const totalItems = Number(countResult?.count ?? 0)

    return NextResponse.json({
      data: activities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
      totalDeposits,
      medianDeposit,
      totalUniqueUsers,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching latest activity:', error)

    return NextResponse.json(defaultLatestActivityPagination)
  } finally {
    if (dbInstance) {
      await dbInstance.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection:', err)
      })
    }
  }
}

/**
 * Fetches paginated latest activity data.
 *
 * @param {Object} params - Query parameters for fetching latest activities.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The number of records per page.
 * @param {LatestActivitiesSortBy} [params.sortBy='timestamp'] - Field to sort results by (default: timestamp).
 * @param {TableSortOrder} [params.orderBy='desc'] - Sorting order (`asc` or `desc`), defaulting to `desc`.
 * @param {ActionType} [params.actionType] - Optional action type to filter by.
 * @param {string} [params.userAddress] - Optional user address to filter activity for a specific user.
 * @param {string[]} [params.tokens] - Optional list of token symbols to filter by.
 * @param {string[]} [params.strategies] - Optional list of strategy IDs to filter by.
 * @param {string[]} [params.filterOutUsersAddresses] - Optional list of user addresses to filter out.
 *
 * @returns {Promise<LatestActivityPagination>} A promise resolving to the paginated API response in JSON format.
 */
export const getPaginatedLatestActivity = async ({
  page,
  limit,
  sortBy = 'timestamp',
  orderBy = 'desc',
  actionType,
  usersAddresses,
  tokens,
  strategies,
  filterOutUsersAddresses,
}: {
  page: number
  limit: number
  sortBy?: LatestActivitiesSortBy
  orderBy?: TableSortOrder
  actionType?: ActionType
  usersAddresses?: string[]
  tokens?: string[]
  strategies?: string[]
  filterOutUsersAddresses?: string[]
}): Promise<LatestActivityPagination> => {
  return await getLatestActivitiesServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    actionType,
    usersAddresses,
    tokens,
    strategies,
    filterOutUsersAddresses,
  }).then((res) => res.json())
}
