import type { IArmadaManagerDCA } from '@summerfi/armada-protocol-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import {
  type AddressValue,
  type ChainId,
  type HexData,
  type IArmadaDcaOrder,
  type IArmadaDcaStrategyConfig,
  Address,
  ArmadaDcaOrderStatusEnum,
  Token,
  TransactionType,
  type CreateDcaStrategyTransactionInfo,
  type EditDcaStrategyTransactionInfo,
  type PauseDcaStrategyTransactionInfo,
  type ResumeDcaStrategyTransactionInfo,
  type CancelDcaStrategyTransactionInfo,
  createTimeoutSignal,
  getChainInfoByChainId,
  isAddressValue,
} from '@summerfi/sdk-common'
import {
  encodeFunctionData,
  encodePacked,
  keccak256,
  parseAbi,
  recoverMessageAddress,
  type Address as ViemAddress,
} from 'viem'
import type { SummerProtocolDb, SummerProtocolDbProvider } from '../../db-provider/getDb'
import { ArmadaManagerShared } from './ArmadaManagerShared'
import { DCAStrategyManagerAbi } from './abi/DCAStrategyManagerAbi'

const MIN_INTERVAL_SECONDS = 3600 // 1 hour
const MAX_INTERVAL_SECONDS = 31536000 // 1 year
const DUST_THRESHOLD_USD = 5 // minimum order amount in USD

const HARBOR_COMMAND_ABI = parseAbi([
  'function getActiveFleetCommanders() view returns (address[])',
])

const ERC4626_ASSET_ABI = parseAbi(['function asset() view returns (address)'])
const ERC20_METADATA_ABI = parseAbi([
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
])

