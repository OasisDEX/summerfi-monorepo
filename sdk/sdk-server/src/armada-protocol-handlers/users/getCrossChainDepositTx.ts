import {
  isArmadaVaultId,
  isChainId,
  isPercentage,
  isTokenAmount,
  isAddressValue,
  type ChainId,
  type IArmadaVaultId,
  type IPercentage,
  type ITokenAmount,
  type AddressValue,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCrossChainDepositTx = publicProcedure
  .input(
    z.object({
      fromChainId: z.custom<ChainId>(isChainId),
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      senderAddressValue: z.custom<AddressValue>(isAddressValue),
      receiverAddressValue: z.custom<AddressValue>(isAddressValue).optional(),
      amount: z.custom<ITokenAmount>(isTokenAmount),
      slippage: z.custom<IPercentage>(isPercentage),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.vaults.getCrossChainDepositTx(opts.input)
  })
