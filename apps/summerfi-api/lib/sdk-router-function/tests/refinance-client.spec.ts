/* eslint-disable turbo/no-undeclared-env-vars */
import { testAppRouter } from '~src/test-utils'
import { Protocols, type Position, type PositionId, type Protocol } from '~src/sdk-mocks'

describe('refinance client', () => {
  it('should get position by Id', async () => {
    const positionId: PositionId = '1'
    const position: Position = await testAppRouter.getPosition({
      positionId,
    })
    expect(position).toEqual({ positionId: '1' })
  })

  it('should get aaveV3 protocol by enum', async () => {
    const aaveV3: Protocol = await testAppRouter.getProtocol({ protocolEnum: Protocols.AAVEv3 })
    expect(aaveV3).toEqual({ protocolEnum: Protocols.AAVEv3 })
  })
})
