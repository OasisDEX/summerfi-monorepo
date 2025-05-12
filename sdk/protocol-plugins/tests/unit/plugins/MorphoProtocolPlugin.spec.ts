import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { ChainFamilyMap, ChainInfo, ProtocolName } from '@summerfi/sdk-common'
import assert from 'assert'
import { MorphoLendingPositionId } from '../../../src'
import { MorphoProtocolPlugin } from '../../../src/plugins/morphoblue/implementation/MorphoProtocolPlugin'
import {
  IMorphoLendingPoolIdData,
  isMorphoLendingPoolId,
} from '../../../src/plugins/morphoblue/interfaces/IMorphoLendingPoolId'
import { morphoPoolIdMock } from '../../mocks/MorphoPoolIdMock'
import { createProtocolPluginContext } from '../../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../../utils/ErrorMessage'

describe('Protocol Plugin | Unit | Morpho', () => {
  let ctx: IProtocolPluginContext
  let morphoProtocolPlugin: MorphoProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext(ChainFamilyMap.Ethereum.Mainnet)
    morphoProtocolPlugin = new MorphoProtocolPlugin()
    morphoProtocolPlugin.initialize({
      context: ctx,
    })
  })

  it('should verify that a given poolId is recognised as a valid format', () => {
    expect(isMorphoLendingPoolId(morphoPoolIdMock)).toBe(true)
  })

  it('should throw a specific error when provided with a poolId not matching the MorphoPoolId format', async () => {
    try {
      const invalidMorphoPoolIdMock = {
        ...morphoPoolIdMock,
        protocol: {
          ...morphoPoolIdMock.protocol,
          name: ProtocolName.Maker,
        },
      } as unknown as IMorphoLendingPoolIdData

      expect(await morphoProtocolPlugin.getLendingPool(invalidMorphoPoolIdMock)).toBeDefined()
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('Invalid Morpho pool ID')
    }
  })

  it('should correctly return a MorphoLendingPool object for a valid MorphoPoolId', async () => {
    expect(await morphoProtocolPlugin.getLendingPool(morphoPoolIdMock)).toBeDefined()
  })

  it('should throw an error when calling getPool with an unsupported ChainInfo', async () => {
    const invalidMorphoPoolIdUnsupportedChain = {
      ...morphoPoolIdMock,
      protocol: {
        ...morphoPoolIdMock.protocol,
        chainInfo: ChainInfo.createFrom({
          chainId: 146,
          name: 'Unknown',
        }),
      },
    }
    await expect(
      morphoProtocolPlugin.getLendingPool(invalidMorphoPoolIdUnsupportedChain),
    ).rejects.toThrow('Chain ID 146 is not supported')
  })

  it('should throw an error when calling getPool with chain id missing from ctx', async () => {
    try {
      new MorphoProtocolPlugin().initialize({
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
      new MorphoProtocolPlugin().initialize({
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
    const positionId = MorphoLendingPositionId.createFrom({
      id: 'mockPositionId',
    })

    await expect(morphoProtocolPlugin.getLendingPosition(positionId)).rejects.toThrow(
      'Not implemented',
    )
  })
})