export type DbOrderRow = {
  id: string
  orderId: string
  userAddress: string
  chainId: number
  fromVault: string
  toVault: string
  amount: string
  slippage: string
  intervalSeconds: number
  nextExecutionAt: string | null
  deadline: string | null
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

/**
 * @name ArmadaManagerDCA
 * @description Handles creation and persistence of recurring DCA buy orders.
 */
export class ArmadaManagerDCA extends ArmadaManagerShared implements IArmadaManagerDCA {
  private _configProvider: IConfigurationProvider
  private _deploymentProvider: IDeploymentProvider
  private _summerProtocolDbProvider?: SummerProtocolDbProvider
  private _blockchainClientProvider: IBlockchainClientProvider
  private _oracleManager: IOracleManager

  constructor(params: {
    clientId?: string
    configProvider: IConfigurationProvider
    deploymentProvider: IDeploymentProvider
    summerProtocolDbProvider?: SummerProtocolDbProvider
    blockchainClientProvider: IBlockchainClientProvider
    oracleManager: IOracleManager
  }) {
    super({ clientId: params.clientId })
    this._configProvider = params.configProvider
    this._deploymentProvider = params.deploymentProvider
    this._blockchainClientProvider = params.blockchainClientProvider
    this._oracleManager = params.oracleManager
    this._summerProtocolDbProvider = params.summerProtocolDbProvider
  }

  async createStrategyTx(
    params: Parameters<IArmadaManagerDCA['createStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCA['createStrategyTx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._orderToStrategyConfig({
      order: params.order,
      strategyId: '0',
      inAssetFeed: params.inAssetFeed,
      outAssetFeed: params.outAssetFeed,
    })
    return this._buildStrategyConfigTransaction({
      strategyManagerAddress,
      strategyConfig,
      functionName: 'createStrategy',
      description: 'Create DCA strategy',
      type: TransactionType.CreateStrategy,
      metadata: { order: params.order },
    }) as CreateDcaStrategyTransactionInfo
  }

  async editStrategyTx(
    params: Parameters<IArmadaManagerDCA['editStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCA['editStrategyTx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._orderToStrategyConfig({
      order: params.order,
      strategyId: params.strategyId,
      inAssetFeed: params.inAssetFeed,
      outAssetFeed: params.outAssetFeed,
    })
    return this._buildStrategyConfigTransaction({
      strategyManagerAddress,
      strategyConfig,
      functionName: 'editStrategy',
      description: 'Edit DCA strategy',
      type: TransactionType.EditStrategy,
      metadata: { order: params.order },
    }) as EditDcaStrategyTransactionInfo
  }

  async pauseStrategyTx(
    params: Parameters<IArmadaManagerDCA['pauseStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCA['pauseStrategyTx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    return this._buildStrategyIdTransaction({
      strategyManagerAddress,
      strategyId: params.strategyId,
      functionName: 'pauseStrategy',
      description: 'Pause DCA strategy',
      type: TransactionType.PauseStrategy,
    }) as PauseDcaStrategyTransactionInfo
  }

  async resumeStrategyTx(
    params: Parameters<IArmadaManagerDCA['resumeStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCA['resumeStrategyTx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._orderToStrategyConfig({
      order: params.order,
      strategyId: params.strategyId,
      inAssetFeed: params.inAssetFeed,
      outAssetFeed: params.outAssetFeed,
    })
    return this._buildStrategyConfigTransaction({
      strategyManagerAddress,
      strategyConfig,
      functionName: 'resumeStrategy',
      description: 'Resume DCA strategy',
      type: TransactionType.ResumeStrategy,
      metadata: { order: params.order },
    }) as ResumeDcaStrategyTransactionInfo
  }

  async cancelStrategyTx(
    params: Parameters<IArmadaManagerDCA['cancelStrategyTx']>[0],
  ): ReturnType<IArmadaManagerDCA['cancelStrategyTx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    return this._buildStrategyIdTransaction({
      strategyManagerAddress,
      strategyId: params.strategyId,
      functionName: 'cancelStrategy',
      description: 'Cancel DCA strategy',
      type: TransactionType.CancelStrategy,
    }) as CancelDcaStrategyTransactionInfo
  }

  async executeDCATx(
    params: Parameters<IArmadaManagerDCA['executeDCATx']>[0],
  ): ReturnType<IArmadaManagerDCA['executeDCATx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._orderToStrategyConfig({
      order: params.order,
      strategyId: params.strategyId,
      inAssetFeed: params.inAssetFeed,
      outAssetFeed: params.outAssetFeed,
    })
    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: 'executeDCA',
      args: [this._toViemStrategyConfig(strategyConfig), params.order.swapCalldata],
    }) as HexData

    return {
      type: TransactionType.ExecuteDCA,
      description: 'Execute DCA strategy',
      transaction: this._buildTransaction({
        target: strategyManagerAddress,
        calldata,
      }),
    }
  }

  async createAndSaveBuyOrder(
    params: Parameters<IArmadaManagerDCA['createAndSaveBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['createAndSaveBuyOrder']> {
    const order = await this._buildAndValidateOrder({ params, now: Math.floor(Date.now() / 1000) })

    const db = await this._getDb()
    await db
      .insertInto('armadaDcaOrders')
      .values({
        id: order.id,
        orderId: order.orderId,
        userAddress: order.userAddress,
        chainId: order.chainId,
        fromVault: order.fromVault,
        toVault: order.toVault,
        amount: order.amount,
        slippage: order.slippage,
        intervalSeconds: order.intervalSeconds,
        nextExecutionAt: BigInt(order.nextExecutionAtUnixTimestamp),
        deadline:
          order.deadlineUnixTimestamp !== undefined ? String(order.deadlineUnixTimestamp) : null,
        maxTrades: order.maxTrades,
        tradesExecuted: 0,
        neverBuyAbove: order.neverBuyAbove ?? null,
        neverSellBelow: order.neverSellBelow ?? null,
        allowedVaultsRoot: order.allowedVaultsRoot,
        fromVaultProof: JSON.stringify(order.fromVaultProof),
        toVaultProof: JSON.stringify(order.toVaultProof),
        swapCalldata: order.swapCalldata,
        signature: order.signature,
        ensoRouterAddress: order.ensoRouterAddress,
        verifyingContractAddress: order.verifyingContractAddress,
        status: order.status,
        createdAt: String(order.createdAt),
        updatedAt: String(order.updatedAt),
      })
      .executeTakeFirstOrThrow()

    return order
  }

  async editBuyOrder(
    params: Parameters<IArmadaManagerDCA['editBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['editBuyOrder']> {
    const now = Math.floor(Date.now() / 1000)
    const existingOrder = await this._getExistingOrderOrThrow({
      orderId: params.id,
      userAddress: params.userAddress,
    })

    if (
      existingOrder.status === ArmadaDcaOrderStatusEnum.Cancelled ||
      existingOrder.status === ArmadaDcaOrderStatusEnum.Completed
    ) {
      throw new Error(`Cannot edit an order with status: ${existingOrder.status}`)
    }

    const updated = await this._buildAndValidateOrder({ params, now })

    const db = await this._getDb()
    await db
      .updateTable('armadaDcaOrders')
      .set({
        orderId: updated.orderId ?? null,
        fromVault: updated.fromVault,
        toVault: updated.toVault,
        amount: updated.amount,
        slippage: updated.slippage,
        intervalSeconds: updated.intervalSeconds,
        nextExecutionAt: BigInt(updated.nextExecutionAtUnixTimestamp),
        deadline:
          updated.deadlineUnixTimestamp !== undefined
            ? String(updated.deadlineUnixTimestamp)
            : null,
        maxTrades: updated.maxTrades,
        neverBuyAbove: updated.neverBuyAbove ?? null,
        neverSellBelow: updated.neverSellBelow ?? null,
        allowedVaultsRoot: updated.allowedVaultsRoot,
        fromVaultProof: JSON.stringify(updated.fromVaultProof),
        toVaultProof: JSON.stringify(updated.toVaultProof),
        swapCalldata: updated.swapCalldata,
        signature: updated.signature,
        ensoRouterAddress: updated.ensoRouterAddress,
        verifyingContractAddress: updated.verifyingContractAddress,
        updatedAt: String(now),
      })
      .where('id', '=', params.id)
      .where((eb) => eb.fn('lower', [eb.ref('userAddress')]), '=', params.userAddress.toLowerCase())
      .executeTakeFirstOrThrow()

    return {
      ...updated,
      tradesExecuted: existingOrder.tradesExecuted,
      status: existingOrder.status,
      createdAt: existingOrder.createdAt,
      cancelledAt: existingOrder.cancelledAt,
      pausedAt: existingOrder.pausedAt,
    }
  }

  async getBuyOrder(
    params: Parameters<IArmadaManagerDCA['getBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['getBuyOrder']> {
    const db = await this._getDb()
    const row = await db
      .selectFrom('armadaDcaOrders')
      .selectAll()
      .where('id', '=', params.orderId)
      .where((eb) => eb.fn('lower', [eb.ref('userAddress')]), '=', params.userAddress.toLowerCase())
      .executeTakeFirst()

    if (!row) {
      return undefined
    }

    return this._mapDbOrderToOrder(row)
  }

  async getBuyOrders(
    params: Parameters<IArmadaManagerDCA['getBuyOrders']>[0],
  ): ReturnType<IArmadaManagerDCA['getBuyOrders']> {
    const db = await this._getDb()
    let query = db
      .selectFrom('armadaDcaOrders')
      .selectAll()
      .where((eb) => eb.fn('lower', [eb.ref('userAddress')]), '=', params.userAddress.toLowerCase())

    if (params.chainId) {
      query = query.where('chainId', '=', params.chainId)
    }

    if (params.status) {
      query = query.where('status', '=', params.status)
    }

    const rows = await query.orderBy('createdAt desc').execute()

    return rows.map((row) => this._mapDbOrderToOrder(row))
  }

  async cancelBuyOrder(
    params: Parameters<IArmadaManagerDCA['cancelBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['cancelBuyOrder']> {
    const existingOrder = await this._getExistingOrderOrThrow(params)

    if (existingOrder.status === ArmadaDcaOrderStatusEnum.Cancelled) {
      throw new Error('Order is already cancelled')
    }

    const now = Math.floor(Date.now() / 1000)
    const db = await this._getDb()

    await db
      .updateTable('armadaDcaOrders')
      .set({
        status: ArmadaDcaOrderStatusEnum.Cancelled,
        updatedAt: String(now),
        cancelledAt: String(now),
      })
      .where('id', '=', params.orderId)
      .where((eb) => eb.fn('lower', [eb.ref('userAddress')]), '=', params.userAddress.toLowerCase())
      .executeTakeFirstOrThrow()

    return {
      ...existingOrder,
      status: ArmadaDcaOrderStatusEnum.Cancelled,
      updatedAt: now,
      cancelledAt: now,
    }
  }

  async pauseBuyOrder(
    params: Parameters<IArmadaManagerDCA['pauseBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['pauseBuyOrder']> {
    const existingOrder = await this._getExistingOrderOrThrow(params)

    if (existingOrder.status !== 'active') {
      throw new Error(
        `Cannot pause an order that is not active (current status: ${existingOrder.status})`,
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const db = await this._getDb()

    await db
      .updateTable('armadaDcaOrders')
      .set({
        status: ArmadaDcaOrderStatusEnum.Paused,
        updatedAt: String(now),
        pausedAt: String(now),
      })
      .where('id', '=', params.orderId)
      .where((eb) => eb.fn('lower', [eb.ref('userAddress')]), '=', params.userAddress.toLowerCase())
      .executeTakeFirstOrThrow()

    return {
      ...existingOrder,
      status: ArmadaDcaOrderStatusEnum.Paused,
      updatedAt: now,
      pausedAt: now,
    }
  }

  async resumeBuyOrder(
    params: Parameters<IArmadaManagerDCA['resumeBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['resumeBuyOrder']> {
    const existingOrder = await this._getExistingOrderOrThrow(params)

    if (existingOrder.status !== 'paused') {
      throw new Error(
        `Cannot resume an order that is not paused (current status: ${existingOrder.status})`,
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const db = await this._getDb()

    await db
      .updateTable('armadaDcaOrders')
      .set({
        status: ArmadaDcaOrderStatusEnum.Active,
        updatedAt: String(now),
        pausedAt: null,
      })
      .where('id', '=', params.orderId)
      .where((eb) => eb.fn('lower', [eb.ref('userAddress')]), '=', params.userAddress.toLowerCase())
      .executeTakeFirstOrThrow()

    return {
      ...existingOrder,
      status: ArmadaDcaOrderStatusEnum.Active,
      updatedAt: now,
      pausedAt: undefined,
    }
  }

  private async _buildAndValidateOrder(params: {
    params: {
      id: string
      orderId: string
      userAddress: AddressValue
      chainId: ChainId
      fromVault: AddressValue
      toVault: AddressValue
      rebalanceAuthorizationSignature: HexData
      amount: { toSolidityValue(): bigint; amount: string }
      slippagePercentage: string
      intervalSeconds: number
      firstExecutionUnixTimestamp: number
      deadlineUnixTimestamp?: number
      maxTrades: number
      neverBuyAbove?: string
      neverSellBelow?: string
    }
    now: number
  }): Promise<IArmadaDcaOrder> {
    const { params: p, now } = params
    const deadline = p.deadlineUnixTimestamp

    const amountRaw = p.amount.toSolidityValue()
    if (amountRaw <= 0) {
      throw new Error('amount must be a positive number')
    }

    const amountUsd = await this._getUnderlyingAssetUsdValue({
      chainId: p.chainId,
      vaultAddress: p.fromVault,
      amount: p.amount.amount,
    })
    if (amountUsd < DUST_THRESHOLD_USD) {
      throw new Error(`amount must be worth at least ${DUST_THRESHOLD_USD} USD`)
    }

    if (p.intervalSeconds < MIN_INTERVAL_SECONDS) {
      throw new Error(`intervalSeconds must be at least ${MIN_INTERVAL_SECONDS} (1 hour)`)
    }
    if (p.intervalSeconds > MAX_INTERVAL_SECONDS) {
      throw new Error(`intervalSeconds must be at most ${MAX_INTERVAL_SECONDS} (1 year)`)
    }

    if (deadline !== undefined && deadline <= now) {
      throw new Error('deadlineUnixTimestamp must be in the future')
    }

    await this._validateVaultAllowlist({
      chainId: p.chainId,
      fromVault: p.fromVault,
      toVault: p.toVault,
    })

    const { allowedVaultsRoot, fromVaultProof, toVaultProof } = this._generateMerkleProofs({
      fromVault: p.fromVault,
      toVault: p.toVault,
    })

    const verifyingContract = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'admiralsQuarters',
      chainId: p.chainId,
    })

    const ensoRouterAddress = this._configProvider.getConfigurationItem({
      name: 'ENSO_ROUTER_ADDRESS',
    })
    if (!ensoRouterAddress || !isAddressValue(ensoRouterAddress)) {
      throw new Error('ENSO_ROUTER_ADDRESS is not configured or invalid')
    }

    console.log('Fetching Enso swap calldata...')

    const swapCalldata = await this._fetchEnsoSwapCalldata({
      chainId: p.chainId,
      fromAddress: verifyingContract.value,
      ensoRouterAddress,
      tokenIn: p.fromVault,
      tokenOut: p.toVault,
      amountIn: amountRaw,
      slippage: String(Number(p.slippagePercentage) * 100),
    })

    return {
      id: p.id,
      orderId: p.orderId,
      userAddress: p.userAddress,
      chainId: p.chainId,
      fromVault: p.fromVault,
      toVault: p.toVault,
      amount: amountRaw.toString(),
      slippage: p.slippagePercentage,
      intervalSeconds: p.intervalSeconds,
      nextExecutionAtUnixTimestamp: p.firstExecutionUnixTimestamp,
      deadlineUnixTimestamp: deadline,
      maxTrades: p.maxTrades,
      tradesExecuted: 0,
      neverBuyAbove: p.neverBuyAbove,
      neverSellBelow: p.neverSellBelow,
      allowedVaultsRoot,
      fromVaultProof,
      toVaultProof,
      swapCalldata,
      signature: p.rebalanceAuthorizationSignature,
      ensoRouterAddress,
      verifyingContractAddress: verifyingContract.value,
      status: ArmadaDcaOrderStatusEnum.Active,
      createdAt: now,
      updatedAt: now,
    }
  }

  private async _getExistingOrderOrThrow(params: {
    orderId: string
    userAddress: AddressValue
  }): Promise<IArmadaDcaOrder> {
    const order = await this.getBuyOrder(params)
    if (!order) {
      throw new Error(`DCA order not found: ${params.orderId}`)
    }
    return order
  }

  private async _getUnderlyingAssetUsdValue(params: {
    chainId: ChainId
    vaultAddress: AddressValue
    amount: string
  }): Promise<number> {
    const chainInfo = getChainInfoByChainId(Number(params.chainId))
    const client = this._blockchainClientProvider.getBlockchainClient({ chainInfo })

    const assetAddress = (await client.readContract({
      abi: ERC4626_ASSET_ABI,
      address: params.vaultAddress,
      functionName: 'asset',
    })) as `0x${string}`

    const [decimals, symbol] = await Promise.all([
      client.readContract({
        abi: ERC20_METADATA_ABI,
        address: assetAddress as AddressValue,
        functionName: 'decimals',
      }) as Promise<number>,
      client.readContract({
        abi: ERC20_METADATA_ABI,
        address: assetAddress as AddressValue,
        functionName: 'symbol',
      }) as Promise<string>,
    ])

    const token = Token.createFrom({
      chainInfo,
      address: Address.createFromEthereum({ value: assetAddress }),
      symbol,
      name: symbol,
      decimals,
    })

    const spotPriceInfo = await this._oracleManager.getSpotPrice({ baseToken: token })
    const priceUsd = Number(spotPriceInfo.price.value)

    return Number(params.amount) * priceUsd
  }

  private _orderToStrategyConfig(params: {
    order: IArmadaDcaOrder
    strategyId: string
    inAssetFeed: AddressValue
    outAssetFeed: AddressValue
  }): IArmadaDcaStrategyConfig {
    return {
      strategyId: params.strategyId,
      owner: params.order.userAddress,
      sourceVault: params.order.fromVault,
      targetVault: params.order.toVault,
      inAsset: params.order.fromVault,
      outAsset: params.order.toVault,
      inAssetFeed: params.inAssetFeed,
      outAssetFeed: params.outAssetFeed,
      tradeAmount: params.order.amount,
      interval: String(params.order.intervalSeconds),
      slippageBps: String(Math.round(Number(params.order.slippage) * 100)),
      maxPrice: params.order.neverBuyAbove ?? '0',
      minPrice: params.order.neverSellBelow ?? '0',
      endDate: String(params.order.deadlineUnixTimestamp ?? 0),
      maxTrades: String(params.order.maxTrades),
    }
  }

  private _buildStrategyConfigTransaction(params: {
    strategyManagerAddress: AddressValue
    strategyConfig: IArmadaDcaStrategyConfig
    functionName: 'createStrategy' | 'editStrategy' | 'resumeStrategy'
    description: string
    type:
      | TransactionType.CreateStrategy
      | TransactionType.EditStrategy
      | TransactionType.ResumeStrategy
    metadata: {
      order: IArmadaDcaOrder
    }
  }):
    | CreateDcaStrategyTransactionInfo
    | EditDcaStrategyTransactionInfo
    | ResumeDcaStrategyTransactionInfo {
    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: params.functionName,
      args: [this._toViemStrategyConfig(params.strategyConfig)],
    }) as HexData

    return {
      type: params.type,
      description: params.description,
      transaction: this._buildTransaction({
        target: params.strategyManagerAddress,
        calldata,
      }),
      metadata: params.metadata,
    }
  }

  private _buildStrategyIdTransaction(params: {
    strategyManagerAddress: AddressValue
    strategyId: string
    functionName: 'pauseStrategy' | 'cancelStrategy'
    description: string
    type: TransactionType.PauseStrategy | TransactionType.CancelStrategy
  }): PauseDcaStrategyTransactionInfo | CancelDcaStrategyTransactionInfo {
    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: params.functionName,
      args: [BigInt(params.strategyId)],
    }) as HexData

    return {
      type: params.type,
      description: params.description,
      transaction: this._buildTransaction({
        target: params.strategyManagerAddress,
        calldata,
      }),
    }
  }

  private _buildTransaction(params: { target: AddressValue; calldata: HexData }) {
    return {
      target: Address.createFromEthereum({ value: params.target }),
      calldata: params.calldata,
      value: '0',
    }
  }

  private _toViemStrategyConfig(config: IArmadaDcaStrategyConfig) {
    return {
      strategyId: BigInt(config.strategyId),
      owner: config.owner,
      sourceVault: config.sourceVault,
      targetVault: config.targetVault,
      inAsset: config.inAsset,
      outAsset: config.outAsset,
      inAssetFeed: config.inAssetFeed,
      outAssetFeed: config.outAssetFeed,
      tradeAmount: BigInt(config.tradeAmount),
      interval: BigInt(config.interval),
      slippageBps: BigInt(config.slippageBps),
      maxPrice: BigInt(config.maxPrice),
      minPrice: BigInt(config.minPrice),
      endDate: BigInt(config.endDate),
      maxTrades: BigInt(config.maxTrades),
    }
  }

  private async _validateVaultAllowlist(params: {
    chainId: ChainId
    fromVault: AddressValue
    toVault: AddressValue
  }): Promise<void> {
    const harborCommandAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'harborCommand',
      chainId: params.chainId,
    })

    const chainInfo = getChainInfoByChainId(Number(params.chainId))
    const client = this._blockchainClientProvider.getBlockchainClient({ chainInfo })

    const activeCommanders = (await client.readContract({
      abi: HARBOR_COMMAND_ABI,
      address: harborCommandAddress.value,
      functionName: 'getActiveFleetCommanders',
    })) as ViemAddress[]

    const normalizedCommanders = activeCommanders.map((a) => a.toLowerCase())

    if (!normalizedCommanders.includes(params.fromVault.toLowerCase())) {
      throw new Error(
        `fromVault ${params.fromVault} is not an active fleet commander on chain ${params.chainId}`,
      )
    }

    if (!normalizedCommanders.includes(params.toVault.toLowerCase())) {
      throw new Error(
        `toVault ${params.toVault} is not an active fleet commander on chain ${params.chainId}`,
      )
    }
  }

  private _generateMerkleProofs(params: { fromVault: AddressValue; toVault: AddressValue }): {
    allowedVaultsRoot: HexData
    fromVaultProof: HexData[]
    toVaultProof: HexData[]
  } {
    const leaves = [params.fromVault, params.toVault].map((addressValue) =>
      keccak256(encodePacked(['address'], [addressValue as ViemAddress])),
    )
    const [fromLeaf, toLeaf] = leaves
    const [left, right] =
      fromLeaf.toLowerCase() < toLeaf.toLowerCase() ? [fromLeaf, toLeaf] : [toLeaf, fromLeaf]
    const allowedVaultsRoot = keccak256(encodePacked(['bytes32', 'bytes32'], [left, right]))

    return {
      allowedVaultsRoot: allowedVaultsRoot as HexData,
      fromVaultProof: [toLeaf as HexData],
      toVaultProof: [fromLeaf as HexData],
    }
  }

  private async _getDb(): Promise<SummerProtocolDb> {
    if (this._summerProtocolDbProvider) {
      return this._summerProtocolDbProvider()
    }

    const { getDb } = await import('../../db-provider/getDb')
    return getDb()
  }

  private async _fetchEnsoSwapCalldata(params: {
    chainId: number
    fromAddress: AddressValue
    ensoRouterAddress: AddressValue
    tokenIn: AddressValue
    tokenOut: AddressValue
    amountIn: bigint
    slippage: string
  }): Promise<HexData> {
    const ensoApiKey = this._configProvider.getConfigurationItem({
      name: 'ENSO_API_KEY',
    })

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (ensoApiKey) {
      headers.Authorization = `Bearer ${ensoApiKey}`
    }

    const query = new URLSearchParams({
      chainId: String(params.chainId),
      fromAddress: params.fromAddress,
      receiver: params.fromAddress,
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      amountIn: params.amountIn.toString(),
      slippage: params.slippage,
      routingStrategy: 'router',
      router: params.ensoRouterAddress,
    })

    const response = await fetch(
      `https://api.enso.finance/api/v1/shortcuts/route?${query.toString()}`,
      {
        headers,
        signal: createTimeoutSignal(),
      },
    )

    if (!response.ok) {
      throw new Error(`Enso API error ${response.status}: ${await response.text()}`)
    }

    const json = (await response.json()) as { tx?: { data?: string } }
    const calldata = json.tx?.data

    if (!calldata) {
      throw new Error('Enso API did not return tx.data')
    }

    return calldata as HexData
  }

  private _mapDbOrderToOrder(row: DbOrderRow): IArmadaDcaOrder {
    const parseProof = (proof: unknown): unknown[] => {
      if (typeof proof === 'string') {
        try {
          const parsed = JSON.parse(proof)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      }

      return Array.isArray(proof) ? proof : []
    }

    const fromVaultProof = parseProof(row.fromVaultProof)
    const toVaultProof = parseProof(row.toVaultProof)

    return {
      id: row.id,
      orderId: row.orderId,
      userAddress: row.userAddress as AddressValue,
      chainId: row.chainId as ChainId,
      fromVault: row.fromVault as AddressValue,
      toVault: row.toVault as AddressValue,
      amount: row.amount,
      slippage: row.slippage,
      intervalSeconds: row.intervalSeconds,
      nextExecutionAtUnixTimestamp: Number(row.nextExecutionAt ?? 0),
      deadlineUnixTimestamp: row.deadline !== null ? Number(row.deadline) : undefined,
      maxTrades: row.maxTrades,
      tradesExecuted: row.tradesExecuted,
      allowedVaultsRoot: row.allowedVaultsRoot as HexData,
      fromVaultProof: fromVaultProof as HexData[],
      toVaultProof: toVaultProof as HexData[],
      swapCalldata: row.swapCalldata as HexData,
      signature: row.signature as HexData,
      ensoRouterAddress: row.ensoRouterAddress as AddressValue,
      verifyingContractAddress: row.verifyingContractAddress as AddressValue,
      status: row.status as ArmadaDcaOrderStatusEnum,
      createdAt: Number(row.createdAt),
      updatedAt: Number(row.updatedAt),
      cancelledAt: row.cancelledAt ? Number(row.cancelledAt) : undefined,
      pausedAt: row.pausedAt ? Number(row.pausedAt) : undefined,
      neverBuyAbove: row.neverBuyAbove ?? undefined,
      neverSellBelow: row.neverSellBelow ?? undefined,
    }
  }
}
