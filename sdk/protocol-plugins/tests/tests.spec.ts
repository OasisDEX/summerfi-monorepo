import { EmodeType, ILKType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { MakerProtocolPlugin, AaveV3ProtocolPlugin, SparkProtocolPlugin } from '../src'
import { IProtocolPluginContext } from '../src/interfaces/IProtocolPluginContext'
import { MockContractProvider } from '../src/mocks/mockContractProvider'
import { TokenService, PriceService } from '../src/implementation'

async function createProtocolPluginContext(): Promise<IProtocolPluginContext> {
  const provider: PublicClient = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: mainnet,
    transport: http(),
  })

  return {
    provider,
    tokenService: new TokenService(),
    priceService: new PriceService(provider),
    contractProvider: new MockContractProvider(),
  }
}

const SECONDS = 1000;
jest.setTimeout(2 * SECONDS)

describe('playground', () => {
  let ctx: IProtocolPluginContext
  beforeAll(async () => {
    ctx = await createProtocolPluginContext()
  })

  it('template/maker', async () => {
    const makerProtocolPlugin = new MakerProtocolPlugin()
    makerProtocolPlugin.init(ctx)
    await makerProtocolPlugin.getPool({
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
      ilkType: ILKType.ETH_A,
      vaultId: '123',
    })
  })

  it('template/spark', async () => {
    const sparkProtocolPlugin = new SparkProtocolPlugin()
    sparkProtocolPlugin.init(ctx)
    await sparkProtocolPlugin.getPool({
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
      emodeType: EmodeType.None,
    })
  })

  it('template/aave-v3', async () => {
    const aaveV3ProtocolPlugin = new AaveV3ProtocolPlugin()
    aaveV3ProtocolPlugin.init(ctx)
    await aaveV3ProtocolPlugin.getPool({
      protocol: {
        name: ProtocolName.AAVEv3,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
      emodeType: EmodeType.None,
    })
  })
})
