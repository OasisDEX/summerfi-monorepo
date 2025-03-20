import { type ActionType, getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { NextResponse } from 'next/server'

import { type LatestActivitiesPagination, type LatestActivitiesSortBy } from './types'

export const getLatestActivitiesServerSide = async ({
  page,
  limit,
  sortBy = 'timestamp',
  orderBy = 'desc',
  actionType,
  userAddress,
  tokens,
  strategies,
}: {
  page: number
  limit: number
  sortBy?: LatestActivitiesSortBy
  orderBy?: 'asc' | 'desc'
  actionType?: ActionType
  userAddress?: string
  tokens?: string[]
  strategies?: string[]
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

    // Apply filters if provided
    const filteredQuery = baseQuery
      .$if(!!actionType, (qb) => qb.where('actionType', '=', actionType as ActionType))
      .$if(!!userAddress, (qb) =>
        qb.where('userAddress', '=', userAddress?.toLowerCase() as string),
      )
      .$if(!!tokens && tokens.length > 0, (qb) =>
        qb.where('inputTokenSymbol', 'in', resolvedTokens as string[]),
      )
      .$if(!!strategies && strategies.length > 0, (qb) =>
        qb.where('strategyId', 'in', strategies as string[]),
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
    const [activities, countResult, totalDepositsCount, depositsForMedian] = await Promise.all([
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
    ])

    const medianDeposit =
      (Number(depositsForMedian[0]?.amountUsd ?? 0) +
        Number(depositsForMedian[1]?.amountUsd ?? 0)) /
      2

    const totalDeposits = Number(totalDepositsCount?.count ?? 0)

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
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching latest activity:', error)

    return NextResponse.json({ error: 'Failed to fetch latest activity' }, { status: 500 })
  } finally {
    if (dbInstance) {
      await dbInstance.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection:', err)
      })
    }
  }
}

export const getPaginatedLatestActivity = async ({
  page,
  limit,
  sortBy = 'timestamp',
  orderBy = 'desc',
  actionType,
  userAddress,
  tokens,
  strategies,
}: {
  page: number
  limit: number
  sortBy?: LatestActivitiesSortBy
  orderBy?: 'asc' | 'desc'
  actionType?: ActionType
  userAddress?: string
  tokens?: string[]
  strategies?: string[]
}): Promise<LatestActivitiesPagination> => {
  return await getLatestActivitiesServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    actionType,
    userAddress,
    tokens,
    strategies,
  }).then((res) => res.json())
}
