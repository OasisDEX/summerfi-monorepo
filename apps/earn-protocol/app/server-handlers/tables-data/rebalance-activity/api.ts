import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { NextResponse } from 'next/server'

import { type RebalanceActivityPagination } from './types'

export const getRebalanceActivityServerSide = async ({
  page,
  limit,
  sortBy = 'timestamp',
  orderBy = 'desc',
  tokens,
  strategies,
  startTimestamp,
}: {
  page: number
  limit: number
  sortBy?: 'timestamp' | 'amount' | 'amountUsd'
  orderBy?: 'asc' | 'desc'
  tokens?: string[]
  strategies?: string[]
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

  try {
    const { db } = await getSummerProtocolDB({
      connectionString,
    })

    // Build the query with proper typing
    const baseQuery = db.selectFrom('rebalanceActivity').selectAll()

    // Apply filters if provided
    const filteredQuery = baseQuery
      .$if(!!tokens && tokens.length > 0, (qb) =>
        qb.where('inputTokenSymbol', 'in', resolvedTokens as string[]),
      )
      .$if(!!strategies && strategies.length > 0, (qb) =>
        qb.where('strategyId', 'in', strategies as string[]),
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
  }
}

export const getPaginatedRebalanceActivity = async ({
  page,
  limit,
  sortBy = 'timestamp',
  orderBy = 'desc',
  tokens,
  strategies,
  startTimestamp,
}: {
  page: number
  limit: number
  sortBy?: 'timestamp' | 'amount' | 'amountUsd'
  orderBy?: 'asc' | 'desc'
  userAddress?: string
  tokens?: string[]
  strategies?: string[]
  startTimestamp?: number
}): Promise<RebalanceActivityPagination> => {
  return await getRebalanceActivityServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    tokens,
    strategies,
    startTimestamp,
  }).then((res) => res.json())
}
