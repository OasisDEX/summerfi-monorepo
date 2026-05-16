import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import type { AddressValue, ChainId, HexData } from '@summerfi/sdk-common'
import { privateKeyToAccount } from 'viem/accounts'
import { ArmadaManagerDCA } from '../src/common/implementation/ArmadaManagerDCA'
import type { SummerProtocolDb } from '../src/common/implementation/dca/getDb'

const DEFAULT_CHAIN_ID = 8453 as ChainId
const FROM_VAULT = '0x1111111111111111111111111111111111111111' as AddressValue
const TO_VAULT = '0x2222222222222222222222222222222222222222' as AddressValue
const ADMIRALS_QUARTERS = '0x3333333333333333333333333333333333333333' as AddressValue
const ENSO_ROUTER = '0x4444444444444444444444444444444444444444' as AddressValue

const TEST_SIGNER_PRIVATE_KEY =
  '0x0000000000000000000000000000000000000000000000000000000000000001' as HexData

const UNDERLYING_ASSET = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as AddressValue

type DbOrderRow = {
  id: string
  userAddress: string
  chainId: number
  fromVault: string
  toVault: string
  amount: string
  slippage: string
  intervalSeconds: number
  nextExecutionAt: string
  deadline: string
  maxTrades: number
  tradesExecuted: number
  allowedVaultsRoot: string
  fromVaultProof: unknown
  toVaultProof: unknown
  swapCalldata: string
  signature: string
  ensoRouterAddress: string
  verifyingContractAddress: string
  status: string
  createdAt: string
  updatedAt: string
  cancelledAt: string | null
  pausedAt: string | null
  neverBuyAbove: string | null
  neverSellBelow: string | null
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
      if (name === 'ARMADA_DCA_SIGNER_PRIVATE_KEY') {
        return TEST_SIGNER_PRIVATE_KEY
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
      _signRebalanceAuthorization: (params: unknown) => Promise<HexData>
      _fetchEnsoSwapCalldata: (params: unknown) => Promise<HexData>
    }

    jest
      .spyOn(managerInternals, '_signRebalanceAuthorization')
      .mockResolvedValue('0x1234' as HexData)
    jest.spyOn(managerInternals, '_fetchEnsoSwapCalldata').mockResolvedValue('0xabcd' as HexData)

    const account = privateKeyToAccount(TEST_SIGNER_PRIVATE_KEY)
    const order = await manager.createAndSaveBuyOrder({
      userAddress: account.address as AddressValue,
      chainId: DEFAULT_CHAIN_ID,
      fromVault: FROM_VAULT,
      toVault: TO_VAULT,
      amount: '1',
      slippagePercentage: '0.5',
      intervalSeconds: 3600,
      firstExecutionUnixTimestamp: 1_700_000_000,
      deadlineUnixTimestamp: 1_700_003_600,
      maxTrades: 10,
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
      status: 'active',
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
      signedMessage,
      signature: signature as HexData,
    })

    expect(result.status).toBe('cancelled')
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
        signedMessage: 'wrong-message',
        signature: '0x1234' as HexData,
      }),
    ).rejects.toThrow('Invalid cancellation message')
  })
})
