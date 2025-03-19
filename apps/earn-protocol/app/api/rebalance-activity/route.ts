import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getRebalanceActivityServerSide } from '@/app/server-handlers/tables-data/rebalance-activity/api'

const RebalanceActivityQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sortBy: z.enum(['timestamp', 'amount', 'amountUsd']).default('timestamp'),
  orderBy: z.enum(['asc', 'desc']).default('asc'),
  tokens: z.string().optional(),
  strategies: z.string().optional(),
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

  const { page, limit, sortBy, orderBy, tokens, strategies } = result.data

  const parsedTokens = tokens ? tokens.split(',') : undefined
  const parsedStrategies = strategies ? strategies.split(',') : undefined

  return await getRebalanceActivityServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    tokens: parsedTokens,
    strategies: parsedStrategies,
  })
}
