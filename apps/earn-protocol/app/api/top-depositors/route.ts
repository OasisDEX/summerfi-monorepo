import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getTopDepositorsServerSide } from '@/app/server-handlers/tables-data/top-depositors/api'

const TopDepositorsQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sortBy: z
    .enum([
      'balanceUsd',
      'balance',
      'changeSevenDays',
      'projectedOneYearEarningsUsd',
      'noOfDeposits',
    ])
    .default('balanceUsd'),
  orderBy: z.enum(['asc', 'desc']).default('asc'),
  userAddress: z.string().optional(),
  tokens: z.string().optional(),
  strategies: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const result = TopDepositorsQueryParamsSchema.safeParse(searchParams)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters',
        details: result.error.issues,
      },
      { status: 400 },
    )
  }

  const { page, limit, sortBy, orderBy, userAddress, tokens, strategies } = result.data

  const parsedTokens = tokens ? tokens.split(',') : undefined
  const parsedStrategies = strategies ? strategies.split(',') : undefined

  return await getTopDepositorsServerSide({
    page,
    limit,
    sortBy,
    orderBy,
    userAddress,
    tokens: parsedTokens,
    strategies: parsedStrategies,
  })
}
