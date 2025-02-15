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
      where: z
        .object({
          asset_: z
            .object({
              symbol_in: z.array(z.string()),
            })
            .optional(),
          vault_: z
            .object({
              id_in: z.array(z.string()),
            })
            .optional(),
          or: z
            .array(
              z.object({
                from_: z
                  .object({
                    name_in: z.array(z.string()),
                  })
                  .optional(),
                to_: z
                  .object({
                    name_in: z.array(z.string()),
                  })
                  .optional(),
              }),
            )
            .optional(),
        })
        .optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getGlobalRebalancesRaw(opts.input)
  })
