import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ChainInfo, isChainInfo } from '@summerfi/sdk-common'
import { OrderDirection, Rebalance_OrderBy } from '@summerfi/subgraph-manager-common'

export const getGlobalRebalancesRaw = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>(isChainInfo),
      first: z.number().optional(),
      skip: z.number().optional(),
      orderBy: z.nativeEnum(Rebalance_OrderBy).optional(),
      orderDirection: z.nativeEnum(OrderDirection).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getGlobalRebalancesRaw(opts.input)
  })
