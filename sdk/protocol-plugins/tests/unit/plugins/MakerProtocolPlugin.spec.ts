import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { ChainFamilyMap, ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import assert from 'assert'
import { MakerProtocolPlugin } from '../../../src/plugins/maker'
import { getMakerPoolIdMock } from '../../mocks/MakerPoolIdMock'
import { createProtocolPluginContext } from '../../utils/CreateProtocolPluginContext'
import { getErrorMessage } from '../../utils/ErrorMessage'
import {
  IMakerLendingPoolId,
  IMakerLendingPoolIdData,
  isMakerLendingPoolId,
} from '../../../src/plugins/maker/interfaces/IMakerLendingPoolId'

describe('Maker Protocol Plugin', () => {
  let ctx: IProtocolPluginContext
  let makerPoolIdMock: IMakerLendingPoolId
  let makerProtocolPlugin: MakerProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolPluginContext(ChainFamilyMap.Ethereum.Mainnet)
    makerPoolIdMock = await getMakerPoolIdMock()
    makerProtocolPlugin = new MakerProtocolPlugin({
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
          name: ProtocolName.AAVEv3,
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
      new MakerProtocolPlugin({
        context: {
          ...ctx,
          provider: {
            ...context.provider,
            chain: {
              ...context.provider.chain!,
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
      new MakerProtocolPlugin({
        context: {
          ...ctx,
          provider: {
            ...context.provider,
            chain: {
              ...context.provider.chain!,
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
    const positionId = {
      id: 'mockPositionId',
    }
    await expect(makerProtocolPlugin.getPosition(positionId)).rejects.toThrow('Not implemented')
  })
})
