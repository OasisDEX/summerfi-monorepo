import {TokenService} from "@summerfi/protocol-plugins";
import {PriceService} from "@summerfi/protocol-plugins";
import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import {
  protocolManager,
  MockContractProvider,
} from '@summerfi/protocol-manager'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const getPool = publicProcedure
  .input(
    z.object({
      poolParameters: protocolManager.poolIdSchema,
    }),
  )
  .query(async (params) => {
    const poolParameters = params.input.poolParameters


    const tokenService = new TokenService()
    const priceService = new PriceService(client)
    const contractProvider = new MockContractProvider()

    return protocolManager.getPool(poolParameters, {
      provider: client,
      tokenService,
      priceService,
      contractProvider,
    })
  })
