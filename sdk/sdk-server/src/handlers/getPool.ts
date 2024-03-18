import { z } from 'zod'
import { publicProcedure } from '../TRPC'
import {
  PriceService,
  TokenService,
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

    // TODO create client manager to set chain
    const client = createPublicClient({
      batch: {
        multicall: true,
      },
      chain: mainnet,
      transport: http(),
    })
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
