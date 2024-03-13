import {
  ProtocolPlugin,
  ProtocolManagerContext,
} from '../src/index'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName, EmodeType, ILKType } from "@summerfi/sdk-common/protocols"
import { protocolManager } from '../src/implementation/ProtocolManager'
import { PriceService } from '../src/implementation/PriceService'
import { TokenService } from '../src/implementation/TokenService'

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
  }
}

describe('playground', () => {
  let ctx: ProtocolManagerContext
  beforeAll(async () => {
    ctx = await createProtocolManagerContext()

    it.only('template/maker', async () => {
      // const result = await makerPlugin.getPool(makerPlugin.getPoolId("ETH-A"))
      const result = await protocolManager.getPool({
        protocol: {
          name: ProtocolName.Maker,
          chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
        },
        ilkType: ILKType.ETH_A
      }, ctx)
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
      // const result = await sparkPlugin.getPool(sparkPlugin.getPoolId("0"))
      const result = await protocolManager.getPool({
        protocol: {
          name: ProtocolName.Spark,
          chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
        },
        emodeType: EmodeType.None
      }, ctx)
      // console.log(result)
    })
  })
})
