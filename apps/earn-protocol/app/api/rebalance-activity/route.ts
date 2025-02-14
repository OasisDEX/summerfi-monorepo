import type {
  OrderDirection,
  Rebalance_OrderBy as OrderBy,
} from '@summerfi/subgraph-manager-common'
import { type NextRequest } from 'next/server'
import { z } from 'zod'

import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'

const querySchema = z.object({
  first: z.coerce.number().int().min(1).max(100).default(10),
  skip: z.coerce.number().int().min(0).default(0),
  orderBy: z.enum(['timestamp', 'id']).default('timestamp') as z.ZodType<OrderBy>,
  orderDirection: z.enum(['asc', 'desc']).default('desc') as z.ZodType<OrderDirection>,
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
      first: validatedParams.first,
      skip: validatedParams.skip,
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
