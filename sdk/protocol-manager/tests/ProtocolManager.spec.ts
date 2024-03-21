import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import {z} from "zod";
import {ProtocolManager} from '../src/implementation/ProtocolManager'
import { IProtocolManagerContext } from '../src/interfaces/IProtocolManagerContext'
import { TokenService, PriceService } from '@summerfi/protocol-plugins/'
import { MockContractProvider } from '@summerfi/protocol-plugins/mocks'

describe('Protocol Manager', () => {
  let ctx: IProtocolManagerContext;
  let protocolManager: ProtocolManager<any[]>;
  let mockPlugins = [
    createMockPlugin(ProtocolName.Spark),
    createMockPlugin(ProtocolName.Maker),
  ];

  beforeEach(async () => {
    ctx = await createProtocolManagerContext();
    mockPlugins = [
      createMockPlugin(ProtocolName.Spark),
      createMockPlugin(ProtocolName.Maker),
    ];
    protocolManager = new ProtocolManager(mockPlugins as any[]);
  });

  it('should initialize plugins with the context', () => {
    protocolManager.init(ctx);
    // Verify that all plugins' init method was called with ctx
    for (const plugin of mockPlugins) {
      expect(plugin.init).toHaveBeenCalledWith(ctx);
    }
  });

  it('should retrieve the correct ctx after initialization', () => {
    protocolManager.init(ctx);
    expect(protocolManager.ctx).toBe(ctx);
  });

  it('should return a valid poolIdSchema after initialization', async () => {
    const ctx = await createProtocolManagerContext();
    const mockPlugins = [
      createMockPlugin(ProtocolName.Spark, { schema: z.object({ fieldA: z.string() }) }),
      createMockPlugin(ProtocolName.Maker, {schema: z.object({ fieldB: z.string() })}),
    ];
    protocolManager = new ProtocolManager(mockPlugins as any[]);
    protocolManager.init(ctx);
    const schema = protocolManager.poolIdSchema;

    expect(schema.safeParse({
      fieldA: "test",
      fieldB: "test"
    }).success).toEqual(true)
  });

  it('should throw an error when getPool is called with an unsupported protocol', async () => {
    protocolManager.init(ctx);
    await expect(protocolManager.getPool({ protocol: { name: 'unsupportedProtocol' } } as any))
        .rejects
        .toThrow('No plugin found for protocol: unsupportedProtocol');
  });

  it('should throw an error when getPool is called for a chain that is not supported by the plugin', async () => {
    protocolManager.init(ctx);
    const unsupportedChainId = 'unsupportedChain';
    ctx.provider.getChainId = jest.fn().mockResolvedValue(unsupportedChainId);
    await expect(protocolManager.getPool({ protocol: { name: ProtocolName.Spark } } as any))
        .rejects
        .toThrow(`Chain ${unsupportedChainId} is not supported by plugin ${ProtocolName.Spark}`);
  });

  it('should retrieve the pool using the correct plugin and chain ID', async () => {
    const ctx = await createProtocolManagerContext();
    const mockPlugins = [
      createMockPlugin(ProtocolName.Spark, {supportedChains: [{chainId: 'supportedChain'}] } ),
    ];
    protocolManager = new ProtocolManager(mockPlugins as any[]);
    protocolManager.init(ctx);

    const chainId = 'supportedChain';
    const poolId = { protocol: { name: ProtocolName.Spark } };

    ctx.provider.getChainId = jest.fn().mockResolvedValue(chainId);
    mockPlugins[0].getPool = jest.fn().mockResolvedValue('mockPoolData');

    const pool = await protocolManager.getPool(poolId as any);
    expect(pool).toBe('mockPoolData');
  });

  it('should throw an error when getPosition is called as it is not implemented', () => {
    expect(() => protocolManager.getPosition()).toThrow('Not implemented');
  });
});

function createMockPlugin(protocolName: ProtocolName, __overrides?: { schema?: any, supportedChains?: any[] }) {
  const plugin = {
    protocol: protocolName,
    init: jest.fn(),
    schema: __overrides?.schema ?? {},
    supportedChains: __overrides?.supportedChains ?? [],
    getPool: jest.fn(),
    getPosition: jest.fn(),
    isPoolId: jest.fn(),
    getActionBuilder: jest.fn(),
    StepBuilders: {},
    _ctx: undefined,
    ctx: jest.fn()
  };
  return plugin;
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
