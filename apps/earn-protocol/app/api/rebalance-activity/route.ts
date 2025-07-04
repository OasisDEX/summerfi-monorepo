import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getRebalanceActivityServerSide } from '@/app/server-handlers/tables-data/rebalance-activity/api'

const RebalanceActivityQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sortBy: z.enum(['timestamp', 'amount', 'amountUsd']).default('timestamp'),
  orderBy: z.enum(['asc', 'desc']).default('desc'),
  tokens: z.string().optional(),
  strategies: z.string().optional(),
  protocols: z.string().optional(),
  userAddress: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const result = RebalanceActivityQueryParamsSchema.safeParse(searchParams)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters',
        details: result.error.issues,
      },
      { status: 400 },
    )
  }

  const { page, limit, sortBy, orderBy, tokens, strategies, protocols, userAddress } = result.data

  const parsedTokens = tokens ? tokens.split(',') : undefined
  const parsedStrategies = strategies ? strategies.split(',') : undefined
  const parsedProtocols = protocols ? protocols.split(',') : undefined

  // condition to make sure that we pass empty array if userAddress is provided and strategies are not
  // it's needed for case when we want to get rebalance activity per user positions
  const resolvedStrategies = userAddress && !parsedStrategies ? [] : parsedStrategies

  return await getRebalanceActivityServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    tokens: parsedTokens,
    strategies: resolvedStrategies,
    protocols: parsedProtocols,
  })
}
