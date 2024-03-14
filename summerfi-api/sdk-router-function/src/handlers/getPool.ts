import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import type { PoolParameters, Protocol } from '@summerfi/sdk-common/protocols'
import type { Wallet } from '@summerfi/sdk-common/common'
import { PriceService, TokenService, protocolManager } from '@summerfi/protocol-manager'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const getPool = publicProcedure
  .input(
    z.object({
      poolParameters: z.custom<PoolParameters>((poolParameter) => poolParameter !== undefined),
    }),
  )
  .query(async (params) => {
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

    return protocolManager.getPool(params.input.poolParameters, {
      provider: client,
      tokenService,
      priceService,
    })
  })
