import { isChainInfo, type AddressValue, type IChainInfo } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isHex } from 'viem'

export const getMigratablePositionsApy = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<IChainInfo>(isChainInfo),
      positionIds: z.array(z.custom<AddressValue>((val) => isHex(val))),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.migrations.getMigratablePositionsApy(opts.input)
  })
