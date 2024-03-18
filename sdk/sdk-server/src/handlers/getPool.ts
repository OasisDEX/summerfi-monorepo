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
      poolId: protocolManager.poolIdSchema,
    }),
  )
  .query(async (params) => {
    const poolId = params.input.poolId

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

    return protocolManager.getPool(poolId, {
      provider: client,
      tokenService,
      priceService,
      contractProvider,
    })
  })
