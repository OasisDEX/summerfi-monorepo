import { IProtocolPluginContext, IPositionId } from '@summerfi/protocol-plugins-common'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import assert from 'assert'
import { CompoundV3ProtocolPlugin } from '../../src/plugins/compound-v3'
import { compoundV3PoolIdMock } from '../mocks/CompoundV3PoolIdMock'
import { createProtocolPluginContext } from '../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../utils/ErrorMessage'

describe.only('CompoundV3 Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let compoundV3ProtocolPlugin: CompoundV3ProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
    compoundV3ProtocolPlugin = new CompoundV3ProtocolPlugin({
      context: ctx,
    })
  })

  it('should verify that a given poolId is recognised as a valid format', () => {
    expect(compoundV3ProtocolPlugin.isPoolId(compoundV3PoolIdMock)).toBe(true)
  })

  it('should throw a specific error when provided with a poolId not matching the CompoundV3PoolId format', () => {
    try {
      const invalidCompoundV3PoolIdMock = {
        ...compoundV3PoolIdMock,
        protocol: {
          ...compoundV3PoolIdMock.protocol,
          name: ProtocolName.Maker,
        },
      }
      compoundV3ProtocolPlugin.validatePoolId(invalidCompoundV3PoolIdMock)
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('Invalid CompoundV3 pool ID')
    }
  })

  it('should throw an error when calling getPool with an unsupported Chain', async () => {
    const invalidCompoundV3PoolIdUnsupportedChain = {
      ...compoundV3PoolIdMock,
      protocol: {
        ...compoundV3PoolIdMock.protocol,
        chainInfo: ChainInfo.createFrom({
          chainId: 2,
          name: 'Unknown',
        }),
      },
    }
    await expect(compoundV3ProtocolPlugin.getPool(invalidCompoundV3PoolIdUnsupportedChain)).rejects.toThrow(
      'Invalid CompoundV3 pool ID',
    )
  })

  it('should throw an error when calling getPool with chain id missing from ctx', async () => {
    const compoundV3ProtocolPluginWithWrongContext = new CompoundV3ProtocolPlugin({
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
    await expect(compoundV3ProtocolPluginWithWrongContext.getPool(compoundV3PoolIdMock)).rejects.toThrow(
      `ctx.provider.chain.id undefined`,
    )
  })

  it('should throw an error when calling getPool with an unsupported chain ID', async () => {
    const wrongChainId = 2
    const compoundV3ProtocolPluginWithWrongContext = new CompoundV3ProtocolPlugin({
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

    await expect(compoundV3ProtocolPluginWithWrongContext.getPool(compoundV3PoolIdMock)).rejects.toThrow(
      `Chain ID ${wrongChainId} is not supported`,
    )
  })

  it('should throw a "Not implemented" error when calling getPosition', async () => {
    const positionId = 'mockPositionId' as IPositionId
    await expect(compoundV3ProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented')
  })
})
