import {
  isAddressValue,
  isChainId,
  RoundsVaultType,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

/** @see IRWAManager.getCancelRoundDepositTx */
export const getCancelRoundDepositTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      userAddress: z.custom<AddressValue>(isAddressValue),
      roundId: z.bigint(),
      amount: z.string(),
      receiverAddress: z.custom<AddressValue>(isAddressValue).optional(),
      vaultType: z.nativeEnum(RoundsVaultType),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getCancelRoundDepositTx(opts.input)
  })
