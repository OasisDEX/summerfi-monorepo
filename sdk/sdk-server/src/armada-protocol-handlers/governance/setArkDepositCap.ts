import { IArmadaVaultId, isArmadaVaultId } from '@summerfi/armada-protocol-common'
import { ITokenAmount, isAddress, isTokenAmount, type IAddress } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setArkDepositCap = publicProcedure
  .input(
    z.object({
      vaultId: z.custom<IArmadaVaultId>(isArmadaVaultId),
      ark: z.custom<IAddress>(isAddress),
      cap: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setArkDepositCap(opts.input)
  })
