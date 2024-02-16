/* eslint-disable turbo/no-undeclared-env-vars */
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '~src/app-router'

import { AAVEv3, LendingPoolParameters } from '@summerfi/sdk/protocols'
import { RefinanceOrder } from '@summerfi/sdk/orders'
import { TokenAmount, Percentage } from '@summerfi/sdk/types'

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

describe('Refinance flow e2e', () => {
  it('should get position and protocol', async () => {
    const positionId = '1'
    // const prevPosition: Position = user.getPosition(positionId)

    const position: Position = await sdkClient.getPosition.query({ positionId })
    expect(position).toEqual({ positionId: '1' })

    const aaveV3: Protocol = await sdkClient.getProtocol.query({ protocolEnum: Protocols.AAVEv3 })
    expect(aaveV3).toEqual({ protocolEnum: Protocols.AAVEv3 })
  })
})
