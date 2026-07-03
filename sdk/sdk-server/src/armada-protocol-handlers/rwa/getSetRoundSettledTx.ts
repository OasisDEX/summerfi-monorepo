import {
  isAddressValue,
  isChainId,
  RoundsVaultType,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

/** @see IRWAManager.getSetRoundSettledTx */
export const getSetRoundSettledTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      vaultType: z.nativeEnum(RoundsVaultType),
      roundId: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getSetRoundSettledTx(opts.input)
  })
