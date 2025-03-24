import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { NextResponse } from 'next/server'

import { userAddresesToFilterOut } from '@/app/server-handlers/tables-data/consts'
import { type TableSortOrder } from '@/app/server-handlers/tables-data/types'

import { type TopDepositorsPagination, type TopDepositorsSortBy } from './types'

/**
 * Fetches the top depositors from the database on the server side.
 *
 * @param {number} page - The current page number.
 * @param {number} limit - The number of records per page.
 * @param {TopDepositorsSortBy} [sortBy='balanceUsd'] - The field used for sorting.
 * @param {TableSortOrder} [orderBy='desc'] - The sorting order ('asc' or 'desc').
 * @param {string} [userAddress] - Optional filter for a specific user address.
 * @param {string[]} [strategies] - Optional filter for specific strategies.
 * @param {string[]} [tokens] - Optional filter for specific tokens.
 * @param {string[]} [filterOutUsersAddresses] - Optional filter for specific users addresses to filter out.
 * @returns {Promise<NextResponse>} - A response containing the top depositors and pagination details.
 */
export const getTopDepositorsServerSide = async ({
  page,
  limit,
  sortBy = 'balanceUsd',
  orderBy = 'desc',
  userAddress,
  strategies,
  tokens,
  filterOutUsersAddresses = userAddresesToFilterOut,
}: {
  page: number
  limit: number
  sortBy?: TopDepositorsSortBy
  orderBy?: TableSortOrder
  userAddress?: string
  strategies?: string[]
  tokens?: string[]
  filterOutUsersAddresses?: string[]
}) => {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
  }

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })

    // Build the query with proper typing
    const baseQuery = dbInstance.db.selectFrom('topDepositors').selectAll()

    const resolvedTokens = tokens?.map((token) => (token === 'ETH' ? 'WETH' : token))

    // If userAddress is provided, don't filter out any addresses
    // Testing wallets should display in the top depositors on thier position
    // page or portfolio page
    const resolvedFilterOutUsersAddresses = userAddress
      ? []
      : filterOutUsersAddresses.map((address) => address.toLowerCase())

    // Apply filters if provided
    const filteredQuery = baseQuery
      .$if(!!userAddress, (qb) =>
        qb.where('userAddress', '=', userAddress?.toLowerCase() as string),
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

    // Execute query and get total count using the same filters
    const [topDepositors, countResult] = await Promise.all([
      finalQuery,
      filteredQuery
        .clearSelect() // Clear the previous selectAll()
        .select((eb) => eb.fn.countAll().as('count'))
        .executeTakeFirst(),
    ])

    const totalItems = Number(countResult?.count ?? 0)

    return NextResponse.json({
      data: topDepositors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching top depositors:', error)

    return NextResponse.json({ error: 'Failed to fetch top depositors' }, { status: 500 })
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
 * Fetches paginated top depositors data from the server-side function and returns the parsed JSON response.
 *
 * @param {number} page - The current page number.
 * @param {number} limit - The number of records per page.
 * @param {TopDepositorsSortBy} [sortBy='balanceUsd'] - The field used for sorting.
 * @param {TableSortOrder} [orderBy='desc'] - The sorting order ('asc' or 'desc').
 * @param {string} [userAddress] - Optional filter for a specific user address.
 * @param {string[]} [strategies] - Optional filter for specific strategies.
 * @param {string[]} [tokens] - Optional filter for specific tokens.
 * @param {string[]} [filterOutUsersAddresses] - Optional filter for specific users addresses to filter out.
 * @returns {Promise<TopDepositorsPagination>} - A promise resolving to paginated top depositors data.
 */
export const getPaginatedTopDepositors = async ({
  page,
  limit,
  sortBy = 'balanceUsd',
  orderBy = 'desc',
  userAddress,
  strategies,
  tokens,
  filterOutUsersAddresses,
}: {
  page: number
  limit: number
  sortBy?: TopDepositorsSortBy
  orderBy?: TableSortOrder
  userAddress?: string
  strategies?: string[]
  tokens?: string[]
  filterOutUsersAddresses?: string[]
}): Promise<TopDepositorsPagination> => {
  return await getTopDepositorsServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    userAddress,
    strategies,
    tokens,
    filterOutUsersAddresses,
  }).then((res) => res.json())
}
