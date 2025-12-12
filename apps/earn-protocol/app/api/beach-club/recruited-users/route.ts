import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getBeachClubRecruitedUsersServerSide } from '@/app/server-handlers/raw-calls/beach-club/api'

const BeachClubRecruitedUsersQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  orderBy: z.enum(['asc', 'desc']).default('desc'),
  referralCode: z.string(),
})

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const result = BeachClubRecruitedUsersQueryParamsSchema.safeParse(searchParams)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters',
        details: result.error.issues,
      },
      { status: 400 },
    )
  }

  const { page, limit, orderBy, referralCode } = result.data

  return await getBeachClubRecruitedUsersServerSide({
    page,
    limit,
    orderBy,
    referralCode,
  })
}
