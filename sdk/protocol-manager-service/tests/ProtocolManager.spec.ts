/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProtocolManager, IProtocolManagerContext } from '@summerfi/protocol-manager-common'
import {
  IProtocolPluginsRegistry,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { AddressType, ChainInfo } from '@summerfi/sdk-common/common'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { ProtocolManager } from '../src'
import { ProtocolPluginsRegistry } from '@summerfi/protocol-plugins/implementation'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { EmodeType, ISparkLendingPoolIdData } from '@summerfi/protocol-plugins'

describe('Protocol Manager', () => {
  let ctx: IProtocolManagerContext
  let pluginsRegistry: IProtocolPluginsRegistry
  let protocolManager: IProtocolManager
  let mockPlugins: Partial<Record<ProtocolName, ProtocolPluginConstructor>>

  beforeEach(async () => {
    ctx = await createProtocolManagerContext()
    mockPlugins = {
      [ProtocolName.Spark]: MockPlugin as unknown as ProtocolPluginConstructor,
      [ProtocolName.Maker]: MockPlugin as unknown as ProtocolPluginConstructor,
    }
    pluginsRegistry = new ProtocolPluginsRegistry({
      plugins: mockPlugins,
      context: ctx,
      deploymentConfigTag: 'standard',
    })
    protocolManager = ProtocolManager.createWith({ pluginsRegistry })
  })

  it('should throw an error when getPool is called with an unsupported protocol', async () => {
    await expect(
      protocolManager.getLendingPool({ protocol: { name: 'unsupportedProtocol' } } as any),
    ).rejects.toThrow('Invalid lending pool ID: {"protocol":{"name":"unsupportedProtocol"}}')
  })

  it('should throw an error when getPool is called for a chain that is not supported by the plugin', async () => {
    const unsupportedChainId = 'unsupportedChain'
    ctx.provider.getChainId = jest.fn().mockResolvedValue(unsupportedChainId)
    await expect(
      protocolManager.getLendingPool({ protocol: { name: ProtocolName.Spark } } as any),
    ).rejects.toThrow(`Invalid lending pool ID: {"protocol":{"name":"Spark"}}`)
  })

  it('should retrieve the pool using the correct plugin and chain ID', async () => {
    const ctx = await createProtocolManagerContext()

    class TestMockPlugin extends MockPlugin {
      constructor(params: {
        protocolName: ProtocolName
        context: IProtocolPluginContext
        __overrides?: { schema?: any; supportedChains?: any[] }
      }) {
        super(params)
        this.protocolName = ProtocolName.Spark
        this.getLendingPool = jest.fn().mockResolvedValue('mockPoolData')
      }
    }

    const mockPlugins = {
      [ProtocolName.Spark]: TestMockPlugin as unknown as ProtocolPluginConstructor,
    }

    const pluginsRegistry = new ProtocolPluginsRegistry({
      plugins: mockPlugins,
      context: ctx,
      deploymentConfigTag: 'standard',
    })

    protocolManager = ProtocolManager.createWith({ pluginsRegistry })

    const chainId = 'supportedChain'
    const poolId: ISparkLendingPoolIdData = {
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
      collateralToken: {
        address: {
          type: AddressType.Ethereum,
          value: '0x6b175474e89094c44da98b954eedeac495271d0f',
        },
        chainInfo: { chainId: 1, name: 'Ethereum' },
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      debtToken: {
        address: {
          type: AddressType.Ethereum,
          value: '0x6b175474e89094c44da98b954eedeac495271d0f',
        },
        chainInfo: { chainId: 1, name: 'Ethereum' },
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      emodeType: EmodeType.None,
    }

    ctx.provider.getChainId = jest.fn().mockResolvedValue(chainId)

    const pool = await protocolManager.getLendingPool(poolId as any)
    expect(pool).toBe('mockPoolData')
  })
})

export type ProtocolPluginConstructor = new (params: {
  context: IProtocolPluginContext
}) => IProtocolPlugin

class MockPlugin implements IProtocolPlugin {
  protocolName: ProtocolName
  schema: any
  supportedChains: any[]
  stepBuilders: object
  readonly context: IProtocolPluginContext

  constructor(params: {
    protocolName: ProtocolName
    context: IProtocolPluginContext
    __overrides?: { schema?: any; supportedChains?: any[] }
  }) {
    this.protocolName = params.protocolName
    this.context = params.context
    this.schema = params.__overrides?.schema ?? {}
    this.supportedChains = params.__overrides?.supportedChains ?? []
    this.stepBuilders = {}
  }

  getLendingPool = jest.fn()
  getLendingPoolInfo = jest.fn()
  getPosition = jest.fn()
  getImportPositionTransaction = jest.fn()
  // @ts-ignore
  isPoolId = jest.fn()
  validatePoolId = jest.fn()
  getActionBuilder = jest.fn()
  ctx = () => this.context
}

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
    tokensManager: {} as any,
    oracleManager: {} as any,
    deployments: {} as DeploymentIndex,
    swapManager: {} as any,
  }
}
