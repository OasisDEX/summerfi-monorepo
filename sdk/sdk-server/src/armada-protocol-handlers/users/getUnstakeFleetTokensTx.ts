import {
  isArmadaVaultId,
  isChainId,
  isAddressValue,
  type IArmadaVaultId,
  type ChainId,
  type AddressValue,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getUnstakeFleetTokensTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      addressValue: z.custom<AddressValue>(isAddressValue),
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      amount: z.string().optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.utils.getUnstakeFleetTokensTx(opts.input)
  })
