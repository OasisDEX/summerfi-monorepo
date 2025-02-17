import { OrderDirection, Rebalance_OrderBy as OrderBy } from '@summerfi/subgraph-manager-common'
import { type NextRequest } from 'next/server'
import { z } from 'zod'

import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'

const querySchema = z.object({
  first: z.string(),
  skip: z.string().optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
  orderDirection: z.nativeEnum(OrderDirection).optional(),
  tokenSymbols: z
    .string()
    .optional()
    .transform((str) => (str ? str.split(',') : undefined)),
  strategy: z
    .string()
    .optional()
    .transform((str) => (str ? str.split(',') : undefined)),
  protocol: z
    .string()
    .optional()
    .transform((str) => (str ? str.split(',') : undefined)),
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

    const resolvedOrderBy = {
      [OrderBy.Amount]: OrderBy.AmountUsd,
      [OrderBy.Timestamp]: OrderBy.Timestamp,
    }[validatedParams.orderBy as OrderBy.Amount | OrderBy.Timestamp] as
      | OrderBy.AmountUsd
      | OrderBy.Timestamp

    const rebalanceData = await getGlobalRebalances({
      first: Number(validatedParams.first),
      skip: validatedParams.skip ? Number(validatedParams.skip) : undefined,
      orderBy: resolvedOrderBy,
      orderDirection: validatedParams.orderDirection,
      tokenSymbols: validatedParams.tokenSymbols,
      strategy: validatedParams.strategy,
      protocol: validatedParams.protocol,
    })

    return Response.json(rebalanceData)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching global rebalances:', error)

    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
