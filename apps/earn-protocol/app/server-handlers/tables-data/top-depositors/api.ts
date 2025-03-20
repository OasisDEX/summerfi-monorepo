import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { NextResponse } from 'next/server'

import { type TopDepositorsPagination, type TopDepositorsSortBy } from './types'

export const getTopDepositorsServerSide = async ({
  page,
  limit,
  sortBy = 'balanceUsd',
  orderBy = 'desc',
  userAddress,
  strategies,
  tokens,
}: {
  page: number
  limit: number
  sortBy?: TopDepositorsSortBy
  orderBy?: 'asc' | 'desc'
  userAddress?: string
  strategies?: string[]
  tokens?: string[]
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

export const getPaginatedTopDepositors = async ({
  page,
  limit,
  sortBy = 'balanceUsd',
  orderBy = 'desc',
  userAddress,
  strategies,
  tokens,
}: {
  page: number
  limit: number
  sortBy?: TopDepositorsSortBy
  orderBy?: 'asc' | 'desc'
  userAddress?: string
  strategies?: string[]
  tokens?: string[]
}): Promise<TopDepositorsPagination> => {
  return await getTopDepositorsServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    userAddress,
    strategies,
    tokens,
  }).then((res) => res.json())
}
