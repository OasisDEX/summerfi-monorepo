import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import {
  ArmadaDcaOrderStatusEnum,
  type AddressValue,
  type ChainId,
  type HexData,
  type IArmadaDcaOrder,
  type IArmadaDcaStrategyConfig,
  TransactionType,
  Token,
  TokenAmount,
  Address,
  getChainInfoByChainId,
} from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ArmadaManagerDCA, type DbOrderRow } from '../src/common/implementation/ArmadaManagerDCA'
import { DCAStrategyManagerAbi } from '../src/common/implementation/abi/DCAStrategyManagerAbi'
import type { SummerProtocolDb } from '../src/db-provider/getDb'

const DEFAULT_CHAIN_ID = 8453 as ChainId
const FROM_VAULT = '0x1111111111111111111111111111111111111111' as AddressValue
const TO_VAULT = '0x2222222222222222222222222222222222222222' as AddressValue
const ADMIRALS_QUARTERS = '0x3333333333333333333333333333333333333333' as AddressValue
const ENSO_ROUTER = '0x4444444444444444444444444444444444444444' as AddressValue
const STRATEGY_MANAGER = '0x5555555555555555555555555555555555555555' as AddressValue
const IN_ASSET_FEED = '0x6666666666666666666666666666666666666666' as AddressValue
const OUT_ASSET_FEED = '0x7777777777777777777777777777777777777777' as AddressValue

const TEST_SIGNER_PRIVATE_KEY =
  '0x0000000000000000000000000000000000000000000000000000000000000001' as HexData

const UNDERLYING_ASSET = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as AddressValue

const USDC_TOKEN = Token.createFrom({
  chainInfo: getChainInfoByChainId(DEFAULT_CHAIN_ID),
  address: Address.createFromEthereum({ value: UNDERLYING_ASSET }),
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
})
const TEST_AMOUNT = TokenAmount.createFrom({ token: USDC_TOKEN, amount: '1' })
const TEST_STRATEGY_CONFIG: IArmadaDcaStrategyConfig = {
  strategyId: '1',
  owner: '0x6666666666666666666666666666666666666666' as AddressValue,
  sourceVault: FROM_VAULT,
  targetVault: TO_VAULT,
  inAsset: UNDERLYING_ASSET,
  outAsset: '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB' as AddressValue,
  inAssetFeed: '0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC' as AddressValue,
  outAssetFeed: '0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD' as AddressValue,
  tradeAmount: '1000000',
  interval: '3600',
  slippageBps: '50',
  maxPrice: '200000000',
  minPrice: '100000000',
  endDate: '1800000000',
  maxTrades: '10',
}

// Order fixture used by the strategy transaction tests
const TEST_DCA_ORDER: IArmadaDcaOrder = {
  id: 'strategy-test',
  orderId: 'strategy-test-ext',
  userAddress: '0x6666666666666666666666666666666666666666' as AddressValue,
  chainId: DEFAULT_CHAIN_ID,
  fromVault: FROM_VAULT,
  toVault: TO_VAULT,
  amount: '1000000',
  slippage: '0.5',
  intervalSeconds: 3600,
  nextExecutionAtUnixTimestamp: 1700000000,
  deadlineUnixTimestamp: 1800000000,
  maxTrades: 10,
  tradesExecuted: 0,
  allowedVaultsRoot:
    '0x0000000000000000000000000000000000000000000000000000000000000000' as HexData,
  fromVaultProof: [] as HexData[],
  toVaultProof: [] as HexData[],
  swapCalldata: '0x' as HexData,
  signature: '0x' as HexData,
  ensoRouterAddress: ENSO_ROUTER,
  verifyingContractAddress: ADMIRALS_QUARTERS,
  status: ArmadaDcaOrderStatusEnum.Active,
  createdAt: 1700000000,
  updatedAt: 1700000000,
  neverBuyAbove: '200000000',
  neverSellBelow: '100000000',
  inAsset: FROM_VAULT,
  outAsset: TO_VAULT,
  inAssetFeed: IN_ASSET_FEED,
  outAssetFeed: OUT_ASSET_FEED,
}

