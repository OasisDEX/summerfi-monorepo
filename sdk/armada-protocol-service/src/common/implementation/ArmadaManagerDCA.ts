import type {
  ArmadaDcaOrder,
  ArmadaDcaOrderStatus,
  IArmadaManagerDCA,
} from '@summerfi/armada-protocol-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'
import {
  type AddressValue,
  type ChainId,
  type HexData,
  createTimeoutSignal,
  isAddressValue,
} from '@summerfi/sdk-common'
import { encodePacked, keccak256, recoverMessageAddress, type Address, type Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getDb, type SummerProtocolDb, type SummerProtocolDbProvider } from './dca/getDb'
import { ArmadaManagerShared } from './ArmadaManagerShared'

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
}

/**
 * @name ArmadaManagerDCA
 * @description Handles creation and persistence of recurring DCA buy orders.
 */
export class ArmadaManagerDCA extends ArmadaManagerShared implements IArmadaManagerDCA {
  private _configProvider: IConfigurationProvider
  private _deploymentProvider: IDeploymentProvider
  private _summerProtocolDbProvider: SummerProtocolDbProvider

  constructor(params: {
    clientId?: string
    configProvider: IConfigurationProvider
    deploymentProvider: IDeploymentProvider
    summerProtocolDbProvider?: SummerProtocolDbProvider
  }) {
    super({ clientId: params.clientId })
    this._configProvider = params.configProvider
    this._deploymentProvider = params.deploymentProvider
    this._summerProtocolDbProvider = params.summerProtocolDbProvider ?? getDb
  }

  async createAndSaveBuyOrder(
    params: Parameters<IArmadaManagerDCA['createAndSaveBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['createAndSaveBuyOrder']> {
    const now = Math.floor(Date.now() / 1000)
    const deadline = params.deadlineUnixTimestamp
    const nextExecutionAt = params.nextExecutionAtUnixTimestamp
    const orderId = crypto.randomUUID()

    const { allowedVaultsRoot, fromVaultProof, toVaultProof } = this._generateMerkleProofs({
      fromVault: params.fromVault,
      toVault: params.toVault,
    })

    const verifyingContract = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'admiralsQuarters',
      chainId: params.chainId,
    })

    const signature = await this._signRebalanceAuthorization({
      chainId: params.chainId,
      verifyingContract: verifyingContract.value,
      allowedVaultsRoot,
      deadline,
    })

    const ensoRouterAddress = this._configProvider.getConfigurationItem({
      name: 'ENSO_ROUTER_ADDRESS',
    })
    if (!ensoRouterAddress || !isAddressValue(ensoRouterAddress)) {
      throw new Error('ENSO_ROUTER_ADDRESS is not configured or invalid')
    }

    const swapCalldata = await this._fetchEnsoSwapCalldata({
      chainId: params.chainId,
      fromAddress: verifyingContract.value,
      ensoRouterAddress,
      tokenIn: params.fromVault,
      tokenOut: params.toVault,
      amountIn: params.amount,
      slippage: String(Number(params.slippagePercentage) * 100),
    })

    const order: ArmadaDcaOrder = {
      id: orderId,
      userAddress: params.userAddress,
      chainId: params.chainId,
      fromVault: params.fromVault,
      toVault: params.toVault,
      amount: params.amount,
      slippage: params.slippagePercentage,
      intervalSeconds: params.intervalSeconds,
      nextExecutionAtUnixTimestamp: nextExecutionAt,
      deadlineUnixTimestamp: deadline,
      allowedVaultsRoot,
      fromVaultProof,
      toVaultProof,
      swapCalldata,
      signature,
      ensoRouterAddress,
      verifyingContractAddress: verifyingContract.value,
      status: 'active',
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
        nextExecutionAt: String(order.nextExecutionAtUnixTimestamp),
        deadline: String(order.deadlineUnixTimestamp),
        allowedVaultsRoot: order.allowedVaultsRoot,
        fromVaultProof: order.fromVaultProof,
        toVaultProof: order.toVaultProof,
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

    return this._mapDbOrderToOrder(row as DbOrderRow)
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

    return rows.map((row: unknown) => this._mapDbOrderToOrder(row as DbOrderRow))
  }

