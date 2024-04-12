import { IProtocolPluginContext, IPositionId } from '@summerfi/protocol-plugins-common'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import assert from 'assert'
import { AaveV3ProtocolPlugin } from '../../src/plugins/aave-v3'
import { aaveV3PoolIdMock } from '../mocks/AaveV3PoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../utils/ErrorMessage'

describe('AAVEv3 Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let aaveV3ProtocolPlugin: AaveV3ProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    aaveV3ProtocolPlugin = new AaveV3ProtocolPlugin({
      context: ctx,
    })
  })

  it('should verify that a given poolId is recognised as a valid format', () => {
    expect(aaveV3ProtocolPlugin.isPoolId(aaveV3PoolIdMock)).toBe(true)
  })

  it('should throw a specific error when provided with a poolId not matching the AAVEv3PoolId format', () => {
    try {
      const invalidAaveV3PoolIdMock = {
        ...aaveV3PoolIdMock,
        protocol: {
          ...aaveV3PoolIdMock.protocol,
          name: ProtocolName.Maker,
        },
      }
      aaveV3ProtocolPlugin.validatePoolId(invalidAaveV3PoolIdMock)
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('Invalid AaveV3 pool ID')
    }
  })

  it('should throw an error when calling getPool with an unsupported Chain', async () => {
    const invalidAaveV3PoolIdUnsupportedChain = {
      ...aaveV3PoolIdMock,
      protocol: {
        ...aaveV3PoolIdMock.protocol,
        chainInfo: ChainInfo.createFrom({
          chainId: 2,
          name: 'Unknown',
        }),
      },
    }
    await expect(aaveV3ProtocolPlugin.getPool(invalidAaveV3PoolIdUnsupportedChain)).rejects.toThrow(
      'Invalid AaveV3 pool ID',
    )
  })

  it('should throw an error when calling getPool with chain id missing from ctx', async () => {
    const aaveV3ProtocolPluginWithWrongContext = new AaveV3ProtocolPlugin({
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
    await expect(aaveV3ProtocolPluginWithWrongContext.getPool(aaveV3PoolIdMock)).rejects.toThrow(
      `ctx.provider.chain.id undefined`,
    )
  })

  it('should throw an error when calling getPool with an unsupported chain ID', async () => {
    const wrongChainId = 2
    const aaveV3ProtocolPluginWithWrongContext = new AaveV3ProtocolPlugin({
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

    await expect(aaveV3ProtocolPluginWithWrongContext.getPool(aaveV3PoolIdMock)).rejects.toThrow(
      `Chain ID ${wrongChainId} is not supported`,
    )
  })

  it('should throw a "Not implemented" error when calling getPosition', async () => {
    const positionId = 'mockPositionId' as IPositionId
    await expect(aaveV3ProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented')
  })
})
