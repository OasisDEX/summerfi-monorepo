/* eslint-disable turbo/no-undeclared-env-vars */
import { zeroAddress } from '@summerfi/common'
import { ChainFamilyMap } from '@summerfi/sdk/chains'
import { Wallet } from '@summerfi/sdk/common'
import { makeSDK } from '@summerfi/sdk/entrypoint'
import type { PositionId } from '@summerfi/sdk/users'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '~src/app-router'

/**
 * Client
 */
if (process.env.SDK_API_URL === undefined) {
  throw new Error('SDK_API_URL is required')
}
export const sdkClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.SDK_API_URL + '/api/sdk',
    }),
  ],
})

describe('Refinance Client-Server Communication', () => {
  const wallet = Wallet.createFrom({ hexValue: zeroAddress })

  it('Refinance flow', async () => {
    const sdk = makeSDK()

    const positionId: PositionId = {
      id: '1',
    }
    const chain = await sdk.chains.getChain({
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    })
    const position = await sdkClient.getPosition.query({
      id: positionId,
      chain,
      wallet,
    })
    position?.positionId
    // todo
  })
})
