import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, isAddressValue, isChainId, ChainId } from '@summerfi/sdk-common'

export const getAuthorizeAsMerklRewardsOperatorTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      user: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.merklRewards.getAuthorizeAsMerklRewardsOperatorTx(
      opts.input,
    )
  })
