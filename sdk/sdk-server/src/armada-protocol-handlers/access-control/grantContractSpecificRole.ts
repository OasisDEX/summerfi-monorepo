import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ContractSpecificRoleName } from '@summerfi/contracts-provider-common'
import { isAddress, isChainId, type ChainId, type IAddress } from '@summerfi/sdk-common'

export const grantContractSpecificRole = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: z.nativeEnum(ContractSpecificRoleName),
      contractAddress: z.custom<IAddress>(isAddress),
      targetAddress: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.grantContractSpecificRole(opts.input)
  })
