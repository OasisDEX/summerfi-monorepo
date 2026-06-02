import {
  isAddressValue,
  isChainId,
  RoundsVaultType,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCurrentRound = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      vaultType: z.nativeEnum(RoundsVaultType),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getCurrentRound(opts.input)
  })
