import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getUsersActivitiesServerSide } from '@/app/server-handlers/tables-data/users-activities/api'

const LatestActivityQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sortBy: z
    .enum(['timestamp', 'balance', 'balanceUsd', 'amount', 'amountUsd'])
    .default('timestamp'),
  orderBy: z.enum(['asc', 'desc']).default('desc'),
  actionType: z.enum(['deposit', 'withdraw']).optional(),
  userAddress: z.string().optional(),
  tokens: z.string().optional(),
  strategies: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const result = LatestActivityQueryParamsSchema.safeParse(searchParams)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters',
        details: result.error.issues,
      },
      { status: 400 },
    )
  }

  const { page, limit, sortBy, orderBy, actionType, userAddress, tokens, strategies } = result.data

  const parsedTokens = tokens ? tokens.split(',') : undefined
  const parsedStrategies = strategies ? strategies.split(',') : undefined

  return await getUsersActivitiesServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    actionType,
    userAddress,
    tokens: parsedTokens,
    strategies: parsedStrategies,
  })
}