  async cancelBuyOrder(
    params: Parameters<IArmadaManagerDCA['cancelBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCA['cancelBuyOrder']> {
    const expectedSignedMessage = `I want to cancel ${params.orderId}.`
    if (params.signedMessage !== expectedSignedMessage) {
      throw new Error('Invalid cancellation message')
    }

    const recoveredAddress = await recoverMessageAddress({
      message: params.signedMessage,
      signature: params.signature,
    })

    if (recoveredAddress.toLowerCase() !== params.userAddress.toLowerCase()) {
      throw new Error('Cancellation signature does not match userAddress')
    }

    const existingOrder = await this.getBuyOrder({
      orderId: params.orderId,
      userAddress: params.userAddress,
    })

    if (!existingOrder) {
      throw new Error(`DCA order not found: ${params.orderId}`)
    }

    const now = Math.floor(Date.now() / 1000)
    const db = await this._getDb()

    await db
      .updateTable('armadaDcaOrders')
      .set({
        status: 'cancelled',
        updatedAt: String(now),
        cancelledAt: String(now),
      })
      .where('id', '=', params.orderId)
      .where('userAddress', '=', params.userAddress)
      .executeTakeFirstOrThrow()

    return {
      ...existingOrder,
      status: 'cancelled',
      updatedAt: now,
      cancelledAt: now,
    }
  }

  private _generateMerkleProofs(params: { fromVault: AddressValue; toVault: AddressValue }): {
    allowedVaultsRoot: HexData
    fromVaultProof: HexData[]
    toVaultProof: HexData[]
  } {
    const leaves = [params.fromVault, params.toVault].map((addressValue) =>
      keccak256(encodePacked(['address'], [addressValue as Address])),
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

  private _getDb(): Promise<SummerProtocolDb> {
    return this._summerProtocolDbProvider()
  }

  private async _signRebalanceAuthorization(params: {
    chainId: number
    verifyingContract: AddressValue
    allowedVaultsRoot: HexData
    deadline: number
  }): Promise<HexData> {
    const signerPrivateKey = this._configProvider.getConfigurationItem({
      name: 'ARMADA_DCA_SIGNER_PRIVATE_KEY',
    }) as Hex

    if (!signerPrivateKey) {
      throw new Error('ARMADA_DCA_SIGNER_PRIVATE_KEY is not configured')
    }

    const account = privateKeyToAccount(signerPrivateKey)

    return account.signTypedData({
      domain: {
        name: 'AdmiralsQuarters',
        version: '1',
        chainId: params.chainId,
        verifyingContract: params.verifyingContract as Address,
      },
      types: {
        RebalanceAuthorization: [
          { name: 'allowedVaultsRoot', type: 'bytes32' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'RebalanceAuthorization',
      message: {
        allowedVaultsRoot: params.allowedVaultsRoot,
        deadline: BigInt(params.deadline),
      },
    }) as Promise<HexData>
  }

  private async _fetchEnsoSwapCalldata(params: {
    chainId: number
    fromAddress: AddressValue
    ensoRouterAddress: AddressValue
    tokenIn: AddressValue
    tokenOut: AddressValue
    amountIn: string
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
      amountIn: params.amountIn,
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

  private _mapDbOrderToOrder(row: DbOrderRow): ArmadaDcaOrder {
    const fromVaultProof = Array.isArray(row.fromVaultProof) ? row.fromVaultProof : []
    const toVaultProof = Array.isArray(row.toVaultProof) ? row.toVaultProof : []

    return {
      id: row.id,
      userAddress: row.userAddress as AddressValue,
      chainId: row.chainId as ChainId,
      fromVault: row.fromVault as AddressValue,
      toVault: row.toVault as AddressValue,
      amount: row.amount,
      slippage: row.slippage,
      intervalSeconds: row.intervalSeconds,
      nextExecutionAtUnixTimestamp: Number(row.nextExecutionAt),
      deadlineUnixTimestamp: Number(row.deadline),
      allowedVaultsRoot: row.allowedVaultsRoot as HexData,
      fromVaultProof: fromVaultProof as HexData[],
      toVaultProof: toVaultProof as HexData[],
      swapCalldata: row.swapCalldata as HexData,
      signature: row.signature as HexData,
      ensoRouterAddress: row.ensoRouterAddress as AddressValue,
      verifyingContractAddress: row.verifyingContractAddress as AddressValue,
      status: row.status as ArmadaDcaOrderStatus,
      createdAt: Number(row.createdAt),
      updatedAt: Number(row.updatedAt),
      cancelledAt: row.cancelledAt ? Number(row.cancelledAt) : undefined,
    }
  }
}