function createBlockchainClientProviderMock(): IBlockchainClientProvider {
  const readContract = jest.fn(({ functionName }: { functionName: string }) => {
    switch (functionName) {
      case 'getActiveFleetCommanders':
        return [FROM_VAULT, TO_VAULT]
      case 'asset':
        return UNDERLYING_ASSET
      case 'decimals':
        return 6
      case 'symbol':
        return 'USDC'
      default:
        return null
    }
  })
  return {
    getBlockchainClient: jest.fn(() => ({ readContract })),
  } as unknown as IBlockchainClientProvider
}

function createOracleManagerMock(): IOracleManager {
  return {
    getSpotPrice: jest.fn().mockResolvedValue({ price: { value: '10' } }),
  } as unknown as IOracleManager
}

function createConfigProviderMock(): IConfigurationProvider {
  return {
    getConfigurationItem: ({ name }) => {
      if (name === 'ENSO_ROUTER_ADDRESS') {
        return ENSO_ROUTER
      }
      return undefined
    },
  } as IConfigurationProvider
}

function createManager(params: {
  summerProtocolDbProvider: () => Promise<SummerProtocolDb>
}): ArmadaManagerDCA {
  return new ArmadaManagerDCA({
    configProvider: createConfigProviderMock(),
    deploymentProvider: {
      getDeployedContractAddress: jest.fn(() => ({ value: ADMIRALS_QUARTERS })),
    } as never,
    summerProtocolDbProvider: params.summerProtocolDbProvider,
    blockchainClientProvider: createBlockchainClientProviderMock(),
    oracleManager: createOracleManagerMock(),
  })
}

