import { ChainInfo } from '@summerfi/sdk-common/common'
import { ILKType, ProtocolName, EmodeType, SparkPoolId } from '@summerfi/sdk-common/protocols'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { protocolManager } from '../src/implementation/ProtocolManager'
import { IProtocolManagerContext } from '../src/interfaces/IProtocolManagerContext'
import { TokenService, PriceService } from '@summerfi/protocol-plugins/'
import { MockContractProvider } from '@summerfi/protocol-plugins/mocks'

async function createProtocolManagerContext(): Promise<IProtocolManagerContext> {
  const RPC_URL = process.env['MAINNET_RPC_URL'] || ''
  const provider: PublicClient = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: mainnet,
    transport: http(RPC_URL),
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
      vaultId: '123',
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

  it('template/spark', async () => {
    const sparkPoolId: SparkPoolId = {
      protocol: {
        name: ProtocolName.Spark as const,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
      emodeType: EmodeType.None,
    } as SparkPoolId

    protocolManager.init(ctx)
    const result = await protocolManager.getPool(sparkPoolId)
    console.log(`
  SPARK POOL
  ----------------
  Protocol: ${result.protocol.name}
  Chain: ${result.protocol.chainInfo.name}
  ${result.baseCurrency.toString()}}
  ${JSON.stringify(result.collaterals, null, 4)}
  `)
  })

  it('template/aave-v3', async () => {
    const aaveV3PoolId = {
      protocol: {
        name: ProtocolName.AAVEv3 as const,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
      emodeType: EmodeType.None,
    }

    protocolManager.init(ctx)
    const result = await protocolManager.getPool(aaveV3PoolId)
    console.log(`
  AAVE V3 POOL
  ----------------
  Protocol: ${result.protocol.name}
  Chain: ${result.protocol.chainInfo.name}}
  ${result.baseCurrency.toString()}}
  ${JSON.stringify(result.collaterals, null, 4)}
  `)
  })
})
