import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { ChainInfo, IPositionId } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import assert from 'assert'
import {
  ISparkLendingPoolIdData,
  SparkProtocolPlugin,
  isSparkLendingPoolId,
} from '../../../src/plugins/spark'
import { sparkPoolIdMock } from '../../mocks/SparkPoolIdMock'
import { createProtocolPluginContext } from '../../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../../utils/ErrorMessage'

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
    expect(isSparkLendingPoolId(sparkPoolIdMock)).toBe(true)
  })

  it('should throw a specific error when provided with a poolId not matching the SparkPoolId format', async () => {
    try {
      const invalidSparkPoolIdMock = {
        ...sparkPoolIdMock,
        protocol: {
          ...sparkPoolIdMock.protocol,
          name: ProtocolName.Maker,
        },
      } as unknown as ISparkLendingPoolIdData

      await expect(
        sparkProtocolPlugin.getLendingPool(invalidSparkPoolIdMock),
      ).resolves.toBeDefined()
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('Invalid Spark pool ID')
    }
  })

  it('should correctly return a SparkLendingPool object for a valid SparkPoolId', async () => {
    const sparkPoolIdValid = sparkPoolIdMock
    await expect(sparkProtocolPlugin.getLendingPool(sparkPoolIdValid)).resolves.toBeDefined()
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
    await expect(
      sparkProtocolPlugin.getLendingPool(invalidSparkPoolIdUnsupportedChain),
    ).rejects.toThrow('Chain ID 2 is not supported')
  })

  it('should throw an error when calling getPool with chain id missing from ctx', async () => {
    try {
      new SparkProtocolPlugin({
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
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('ctx.provider.chain.id undefined')
    }
  })

  it('should throw an error when calling getPool with an unsupported chain ID', async () => {
    const wrongChainId = 2
    try {
      new SparkProtocolPlugin({
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
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch(`Chain ID ${wrongChainId} is not supported`)
    }
  })

  it('should throw a "Not implemented" error when calling getPosition', async () => {
    const positionId: IPositionId = {
      id: 'mockPositionId',
    }
    await expect(sparkProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented')
  })
})
