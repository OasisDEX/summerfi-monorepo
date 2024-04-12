import { IProtocolPluginContext, IPositionId } from '@summerfi/protocol-plugins-common'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import assert from 'assert'
import { AaveV2ProtocolPlugin } from '../../src/plugins/aave-v2'
import { aaveV2PoolIdMock } from '../mocks/AaveV2PoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../utils/ErrorMessage'

describe('AaveV2 Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let aaveV2ProtocolPlugin: AaveV2ProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    aaveV2ProtocolPlugin = new AaveV2ProtocolPlugin({
      context: ctx,
    })
  })

  it('should verify that a given poolId is recognised as a valid format', () => {
    expect(aaveV2ProtocolPlugin.isPoolId(aaveV2PoolIdMock)).toBe(true)
  })

  it('should throw a specific error when provided with a poolId not matching the AaveV2PoolId format', () => {
    try {
      const invalidAaveV2PoolIdMock = {
        ...aaveV2PoolIdMock,
        protocol: {
          ...aaveV2PoolIdMock.protocol,
          name: ProtocolName.Maker,
        },
      }
      aaveV2ProtocolPlugin.validatePoolId(invalidAaveV2PoolIdMock)
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('Invalid AaveV2 pool ID')
    }
  })

  it('should throw an error when calling getPool with an unsupported Chain', async () => {
    const invalidAaveV2PoolIdUnsupportedChain = {
      ...aaveV2PoolIdMock,
      protocol: {
        ...aaveV2PoolIdMock.protocol,
        chainInfo: ChainInfo.createFrom({
          chainId: 2,
          name: 'Unknown',
        }),
      },
    }
    await expect(aaveV2ProtocolPlugin.getPool(invalidAaveV2PoolIdUnsupportedChain)).rejects.toThrow(
      'Invalid AaveV2 pool ID',
    )
  })

  it('should throw an error when calling getPool with chain id missing from ctx', async () => {
    const aaveV2ProtocolPluginWithWrongContext = new AaveV2ProtocolPlugin({
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
    await expect(aaveV2ProtocolPluginWithWrongContext.getPool(aaveV2PoolIdMock)).rejects.toThrow(
      `ctx.provider.chain.id undefined`,
    )
  })

  it('should throw an error when calling getPool with an unsupported chain ID', async () => {
    const wrongChainId = 2
    const aaveV2ProtocolPluginWithWrongContext = new AaveV2ProtocolPlugin({
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

    await expect(aaveV2ProtocolPluginWithWrongContext.getPool(aaveV2PoolIdMock)).rejects.toThrow(
      `Chain ID ${wrongChainId} is not supported`,
    )
  })

  it('should throw a "Not implemented" error when calling getPosition', async () => {
    const positionId = 'mockPositionId' as IPositionId
    await expect(aaveV2ProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented')
  })
})
