import {ChainInfo} from '@summerfi/sdk-common/common'
import {EmodeType, ILKType, ProtocolName} from "@summerfi/sdk-common/protocols"
import {createPublicClient, http} from 'viem'
import {mainnet} from 'viem/chains'
import {PriceService} from '../src/implementation/PriceService'
import {protocolManager} from '../src/implementation/ProtocolManager'
import {TokenService} from '../src/implementation/TokenService'
import {aaveV3Plugin, ProtocolManagerContext, sparkPlugin,} from '../src/index'
import {MockContractProvider} from "../src/mocks/mockContractProvider";


async function createProtocolManagerContext(): Promise<ProtocolManagerContext> {
  const provider = createPublicClient({
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
    contractProvider: new MockContractProvider()
  }
}

describe('playground', () => {
  let ctx: ProtocolManagerContext
  beforeAll(async () => {
    ctx = await createProtocolManagerContext()
  })

  it('template/maker', async () => {
    const makerPoolId = {
      protocol: {
        name: ProtocolName.Maker as const,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
      },
      ilkType: ILKType.ETH_A
    }
    const result = await protocolManager.getPool(makerPoolId, ctx)
    console.log(`
  MAKER POOL
  ----------------
  Protocol: ${result.protocol.name}
  Chain: ${result.protocol.chainInfo.name}
  IlkType: ${JSON.stringify(result.poolId)}
  ${result.baseCurrency.toString()}}
  ${JSON.stringify(result.collaterals, null, 4)}
  `)
  })

  it('template/spark', async () => {
    const result = await sparkPlugin.getPool({
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
      },
      emodeType: EmodeType.None
    }, ctx)
    console.log(result)
  })

  it('template/aave-v3', async () => {
    const result = await aaveV3Plugin.getPool({
      protocol: {
        name: ProtocolName.AAVEv3,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
      },
      emodeType: EmodeType.None
    }, ctx)
    console.log(result)
  })
})
