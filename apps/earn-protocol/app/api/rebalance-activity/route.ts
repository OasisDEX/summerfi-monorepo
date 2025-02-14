import { OrderDirection, Rebalance_OrderBy as OrderBy } from '@summerfi/subgraph-manager-common'
import { type NextRequest } from 'next/server'
import { z } from 'zod'

import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'

const querySchema = z.object({
  first: z.string(),
  skip: z.string().optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
  orderDirection: z.nativeEnum(OrderDirection).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)

    const result = querySchema.safeParse(searchParams)

    if (!result.success) {
      return Response.json(
        {
          error: 'Invalid parameters',
          details: result.error.issues,
        },
        { status: 400 },
      )
    }

    const validatedParams = result.data

    const rebalanceData = await getGlobalRebalances({
      first: Number(validatedParams.first),
      skip: validatedParams.skip ? Number(validatedParams.skip) : undefined,
      orderBy: validatedParams.orderBy,
      orderDirection: validatedParams.orderDirection,
    })

    return Response.json(rebalanceData)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching global rebalances:', error)

    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
