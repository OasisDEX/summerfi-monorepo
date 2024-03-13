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
      protocol: z.custom<Protocol>((protocol) => protocol !== undefined),
      poolParameters: z.custom<PoolParameters>((poolParameter) => poolParameter !== undefined),
      protocolParameters: z
        .custom<Wallet>((protocolParameters) => protocolParameters !== undefined)
        .optional(),
    }),
  )
  .query(async (params) => {
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
