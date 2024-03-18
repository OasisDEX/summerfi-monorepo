import { ChainInfo } from '@summerfi/sdk-common/common'
import { ILKType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { protocolManager } from '../src/implementation/ProtocolManager'
import { IProtocolManagerContext } from "../src/interfaces/IProtocolManagerContext";
import { TokenService, PriceService } from '@summerfi/protocol-plugins'
import { MockContractProvider } from '@summerfi/protocol-plugins/mocks'

async function createProtocolManagerContext(): Promise<IProtocolManagerContext> {
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

describe('playground', () => {
  let ctx: IProtocolManagerContext
  beforeAll(async () => {
    ctx = await createProtocolManagerContext()
  })

  it('template/maker', async () => {
    const makerPoolId = {
      protocol: {
        name: ProtocolName.Maker as const,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
      ilkType: ILKType.ETH_A,
    }
    protocolManager.init(ctx)
    const result = await protocolManager.getPool(makerPoolId)
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
})
