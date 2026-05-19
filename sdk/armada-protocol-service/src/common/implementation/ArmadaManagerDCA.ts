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
  Address,
  ArmadaDcaOrderStatusEnum,
  Token,
  createTimeoutSignal,
  getChainInfoByChainId,
  isAddressValue,
} from '@summerfi/sdk-common'
import {
  encodePacked,
  keccak256,
  parseAbi,
  recoverMessageAddress,
  type Address as ViemAddress,
} from 'viem'
import type { SummerProtocolDb, SummerProtocolDbProvider } from './dca/getDb'
import { ArmadaManagerShared } from './ArmadaManagerShared'

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

type DbOrderRow = {
  id: string
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

  async createAndSaveBuyOrder(
    params: Parameters<IArmadaManagerDCA['createAndSaveBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['createAndSaveBuyOrder']> {
    const now = Math.floor(Date.now() / 1000)
    const deadline = params.deadlineUnixTimestamp
    const firstExecutionAt = params.firstExecutionUnixTimestamp
    const orderId = crypto.randomUUID()

    // Validate amount is a positive decimal string
    const amountRaw = params.amount.toSolidityValue()
    if (amountRaw <= 0) {
      throw new Error('amount must be a positive number')
    }

    // Validate amount is above dust threshold in USD
    const amountUsd = await this._getUnderlyingAssetUsdValue({
      chainId: params.chainId,
      vaultAddress: params.fromVault,
      amount: params.amount.amount,
    })
    if (amountUsd < DUST_THRESHOLD_USD) {
      throw new Error(`amount must be worth at least ${DUST_THRESHOLD_USD} USD`)
    }

    // Validate interval bounds
    if (params.intervalSeconds < MIN_INTERVAL_SECONDS) {
      throw new Error(`intervalSeconds must be at least ${MIN_INTERVAL_SECONDS} (1 hour)`)
    }
    if (params.intervalSeconds > MAX_INTERVAL_SECONDS) {
      throw new Error(`intervalSeconds must be at most ${MAX_INTERVAL_SECONDS} (1 year)`)
    }

    // Validate deadline is in the future if provided
    if (deadline !== undefined && deadline <= now) {
      throw new Error('deadlineUnixTimestamp must be in the future')
    }

    // Validate vault allowlist via HarborCommand on-chain read
    await this._validateVaultAllowlist({
      chainId: params.chainId,
      fromVault: params.fromVault,
      toVault: params.toVault,
    })

    const { allowedVaultsRoot, fromVaultProof, toVaultProof } = this._generateMerkleProofs({
      fromVault: params.fromVault,
      toVault: params.toVault,
    })

    const verifyingContract = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'admiralsQuarters',
      chainId: params.chainId,
    })

    const ensoRouterAddress = this._configProvider.getConfigurationItem({
      name: 'ENSO_ROUTER_ADDRESS',
    })
    if (!ensoRouterAddress || !isAddressValue(ensoRouterAddress)) {
      throw new Error('ENSO_ROUTER_ADDRESS is not configured or invalid')
    }

    console.log('Fetching Enso swap calldata...')

    const swapCalldata = await this._fetchEnsoSwapCalldata({
      chainId: params.chainId,
      fromAddress: verifyingContract.value,
      ensoRouterAddress,
      tokenIn: params.fromVault,
      tokenOut: params.toVault,
      amountIn: amountRaw,
      slippage: String(Number(params.slippagePercentage) * 100),
    })

    const order: IArmadaDcaOrder = {
      id: orderId,
      userAddress: params.userAddress,
      chainId: params.chainId,
      fromVault: params.fromVault,
      toVault: params.toVault,
      amount: amountRaw.toString(),
      slippage: params.slippagePercentage,
      intervalSeconds: params.intervalSeconds,
      nextExecutionAtUnixTimestamp: firstExecutionAt,
      deadlineUnixTimestamp: deadline,
      maxTrades: params.maxTrades,
      tradesExecuted: 0,
      neverBuyAbove: params.neverBuyAbove,
      neverSellBelow: params.neverSellBelow,
      allowedVaultsRoot,
      fromVaultProof,
      toVaultProof,
      swapCalldata,
      signature: params.rebalanceAuthorizationSignature,
      ensoRouterAddress,
      verifyingContractAddress: verifyingContract.value,
      status: ArmadaDcaOrderStatusEnum.Active,
      createdAt: now,
      updatedAt: now,
    }

    const db = await this._getDb()
    await db
      .insertInto('armadaDcaOrders')
      .values({
        id: order.id,
        userAddress: order.userAddress,
        chainId: order.chainId,
        fromVault: order.fromVault,
        toVault: order.toVault,
        amount: order.amount,
        slippage: order.slippage,
        intervalSeconds: order.intervalSeconds,
        nextExecutionAt: BigInt(order.nextExecutionAtUnixTimestamp),
        deadline: deadline !== undefined ? String(deadline) : null,
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

  async getBuyOrder(
    params: Parameters<IArmadaManagerDCA['getBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['getBuyOrder']> {
    const db = await this._getDb()
    const row = await db
      .selectFrom('armadaDcaOrders')
      .selectAll()
      .where('id', '=', params.orderId)
      .where('userAddress', '=', params.userAddress)
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
      .where('userAddress', '=', params.userAddress)

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
    await this._verifyOrderSignature({ action: 'cancel', ...params })

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
      .where('userAddress', '=', params.userAddress)
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
    await this._verifyOrderSignature({ action: 'pause', ...params })

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
      .where('userAddress', '=', params.userAddress)
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
    await this._verifyOrderSignature({ action: 'resume', ...params })

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
      .where('userAddress', '=', params.userAddress)
      .executeTakeFirstOrThrow()

    return {
      ...existingOrder,
      status: ArmadaDcaOrderStatusEnum.Active,
      updatedAt: now,
      pausedAt: undefined,
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

  private async _verifyOrderSignature(params: {
    action: 'cancel' | 'pause' | 'resume'
    orderId: string
    userAddress: string
    signedMessage: string
    signature: `0x${string}`
  }): Promise<void> {
    const expectedSignedMessage = `I want to ${params.action} ${params.orderId}.`
    if (params.signedMessage !== expectedSignedMessage) {
      throw new Error(`Invalid ${params.action} message`)
    }

    const recoveredAddress = await recoverMessageAddress({
      message: params.signedMessage,
      signature: params.signature,
    })

    if (recoveredAddress.toLowerCase() !== params.userAddress.toLowerCase()) {
      throw new Error(`${params.action} signature does not match userAddress`)
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

    const { getDb } = await import('./dca/getDb')
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
