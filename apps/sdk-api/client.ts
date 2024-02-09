import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { Protocols, type Position, type PositionId, type Protocol } from './sdk'
import type { AppRouter } from './server'

/**
 * Client
 */

export const sdkClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
})

const positionId: PositionId = '1'
const position: Position = await sdkClient.getPosition.query({ positionId })
const aaveV3: Protocol = await sdkClient.getProtocol.query({ protocolEnum: Protocols.AAVEv3 })
await sdkClient.getPool(aaveV3, poolparameters)
