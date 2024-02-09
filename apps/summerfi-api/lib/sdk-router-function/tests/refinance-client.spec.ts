import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { Protocols, type Position, type PositionId, type Protocol } from '../src/sdk-mocks'
import type { AppRouter } from '../src/server'

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

describe('portfolio-overview utils', () => {
  it('should parse and return supported positions only - eth', async () => {
    const positionId: PositionId = '1'
    const position: Position = await sdkClient.getPosition.query({ positionId })
    expect(position).toStrictEqual({ positionId: '1' })
    const aaveV3: Protocol = await sdkClient.getProtocol.query({ protocolEnum: Protocols.AAVEv3 })
    expect(aaveV3).toStrictEqual({ protocolEnum: Protocols.AAVEv3 })

    // await sdkClient.getPool(aaveV3, poolparameters)
  })
})
