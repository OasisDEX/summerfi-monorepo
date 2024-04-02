import { IProtocolPluginContext, IPositionId } from '@summerfi/protocol-plugins-common'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import assert from 'assert'
import { MakerProtocolPlugin } from '../../src/plugins/maker'
import { makerPoolIdMock } from '../mocks/MakerPoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../utils/ErrorMessage'

describe('Maker Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let makerProtocolPlugin: MakerProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    makerProtocolPlugin = new MakerProtocolPlugin({
      context: ctx,
    })
  })

  it('should verify that a given poolId is recognised as a valid format', () => {
    expect(makerProtocolPlugin.isPoolId(makerPoolIdMock)).toBe(true)
  })

  it('should throw a specific error when provided with a poolId not matching the MakerPoolId format', () => {
    try {
      const invalidMakerPoolId = {
        ...makerPoolIdMock,
        protocol: {
          ...makerPoolIdMock.protocol,
          name: ProtocolName.AAVEv3,
        },
      }
      makerProtocolPlugin.validatePoolId(invalidMakerPoolId)
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('Invalid Maker pool ID')
    }
  })

  it('should correctly initialize and set the context', () => {
    expect(makerProtocolPlugin.ctx).toBe(ctx)
  })

  it('should correctly return a MakerLendingPool object for a valid MakerPoolId', async () => {
    const makerPoolIdValid = makerPoolIdMock
    await expect(makerProtocolPlugin.getPool(makerPoolIdValid)).resolves.toBeDefined()
  })

  it('should throw an error when calling getPool with an unsupported ChainInfo', async () => {
    const invalidMakerPoolIdUnsupportedChain = {
      ...makerPoolIdMock,
      protocol: {
        ...makerPoolIdMock.protocol,
        chainInfo: ChainInfo.createFrom({
          chainId: 2,
          name: 'Unknown',
        }),
      },
    }
    await expect(makerProtocolPlugin.getPool(invalidMakerPoolIdUnsupportedChain)).rejects.toThrow(
      'Invalid Maker pool ID',
    )
  })

  it('should throw an error when calling getPool with chain id missing from ctx', async () => {
    const makerProtocolPluginWithWrongContext = new MakerProtocolPlugin({
      context: {
        ...ctx,
        provider: {
          ...ctx.provider,
          chain: {
            ...ctx.provider.chain!,
            id: undefined as unknown as number,
          },
        },
      },
    })
    await expect(makerProtocolPluginWithWrongContext.getPool(makerPoolIdMock)).rejects.toThrow(
      `ctx.provider.chain.id undefined`,
    )
  })

  it('should throw an error when calling getPool with an unsupported chain ID', async () => {
    const wrongChainId = 2
    const makerProtocolPluginWithWrongContext = new MakerProtocolPlugin({
      context: {
        ...ctx,
        provider: {
          ...ctx.provider,
          chain: {
            ...ctx.provider.chain!,
            id: wrongChainId,
          },
        },
      },
    })

    await expect(makerProtocolPluginWithWrongContext.getPool(makerPoolIdMock)).rejects.toThrow(
      `Chain ID ${wrongChainId} is not supported`,
    )
  })

  it('should throw a "Not implemented" error when calling getPosition', async () => {
    const positionId = 'mockPositionId' as IPositionId
    await expect(makerProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented')
  })
})