describe('ArmadaManagerDCA', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should persist createAndSaveBuyOrder with injected db provider', async () => {
    const executeTakeFirstOrThrow = jest.fn().mockResolvedValue({})
    const values = jest.fn().mockReturnValue({ executeTakeFirstOrThrow })
    const insertInto = jest.fn().mockReturnValue({ values })

    const dbProvider = jest.fn(async () => ({
      insertInto,
    }))

    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })
    const managerInternals = manager as unknown as {
      _fetchEnsoSwapCalldata: (params: unknown) => Promise<HexData>
    }

    jest.spyOn(managerInternals, '_fetchEnsoSwapCalldata').mockResolvedValue('0xabcd' as HexData)

    const account = privateKeyToAccount(TEST_SIGNER_PRIVATE_KEY)
    const order = await manager.createAndSaveBuyOrder({
      id: 'order-1',
      orderId: 'external-order-1',
      userAddress: account.address as AddressValue,
      chainId: DEFAULT_CHAIN_ID,
      fromVault: FROM_VAULT,
      toVault: TO_VAULT,
      rebalanceAuthorizationSignature: '0x1234' as HexData,
      amountShares: TEST_AMOUNT,
      slippagePercentage: '0.5',
      intervalSeconds: 3600,
      firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
      maxTrades: 10,
      inAsset: FROM_VAULT,
      outAsset: TO_VAULT,
      inAssetFeed: IN_ASSET_FEED,
      outAssetFeed: OUT_ASSET_FEED,
    })

    expect(order.id).toBeDefined()
    expect(dbProvider).toHaveBeenCalledTimes(1)
    expect(insertInto).toHaveBeenCalledWith('armadaDcaOrders')
    expect(values).toHaveBeenCalledTimes(1)
    expect(executeTakeFirstOrThrow).toHaveBeenCalledTimes(1)
  })

  it('should return undefined from getBuyOrder when row does not exist', async () => {
    const query = {
      selectAll: jest.fn(),
      where: jest.fn(),
      executeTakeFirst: jest.fn().mockResolvedValue(undefined),
    }
    query.selectAll.mockReturnValue(query)
    query.where.mockReturnValue(query)

    const dbProvider = jest.fn(async () => ({
      selectFrom: jest.fn().mockReturnValue(query),
    }))

    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })

    const result = await manager.getBuyOrder({
      orderId: 'missing-order',
      userAddress: '0x5555555555555555555555555555555555555555' as AddressValue,
    })

    expect(result).toBeUndefined()
    expect(query.where).toHaveBeenCalledTimes(2)
  })

  it('should map and filter rows in getBuyOrders', async () => {
    const rows: DbOrderRow[] = [
      {
        id: 'order-1',
        orderId: 'external-order-1',
        userAddress: '0x6666666666666666666666666666666666666666',
        chainId: DEFAULT_CHAIN_ID,
        fromVault: FROM_VAULT,
        toVault: TO_VAULT,
        amount: '1',
        slippage: '0.5',
        intervalSeconds: 3600,
        nextExecutionAt: '1700000000',
        deadline: '1700003600',
        allowedVaultsRoot: '0xaaa',
        fromVaultProof: ['0xbbb'],
        toVaultProof: ['0xccc'],
        swapCalldata: '0xddd',
        signature: '0xeee',
        ensoRouterAddress: ENSO_ROUTER,
        verifyingContractAddress: ADMIRALS_QUARTERS,
        status: 'active',
        createdAt: '1700000000',
        updatedAt: '1700000000',
        cancelledAt: null,
        pausedAt: null,
        maxTrades: 10,
        tradesExecuted: 0,
        neverBuyAbove: null,
        neverSellBelow: null,
        inAsset: FROM_VAULT,
        outAsset: TO_VAULT,
        inAssetFeed: IN_ASSET_FEED,
        outAssetFeed: OUT_ASSET_FEED,
      },
    ]

    const query = {
      selectAll: jest.fn(),
      where: jest.fn(),
      orderBy: jest.fn(),
      execute: jest.fn().mockResolvedValue(rows),
    }
    query.selectAll.mockReturnValue(query)
    query.where.mockReturnValue(query)
    query.orderBy.mockReturnValue(query)

    const dbProvider = jest.fn(async () => ({
      selectFrom: jest.fn().mockReturnValue(query),
    }))

    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })

    const result = await manager.getBuyOrders({
      userAddress: rows[0].userAddress as AddressValue,
      chainId: DEFAULT_CHAIN_ID,
      status: ArmadaDcaOrderStatusEnum.Active,
    })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('order-1')
    expect(result[0].nextExecutionAtUnixTimestamp).toBe(1700000000)
    expect(query.where).toHaveBeenCalledTimes(3)
    expect(query.orderBy).toHaveBeenCalledWith('createdAt desc')
  })

  it('should cancel existing order and persist cancellation in db', async () => {
    const account = privateKeyToAccount(TEST_SIGNER_PRIVATE_KEY)
    const orderId = 'order-cancel'
    const signedMessage = `I want to cancel ${orderId}.`
    const signature = await account.signMessage({ message: signedMessage })

    const existingRow: DbOrderRow = {
      id: orderId,
      orderId: orderId,
      userAddress: account.address,
      chainId: DEFAULT_CHAIN_ID,
      fromVault: FROM_VAULT,
      toVault: TO_VAULT,
      amount: '1',
      slippage: '0.5',
      intervalSeconds: 3600,
      nextExecutionAt: '1700000000',
      deadline: '1700003600',
      allowedVaultsRoot: '0xaaa',
      fromVaultProof: ['0xbbb'],
      toVaultProof: ['0xccc'],
      swapCalldata: '0xddd',
      signature: '0xeee',
      ensoRouterAddress: ENSO_ROUTER,
      verifyingContractAddress: ADMIRALS_QUARTERS,
      status: 'active',
      createdAt: '1700000000',
      updatedAt: '1700000000',
      cancelledAt: null,
      pausedAt: null,
      maxTrades: 10,
      tradesExecuted: 0,
      neverBuyAbove: null,
      neverSellBelow: null,
      inAsset: FROM_VAULT,
      outAsset: TO_VAULT,
      inAssetFeed: IN_ASSET_FEED,
      outAssetFeed: OUT_ASSET_FEED,
    }

    const selectQuery = {
      selectAll: jest.fn(),
      where: jest.fn(),
      executeTakeFirst: jest.fn().mockResolvedValue(existingRow),
    }
    selectQuery.selectAll.mockReturnValue(selectQuery)
    selectQuery.where.mockReturnValue(selectQuery)

    const updateQuery = {
      set: jest.fn(),
      where: jest.fn(),
      executeTakeFirstOrThrow: jest.fn().mockResolvedValue({}),
    }
    updateQuery.set.mockReturnValue(updateQuery)
    updateQuery.where.mockReturnValue(updateQuery)

    const dbProvider = jest.fn(async () => ({
      selectFrom: jest.fn().mockReturnValue(selectQuery),
      updateTable: jest.fn().mockReturnValue(updateQuery),
    }))

    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })

    const result = await manager.cancelBuyOrder({
      orderId,
      userAddress: account.address as AddressValue,
    })

    expect(result.status).toBe(ArmadaDcaOrderStatusEnum.Cancelled)
    expect(updateQuery.set).toHaveBeenCalledTimes(1)
    expect(updateQuery.executeTakeFirstOrThrow).toHaveBeenCalledTimes(1)
  })

  it('should reject cancellation with invalid cancellation message', async () => {
    const manager = createManager({
      summerProtocolDbProvider: async () => ({}) as SummerProtocolDb,
    })

    await expect(
      manager.cancelBuyOrder({
        orderId: 'order-1',
        userAddress: '0x7777777777777777777777777777777777777777' as AddressValue,
      }),
    ).rejects.toThrow('Invalid cancel message')
  })

  it('should build strategy config transactions', async () => {
    // Use a deployment provider that returns STRATEGY_MANAGER for dcaStrategyManager
    const manager = new ArmadaManagerDCA({
      configProvider: createConfigProviderMock(),
      deploymentProvider: {
        getDeployedContractAddress: jest.fn(({ contractName }: { contractName: string }) => {
          if (contractName === 'dcaStrategyManager') return { value: STRATEGY_MANAGER }
          return { value: ADMIRALS_QUARTERS }
        }),
      } as never,
      summerProtocolDbProvider: async () => ({}) as SummerProtocolDb,
      blockchainClientProvider: createBlockchainClientProviderMock(),
      oracleManager: createOracleManagerMock(),
    })

    // _orderToStrategyConfig derives inAsset/outAsset from fromVault/toVault
    const baseExpectedConfig = {
      owner: TEST_DCA_ORDER.userAddress,
      sourceVault: FROM_VAULT,
      targetVault: TO_VAULT,
      inAsset: FROM_VAULT,
      outAsset: TO_VAULT,
      tradeAmount: 1000000n,
      interval: 3600n,
      slippageBps: 50n,
      maxPrice: 200000000n,
      minPrice: 100000000n,
      endDate: 1800000000n,
      maxTrades: 10n,
    }

    const createTx = await manager.createStrategyTx({
      chainId: DEFAULT_CHAIN_ID,
      userAddress: TEST_DCA_ORDER.userAddress,
      fromVault: TEST_DCA_ORDER.fromVault,
      toVault: TEST_DCA_ORDER.toVault,
      inAsset: TEST_DCA_ORDER.inAsset,
      outAsset: TEST_DCA_ORDER.outAsset,
      inAssetFeed: TEST_DCA_ORDER.inAssetFeed,
      outAssetFeed: TEST_DCA_ORDER.outAssetFeed,
      amountShares: TEST_DCA_ORDER.amount,
      slippagePercentage: TEST_DCA_ORDER.slippage,
      intervalSeconds: TEST_DCA_ORDER.intervalSeconds,
      maxTrades: TEST_DCA_ORDER.maxTrades,
      neverBuyAbove: TEST_DCA_ORDER.neverBuyAbove,
      neverSellBelow: TEST_DCA_ORDER.neverSellBelow,
      deadlineUnixTimestamp: TEST_DCA_ORDER.deadlineUnixTimestamp,
    })
    const editTx = await manager.editStrategyTx({
      chainId: DEFAULT_CHAIN_ID,
      order: TEST_DCA_ORDER,
      strategyId: '1',
    })
    const resumeTx = await manager.resumeStrategyTx({
      chainId: DEFAULT_CHAIN_ID,
      order: TEST_DCA_ORDER,
      strategyId: '1',
    })
    const executeTx = await manager.executeDCATx({
      chainId: DEFAULT_CHAIN_ID,
      order: TEST_DCA_ORDER,
      strategyId: '1',
    })

    expect(createTx.type).toBe(TransactionType.CreateStrategy)
    expect(createTx.transaction.target.value).toBe(STRATEGY_MANAGER)
    expect(createTx.transaction.calldata).toBe(
      encodeFunctionData({
        abi: DCAStrategyManagerAbi,
        functionName: 'createStrategy',
        args: [
          {
            ...baseExpectedConfig,
            strategyId: 0n,
            inAssetFeed: IN_ASSET_FEED,
            outAssetFeed: OUT_ASSET_FEED,
          },
        ],
      }),
    )

    expect(editTx.type).toBe(TransactionType.EditStrategy)
    expect(editTx.transaction.calldata).toBe(
      encodeFunctionData({
        abi: DCAStrategyManagerAbi,
        functionName: 'editStrategy',
        args: [
          {
            ...baseExpectedConfig,
            strategyId: 1n,
            inAssetFeed: IN_ASSET_FEED,
            outAssetFeed: OUT_ASSET_FEED,
          },
        ],
      }),
    )

    expect(resumeTx.type).toBe(TransactionType.ResumeStrategy)
    expect(resumeTx.transaction.calldata).toBe(
      encodeFunctionData({
        abi: DCAStrategyManagerAbi,
        functionName: 'resumeStrategy',
        args: [
          {
            ...baseExpectedConfig,
            strategyId: 1n,
            inAssetFeed: IN_ASSET_FEED,
            outAssetFeed: OUT_ASSET_FEED,
          },
        ],
      }),
    )

    expect(executeTx.type).toBe(TransactionType.ExecuteDCA)
    expect(executeTx.transaction.calldata).toBe(
      encodeFunctionData({
        abi: DCAStrategyManagerAbi,
        functionName: 'executeDCA',
        args: [
          {
            ...baseExpectedConfig,
            strategyId: 1n,
            inAssetFeed: IN_ASSET_FEED,
            outAssetFeed: OUT_ASSET_FEED,
          },
          TEST_DCA_ORDER.swapCalldata,
        ],
      }),
    )
  })

  it('should build strategy id transactions', async () => {
    const manager = new ArmadaManagerDCA({
      configProvider: createConfigProviderMock(),
      deploymentProvider: {
        getDeployedContractAddress: jest.fn(({ contractName }: { contractName: string }) => {
          if (contractName === 'dcaStrategyManager') return { value: STRATEGY_MANAGER }
          return { value: ADMIRALS_QUARTERS }
        }),
      } as never,
      summerProtocolDbProvider: async () => ({}) as SummerProtocolDb,
      blockchainClientProvider: createBlockchainClientProviderMock(),
      oracleManager: createOracleManagerMock(),
    })

    const pauseTx = await manager.pauseStrategyTx({
      chainId: DEFAULT_CHAIN_ID,
      strategyId: '42',
    })
    const cancelTx = await manager.cancelStrategyTx({
      chainId: DEFAULT_CHAIN_ID,
      strategyId: '42',
    })

    expect(pauseTx.type).toBe(TransactionType.PauseStrategy)
    expect(pauseTx.transaction.target.value).toBe(STRATEGY_MANAGER)
    expect(pauseTx.transaction.calldata).toBe(
      encodeFunctionData({
        abi: DCAStrategyManagerAbi,
        functionName: 'pauseStrategy',
        args: [42n],
      }),
    )

    expect(cancelTx.type).toBe(TransactionType.CancelStrategy)
    expect(cancelTx.transaction.target.value).toBe(STRATEGY_MANAGER)
    expect(cancelTx.transaction.calldata).toBe(
      encodeFunctionData({
        abi: DCAStrategyManagerAbi,
        functionName: 'cancelStrategy',
        args: [42n],
      }),
    )
  })

  it('should persist orderId in values on createAndSaveBuyOrder', async () => {
    let capturedValues: Record<string, unknown> | undefined
    const executeTakeFirstOrThrow = jest.fn().mockResolvedValue({})
    const values = jest.fn().mockImplementation((v: Record<string, unknown>) => {
      capturedValues = v
      return { executeTakeFirstOrThrow }
    })
    const insertInto = jest.fn().mockReturnValue({ values })

    const dbProvider = jest.fn(async () => ({ insertInto }))
    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })
    const managerInternals = manager as unknown as {
      _fetchEnsoSwapCalldata: (params: unknown) => Promise<HexData>
    }
    jest.spyOn(managerInternals, '_fetchEnsoSwapCalldata').mockResolvedValue('0xabcd' as HexData)

    const account = privateKeyToAccount(TEST_SIGNER_PRIVATE_KEY)
    await manager.createAndSaveBuyOrder({
      id: 'order-persist',
      orderId: 'ext-order-persist',
      userAddress: account.address as AddressValue,
      chainId: DEFAULT_CHAIN_ID,
      fromVault: FROM_VAULT,
      toVault: TO_VAULT,
      rebalanceAuthorizationSignature: '0x1234' as HexData,
      amountShares: TEST_AMOUNT,
      slippagePercentage: '0.5',
      intervalSeconds: 3600,
      firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
      maxTrades: 10,
    })

    expect(capturedValues?.orderId).toBe('ext-order-persist')
  })

  it('should map orderId from db row in returned order', async () => {
    const row: DbOrderRow = {
      id: 'order-map',
      orderId: 'ext-order-map',
      userAddress: '0x6666666666666666666666666666666666666666',
      chainId: DEFAULT_CHAIN_ID,
      fromVault: FROM_VAULT,
      toVault: TO_VAULT,
      amount: '1',
      slippage: '0.5',
      intervalSeconds: 3600,
      nextExecutionAt: '1700000000',
      deadline: null,
      allowedVaultsRoot: '0xaaa',
      fromVaultProof: ['0xbbb'],
      toVaultProof: ['0xccc'],
      swapCalldata: '0xddd',
      signature: '0xeee',
      ensoRouterAddress: ENSO_ROUTER,
      verifyingContractAddress: ADMIRALS_QUARTERS,
      status: 'active',
      createdAt: '1700000000',
      updatedAt: '1700000000',
      cancelledAt: null,
      pausedAt: null,
      maxTrades: 10,
      tradesExecuted: 0,
      neverBuyAbove: null,
      neverSellBelow: null,
    }

    const query = {
      selectAll: jest.fn(),
      where: jest.fn(),
      executeTakeFirst: jest.fn().mockResolvedValue(row),
    }
    query.selectAll.mockReturnValue(query)
    query.where.mockReturnValue(query)

    const dbProvider = jest.fn(async () => ({
      selectFrom: jest.fn().mockReturnValue(query),
    }))

    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })

    const result = await manager.getBuyOrder({
      orderId: 'order-map',
      userAddress: row.userAddress as AddressValue,
    })

    expect(result).toBeDefined()
    expect(result?.orderId).toBe('ext-order-map')
  })

  it('should update mutable fields and preserve tradesExecuted on editBuyOrder', async () => {
    const account = privateKeyToAccount(TEST_SIGNER_PRIVATE_KEY)

    const existingRow: DbOrderRow = {
      id: 'order-edit',
      orderId: 'ext-order-edit',
      userAddress: account.address,
      chainId: DEFAULT_CHAIN_ID,
      fromVault: FROM_VAULT,
      toVault: TO_VAULT,
      amount: '1000000',
      slippage: '0.5',
      intervalSeconds: 3600,
      nextExecutionAt: '1700000000',
      deadline: null,
      allowedVaultsRoot: '0xaaa',
      fromVaultProof: ['0xbbb'],
      toVaultProof: ['0xccc'],
      swapCalldata: '0xddd',
      signature: '0xeee',
      ensoRouterAddress: ENSO_ROUTER,
      verifyingContractAddress: ADMIRALS_QUARTERS,
      status: 'active',
      createdAt: '1700000000',
      updatedAt: '1700000000',
      cancelledAt: null,
      pausedAt: null,
      maxTrades: 10,
      tradesExecuted: 3,
      neverBuyAbove: null,
      neverSellBelow: null,
    }

    const selectQuery = {
      selectAll: jest.fn(),
      where: jest.fn(),
      executeTakeFirst: jest.fn().mockResolvedValue(existingRow),
    }
    selectQuery.selectAll.mockReturnValue(selectQuery)
    selectQuery.where.mockReturnValue(selectQuery)

    const updateQuery = {
      set: jest.fn(),
      where: jest.fn(),
      executeTakeFirstOrThrow: jest.fn().mockResolvedValue({}),
    }
    updateQuery.set.mockReturnValue(updateQuery)
    updateQuery.where.mockReturnValue(updateQuery)

    const dbProvider = jest.fn(async () => ({
      selectFrom: jest.fn().mockReturnValue(selectQuery),
      updateTable: jest.fn().mockReturnValue(updateQuery),
    }))

    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })
    const managerInternals = manager as unknown as {
      _fetchEnsoSwapCalldata: (params: unknown) => Promise<HexData>
    }
    jest.spyOn(managerInternals, '_fetchEnsoSwapCalldata').mockResolvedValue('0xnew' as HexData)

    const result = await manager.editBuyOrder({
      id: 'order-edit',
      orderId: 'ext-order-edit-v2',
      userAddress: account.address as AddressValue,
      chainId: DEFAULT_CHAIN_ID,
      fromVault: FROM_VAULT,
      toVault: TO_VAULT,
      rebalanceAuthorizationSignature: '0x5678' as HexData,
      amountShares: TEST_AMOUNT,
      slippagePercentage: '1.0',
      intervalSeconds: 7200,
      firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 7200,
      maxTrades: 20,
    })

    expect(result.tradesExecuted).toBe(3)
    expect(result.status).toBe(ArmadaDcaOrderStatusEnum.Active)
    expect(updateQuery.set).toHaveBeenCalledTimes(1)
    expect(updateQuery.executeTakeFirstOrThrow).toHaveBeenCalledTimes(1)
  })

  it('should throw when editBuyOrder targets a cancelled order', async () => {
    const account = privateKeyToAccount(TEST_SIGNER_PRIVATE_KEY)

    const cancelledRow: DbOrderRow = {
      id: 'order-cancelled',
      orderId: 'ext-cancelled',
      userAddress: account.address,
      chainId: DEFAULT_CHAIN_ID,
      fromVault: FROM_VAULT,
      toVault: TO_VAULT,
      amount: '1000000',
      slippage: '0.5',
      intervalSeconds: 3600,
      nextExecutionAt: '1700000000',
      deadline: null,
      allowedVaultsRoot: '0xaaa',
      fromVaultProof: ['0xbbb'],
      toVaultProof: ['0xccc'],
      swapCalldata: '0xddd',
      signature: '0xeee',
      ensoRouterAddress: ENSO_ROUTER,
      verifyingContractAddress: ADMIRALS_QUARTERS,
      status: ArmadaDcaOrderStatusEnum.Cancelled,
      createdAt: '1700000000',
      updatedAt: '1700000000',
      cancelledAt: '1700001000',
      pausedAt: null,
      maxTrades: 10,
      tradesExecuted: 0,
      neverBuyAbove: null,
      neverSellBelow: null,
    }

    const selectQuery = {
      selectAll: jest.fn(),
      where: jest.fn(),
      executeTakeFirst: jest.fn().mockResolvedValue(cancelledRow),
    }
    selectQuery.selectAll.mockReturnValue(selectQuery)
    selectQuery.where.mockReturnValue(selectQuery)

    const dbProvider = jest.fn(async () => ({
      selectFrom: jest.fn().mockReturnValue(selectQuery),
    }))

    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })

    await expect(
      manager.editBuyOrder({
        id: 'order-cancelled',
        orderId: 'ext-cancelled',
        userAddress: account.address as AddressValue,
        chainId: DEFAULT_CHAIN_ID,
        fromVault: FROM_VAULT,
        toVault: TO_VAULT,
        rebalanceAuthorizationSignature: '0x1234' as HexData,
        amountShares: TEST_AMOUNT,
        slippagePercentage: '0.5',
        intervalSeconds: 3600,
        firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
        maxTrades: 10,
      }),
    ).rejects.toThrow('Cannot edit an order with status')
  })

  it('should throw on editBuyOrder when row is not found', async () => {
    const selectQuery = {
      selectAll: jest.fn(),
      where: jest.fn(),
      executeTakeFirst: jest.fn().mockResolvedValue(undefined),
    }
    selectQuery.selectAll.mockReturnValue(selectQuery)
    selectQuery.where.mockReturnValue(selectQuery)

    const dbProvider = jest.fn(async () => ({
      selectFrom: jest.fn().mockReturnValue(selectQuery),
    }))

    const manager = createManager({
      summerProtocolDbProvider: dbProvider as unknown as () => Promise<SummerProtocolDb>,
    })

    await expect(
      manager.editBuyOrder({
        id: 'missing-order',
        orderId: 'ext-missing',
        userAddress: '0x6666666666666666666666666666666666666666' as AddressValue,
        chainId: DEFAULT_CHAIN_ID,
        fromVault: FROM_VAULT,
        toVault: TO_VAULT,
        rebalanceAuthorizationSignature: '0x1234' as HexData,
        amountShares: TEST_AMOUNT,
        slippagePercentage: '0.5',
        intervalSeconds: 3600,
        firstExecutionUnixTimestamp: Math.floor(Date.now() / 1000) + 3600,
        maxTrades: 10,
      }),
    ).rejects.toThrow('DCA order not found')
  })
})
