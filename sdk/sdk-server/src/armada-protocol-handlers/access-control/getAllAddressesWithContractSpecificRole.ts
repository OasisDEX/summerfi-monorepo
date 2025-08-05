import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { ContractSpecificRoleName } from '@summerfi/contracts-provider-common'
import { isAddress, isChainId, type ChainId, type IAddress } from '@summerfi/sdk-common'

export const getAllAddressesWithContractSpecificRole = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      role: z.nativeEnum(ContractSpecificRoleName),
      contractAddress: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.getAllAddressesWithContractSpecificRole(opts.input)
  })
