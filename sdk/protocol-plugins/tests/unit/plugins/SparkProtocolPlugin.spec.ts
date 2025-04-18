import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { ChainFamilyMap, ChainInfo, ProtocolName } from '@summerfi/sdk-common'
import assert from 'assert'
import { SparkLendingPositionId } from '../../../src/plugins/spark/implementation/SparkLendingPositionId'
import { SparkProtocolPlugin } from '../../../src/plugins/spark/implementation/SparkProtocolPlugin'
import {
  ISparkLendingPoolId,
  ISparkLendingPoolIdData,
  isSparkLendingPoolId,
} from '../../../src/plugins/spark/interfaces/ISparkLendingPoolId'
import { getSparkPoolIdMock } from '../../mocks/SparkPoolIdMock'
import { createProtocolPluginContext } from '../../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../../utils/ErrorMessage'

describe('Spark Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let sparkPoolIdMock: ISparkLendingPoolId
  let sparkProtocolPlugin: SparkProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext(ChainFamilyMap.Ethereum.Mainnet)
    sparkPoolIdMock = await getSparkPoolIdMock()
    sparkProtocolPlugin = new SparkProtocolPlugin()
    sparkProtocolPlugin.initialize({
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
      new SparkProtocolPlugin().initialize({
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
      new SparkProtocolPlugin().initialize({
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
    const positionId = SparkLendingPositionId.createFrom({
      id: 'mockPositionId',
    })
    await expect(sparkProtocolPlugin.getLendingPosition(positionId)).rejects.toThrow(
      'Not implemented',
    )
  })
})
