import { IProtocolPluginContext, IPositionId } from '@summerfi/protocol-plugins-common'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import assert from 'assert'
import { SparkProtocolPlugin } from '../../src'
import { sparkPoolIdMock } from '../mocks/SparkPoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../utils/ErrorMessage'

describe('Spark Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let sparkProtocolPlugin: SparkProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    sparkProtocolPlugin = new SparkProtocolPlugin({
      context: ctx,
    })
  })

  it('should verify that a given poolId is recognised as a valid format', () => {
    expect(sparkProtocolPlugin.isPoolId(sparkPoolIdMock)).toBe(true)
  })

  it('should throw a specific error when provided with a poolId not matching the SparkPoolId format', () => {
    try {
      const invalidSparkPoolIdMock = {
        ...sparkPoolIdMock,
        protocol: {
          ...sparkPoolIdMock.protocol,
          name: ProtocolName.Maker,
        },
      }
      sparkProtocolPlugin.validatePoolId(invalidSparkPoolIdMock)
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('Invalid Spark pool ID')
    }
  })

  it('should correctly initialize and set the context', () => {
    expect(sparkProtocolPlugin.ctx).toBe(ctx)
  })

  it('should correctly return a SparkLendingPool object for a valid SparkPoolId', async () => {
    const sparkPoolIdValid = sparkPoolIdMock
    await expect(sparkProtocolPlugin.getPool(sparkPoolIdValid)).resolves.toBeDefined()
  })

  it('should throw an error when calling getPool with an unsupported ChainInfo', async () => {
    const invalidSparkPoolIdUnsupportedChain = {
      ...sparkPoolIdMock,
      protocol: {
        ...sparkPoolIdMock.protocol,
        chainInfo: ChainInfo.createFrom({
          chainId: 2,
          name: 'Unknown',
        }),
      },
    }
    await expect(sparkProtocolPlugin.getPool(invalidSparkPoolIdUnsupportedChain)).rejects.toThrow(
      'Invalid Spark pool ID',
    )
  })

  it('should throw an error when calling getPool with chain id missing from ctx', async () => {
    const sparkProtocolPluginWithWrongContext = new SparkProtocolPlugin({
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
    await expect(sparkProtocolPluginWithWrongContext.getPool(sparkPoolIdMock)).rejects.toThrow(
      `ctx.provider.chain.id undefined`,
    )
  })

  it('should throw an error when calling getPool with an unsupported chain ID', async () => {
    const wrongChainId = 2
    const sparkProtocolPluginWithWrongContext = new SparkProtocolPlugin({
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

    await expect(sparkProtocolPluginWithWrongContext.getPool(sparkPoolIdMock)).rejects.toThrow(
      `Chain ID ${wrongChainId} is not supported`,
    )
  })

  it('should throw a "Not implemented" error when calling getPosition', async () => {
    const positionId = 'mockPositionId' as IPositionId
    await expect(sparkProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented')
  })
})
