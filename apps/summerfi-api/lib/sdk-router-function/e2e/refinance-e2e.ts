/* eslint-disable turbo/no-undeclared-env-vars */
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

describe('refinance e2e', () => {
  it('should get position by Id', async () => {
    const positionId: PositionId = '1'
    const position: Position = await sdkClient.getPosition.query({ positionId })
    expect(position).toEqual({ positionId: '1' })
  })
  it('should get aaveV3 protocol by enum', async () => {
    const aaveV3: Protocol = await sdkClient.getProtocol.query({ protocolEnum: Protocols.AAVEv3 })
    expect(aaveV3).toEqual({ protocolEnum: Protocols.AAVEv3 })
  })
})
