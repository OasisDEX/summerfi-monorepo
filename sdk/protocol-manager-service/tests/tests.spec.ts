import { ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'

import { MockContractProvider } from '@summerfi/protocol-plugins/mocks'
import { ProtocolManager } from '../src'
import { IProtocolManager, IProtocolManagerContext } from '@summerfi/protocol-manager-common'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import {
  ProtocolPluginsRegistry,
  TokenService,
  PriceService,
} from '@summerfi/protocol-plugins/implementation'
import { AaveV3ProtocolPlugin, AaveV3LendingPool } from '@summerfi/protocol-plugins/plugins/aave-v3'
import {
  MakerProtocolPlugin,
  MakerLendingPool,
  ILKType,
} from '@summerfi/protocol-plugins/plugins/maker'
import {
  SparkProtocolPlugin,
  SparkLendingPool,
  SparkPoolId,
} from '@summerfi/protocol-plugins/plugins/spark'
import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'

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

// TODO: re-enable with separate Ci workflow and http transport properly configured
describe.skip('playground', () => {
  let pluginsRegistry: IProtocolPluginsRegistry
  let protocolManager: IProtocolManager
  let ctx: IProtocolManagerContext
  beforeAll(async () => {
    ctx = await createProtocolManagerContext()

    pluginsRegistry = new ProtocolPluginsRegistry({
      plugins: {
        [ProtocolName.Maker]: MakerProtocolPlugin,
        [ProtocolName.Spark]: SparkProtocolPlugin,
        [ProtocolName.AAVEv3]: AaveV3ProtocolPlugin,
      },
      context: ctx,
    })

    protocolManager = new ProtocolManager({ pluginsRegistry })
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

    const result = (await protocolManager.getPool(makerPoolId)) as MakerLendingPool
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

    const result = (await protocolManager.getPool(sparkPoolId)) as SparkLendingPool
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

    const result = (await protocolManager.getPool(aaveV3PoolId)) as AaveV3LendingPool
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
