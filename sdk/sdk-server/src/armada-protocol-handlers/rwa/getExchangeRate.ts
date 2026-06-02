import {
  isAddressValue,
  isChainId,
  RoundsVaultType,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getExchangeRate = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      roundId: z.bigint(),
      vaultType: z.nativeEnum(RoundsVaultType),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getExchangeRate(opts.input)
  })
