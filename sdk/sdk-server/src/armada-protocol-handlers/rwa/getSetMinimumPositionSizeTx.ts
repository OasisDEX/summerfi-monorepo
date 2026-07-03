import {
  isAddressValue,
  isChainId,
  RoundsVaultType,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

/** @see IRWAManager.getSetMinimumPositionSizeTx */
export const getSetMinimumPositionSizeTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      vaultType: z.nativeEnum(RoundsVaultType),
      minimumPositionSize: z.string(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getSetMinimumPositionSizeTx(opts.input)
  })
