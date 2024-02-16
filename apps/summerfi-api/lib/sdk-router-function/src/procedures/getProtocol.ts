import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { mockProtocolSpark } from '@summerfi/sdk/mocks'
import type { Chain } from '@summerfi/sdk/chains'
import type { PositionId } from '@summerfi/sdk/users'
import type { Wallet } from '@summerfi/sdk/common'

type ProtocolParams = ConstructorParameters<typeof mockProtocolSpark>

export const getProtocol = publicProcedure
  .input(
    z.object({
      id: z.custom<PositionId>((id) => id !== undefined),
      chain: z.custom<Chain>((chain) => chain !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
    }),
  )
  .query(async (opts) => {
    // get position from chain / graph
    const params: ProtocolParams = opts.input
    return await mockProtocolSpark(params)
  })
