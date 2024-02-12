/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable turbo/no-undeclared-env-vars */
import { Protocols, type Position, type PositionId, type Protocol } from '~src/sdk-mocks'
import { appRouter, createCallerFactory } from '~src/server'
import { createContext } from '~src/createContext'

describe('refinance client', () => {
  const createCaller = createCallerFactory(appRouter)
  const ctx = createContext({} as any)
  const caller = createCaller(ctx)

  it('should get position by Id', async () => {
    const positionId: PositionId = '1'
    const position: Position = await caller.getPosition({
      positionId,
    })
    expect(position).toEqual({ positionId: '1' })
  })

  it('should get aaveV3 protocol by enum', async () => {
    const aaveV3: Protocol = await caller.getProtocol({ protocolEnum: Protocols.AAVEv3 })
    expect(aaveV3).toEqual({ protocolEnum: Protocols.AAVEv3 })
  })
})
