import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { ChainFamilyMap, ChainInfo, ProtocolName } from '@summerfi/sdk-common'
import assert from 'assert'
import { MakerLendingPositionId } from '../../../src/plugins/maker/implementation/MakerLendingPositionId'
import { MakerProtocolPlugin } from '../../../src/plugins/maker/implementation/MakerProtocolPlugin'
import {
  IMakerLendingPoolId,
  IMakerLendingPoolIdData,
  isMakerLendingPoolId,
} from '../../../src/plugins/maker/interfaces/IMakerLendingPoolId'
import { getMakerPoolIdMock } from '../../mocks/MakerPoolIdMock'
import { createProtocolPluginContext } from '../../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../../utils/ErrorMessage'

describe('Maker Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let makerPoolIdMock: IMakerLendingPoolId
  let makerProtocolPlugin: MakerProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext(ChainFamilyMap.Ethereum.Mainnet)
    makerPoolIdMock = await getMakerPoolIdMock()
    makerProtocolPlugin = new MakerProtocolPlugin()
    makerProtocolPlugin.initialize({
      context: ctx,
    })
  })

  it('should verify that a given poolId is recognised as a valid format', () => {
    expect(isMakerLendingPoolId(makerPoolIdMock)).toBe(true)
  })

  it('should throw a specific error when provided with a poolId not matching the MakerPoolId format', async () => {
    try {
      const invalidMakerPoolId = {
        ...makerPoolIdMock,
        protocol: {
          ...makerPoolIdMock.protocol,
          name: ProtocolName.AaveV3,
        },
      } as unknown as IMakerLendingPoolIdData

      await expect(makerProtocolPlugin.getLendingPool(invalidMakerPoolId)).resolves.toBeDefined()
      assert.fail('Should throw error')
    } catch (error: unknown) {
      expect(getErrorMessage(error)).toMatch('Invalid Maker pool ID')
    }
  })

  it('should correctly return a MakerLendingPool object for a valid MakerPoolId', async () => {
    const makerPoolIdValid = makerPoolIdMock
    await expect(makerProtocolPlugin.getLendingPool(makerPoolIdValid)).resolves.toBeDefined()
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
    await expect(
      makerProtocolPlugin.getLendingPool(invalidMakerPoolIdUnsupportedChain),
    ).rejects.toThrow('Chain ID 2 is not supported')
  })

  it('should throw an error when calling getPool with chain id missing from ctx', async () => {
    try {
      new MakerProtocolPlugin().initialize({
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
      new MakerProtocolPlugin().initialize({
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
    const positionId = MakerLendingPositionId.createFrom({
      id: 'mockPositionId',
      vaultId: '123',
    })
    await expect(makerProtocolPlugin.getLendingPosition(positionId)).rejects.toThrow(
      'Not implemented',
    )
  })
})
