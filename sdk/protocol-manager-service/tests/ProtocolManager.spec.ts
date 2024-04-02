/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProtocolManager, IProtocolManagerContext } from '@summerfi/protocol-manager-common'
import {
  IProtocolPluginsRegistry,
  IProtocolPlugin,
  IProtocolPluginContext,
} from '@summerfi/protocol-plugins-common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ChainInfo } from '@summerfi/sdk-common/common'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { TokenService, PriceService, ProtocolPluginsRegistry } from '@summerfi/protocol-plugins'
import { MockContractProvider } from '@summerfi/protocol-plugins/mocks'
import { ProtocolManager } from '../src'

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
    })
    protocolManager = new ProtocolManager({ pluginsRegistry })
  })

  it('should throw an error when getPool is called with an unsupported protocol', async () => {
    await expect(
      protocolManager.getPool({ protocol: { name: 'unsupportedProtocol' } } as any),
    ).rejects.toThrow('Invalid pool ID: {"protocol":{"name":"unsupportedProtocol"}}')
  })

  it('should throw an error when getPool is called for a chain that is not supported by the plugin', async () => {
    const unsupportedChainId = 'unsupportedChain'
    ctx.provider.getChainId = jest.fn().mockResolvedValue(unsupportedChainId)
    await expect(
      protocolManager.getPool({ protocol: { name: ProtocolName.Spark } } as any),
    ).rejects.toThrow(`Invalid pool ID: {"protocol":{"name":"Spark"}}`)
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
        this.getPool = jest.fn().mockResolvedValue('mockPoolData')
      }
    }

    const mockPlugins = {
      [ProtocolName.Spark]: TestMockPlugin as unknown as ProtocolPluginConstructor,
    }

    const pluginsRegistry = new ProtocolPluginsRegistry({
      plugins: mockPlugins,
      context: ctx,
    })

    protocolManager = new ProtocolManager({ pluginsRegistry })

    const chainId = 'supportedChain'
    const poolId = {
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
    }

    ctx.provider.getChainId = jest.fn().mockResolvedValue(chainId)

    const pool = await protocolManager.getPool(poolId as any)
    expect(pool).toBe('mockPoolData')
  })

  it('should throw an error when getPosition is called as it is not implemented', () => {
    expect(() => protocolManager.getPosition()).toThrow('Not implemented')
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

  getPool = jest.fn()
  getPosition = jest.fn()
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
    tokenService: new TokenService(),
    priceService: new PriceService(provider),
    contractProvider: new MockContractProvider(),
  }
}
