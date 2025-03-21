import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { NextResponse } from 'next/server'

import { type TableSortOrder } from '@/app/server-handlers/tables-data/types'

import { type RebalanceActivityPagination, type RebalanceActivitySortBy } from './types'

/**
 * Fetches rebalance activity data from the database with pagination and optional filtering.
 *
 * @param {number} page - The current page number.
 * @param {number} limit - The number of records per page.
 * @param {RebalanceActivitySortBy} [sortBy='timestamp'] - The field used for sorting.
 * @param {TableSortOrder} [orderBy='desc'] - The sorting order ('asc' or 'desc').
 * @param {string[]} [tokens] - Optional filter for specific tokens.
 * @param {string[]} [strategies] - Optional filter for specific strategies.
 * @param {string[]} [protocols] - Optional filter for specific protocols.
 * @param {number} [startTimestamp] - Optional filter for activities after a certain timestamp.
 * @returns {Promise<NextResponse>} - A JSON response containing paginated rebalance activity data.
 */
export const getRebalanceActivityServerSide = async ({
  page,
  limit,
  sortBy = 'timestamp',
  orderBy = 'desc',
  tokens,
  strategies,
  protocols,
  startTimestamp,
}: {
  page: number
  limit: number
  sortBy?: RebalanceActivitySortBy
  orderBy?: TableSortOrder
  tokens?: string[]
  strategies?: string[]
  protocols?: string[]
  startTimestamp?: number
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
    const baseQuery = dbInstance.db.selectFrom('rebalanceActivity').selectAll()

    // Apply filters if provided
    const filteredQuery = baseQuery
      .$if(!!tokens && tokens.length > 0, (qb) =>
        qb.where('inputTokenSymbol', 'in', resolvedTokens as string[]),
      )
      .$if(!!strategies && strategies.length > 0, (qb) =>
        qb.where('strategyId', 'in', strategies as string[]),
      )
      .$if(!!protocols && protocols.length > 0, (qb) =>
        qb.where((eb) =>
          eb.or([
            eb('fromName', 'in', protocols as string[]),
            eb('toName', 'in', protocols as string[]),
          ]),
        ),
      )
      .$if(!!startTimestamp, (qb) => qb.where('timestamp', '>=', startTimestamp?.toString() ?? '0'))

    // Apply pagination and sorting
    const finalQuery = filteredQuery
      .orderBy(sortBy, orderBy)
      .limit(limit)
      .offset((page - 1) * limit)
      .execute()

    // Execute query and get total count using the same filters
    const [activities, countResult] = await Promise.all([
      finalQuery,
      filteredQuery
        .clearSelect() // Clear the previous selectAll()
        .select((eb) => eb.fn.countAll().as('count'))
        .executeTakeFirst(),
    ])

    const totalItems = Number(countResult?.count ?? 0)

    return NextResponse.json({
      data: activities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching latest activity:', error)

    return NextResponse.json({ error: 'Failed to fetch latest activity' }, { status: 500 })
  } finally {
    // Always clean up the database connection
    if (dbInstance) {
      await dbInstance.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection:', err)
      })
    }
  }
}

/**
 * Fetches paginated rebalance activity data from the server-side function and returns the parsed JSON response.
 *
 * @param {number} page - The current page number.
 * @param {number} limit - The number of records per page.
 * @param {RebalanceActivitySortBy} [sortBy='timestamp'] - The field used for sorting.
 * @param {TableSortOrder} [orderBy='desc'] - The sorting order ('asc' or 'desc').
 * @param {string[]} [tokens] - Optional filter for specific tokens.
 * @param {string[]} [strategies] - Optional filter for specific strategies.
 * @param {string[]} [protocols] - Optional filter for specific protocols.
 * @param {number} [startTimestamp] - Optional filter for activities after a certain timestamp.
 * @returns {Promise<RebalanceActivityPagination>} - A promise resolving to paginated rebalance activity data.
 */
export const getPaginatedRebalanceActivity = async ({
  page,
  limit,
  sortBy = 'timestamp',
  orderBy = 'desc',
  tokens,
  strategies,
  protocols,
  startTimestamp,
}: {
  page: number
  limit: number
  sortBy?: RebalanceActivitySortBy
  orderBy?: TableSortOrder
  userAddress?: string
  tokens?: string[]
  strategies?: string[]
  protocols?: string[]
  startTimestamp?: number
}): Promise<RebalanceActivityPagination> => {
  return await getRebalanceActivityServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    tokens,
    strategies,
    protocols,
    startTimestamp,
  }).then((res) => res.json())
}
