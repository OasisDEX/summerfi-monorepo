import type { IDCAManager } from '@summerfi/armada-protocol-common'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'
import type { IDcaSubgraphManager, GetStrategiesQuery } from '@summerfi/subgraph-manager-common'
import {
  type AddressValue,
  type ChainId,
  type HexData,
  type IChainInfo,
  type IDcaStrategy,
  type IDcaExecution,
  type IDcaStrategyConfig,
  type IChainlinkFeed,
  Address,
  Token,
  TokenAmount,
  getChainInfoByChainId,
  isChainId,
  DcaStrategyStatusEnum,
  TransactionType,
  type CreateDcaStrategyTransactionInfo,
  type Permit2AuthorizationTransactionInfo,
  type Permit2SubAllowanceTransactionInfo,
  type EditDcaStrategyTransactionInfo,
  type PauseDcaStrategyTransactionInfo,
  type ResumeDcaStrategyTransactionInfo,
  type CancelDcaStrategyTransactionInfo,
  LoggingService,
} from '@summerfi/sdk-common'
import { encodeFunctionData, maxUint48, maxUint160 } from 'viem'
import { ArmadaManagerShared } from './ArmadaManagerShared'
import { DCAStrategyManagerAbi } from './abi/DCAStrategyManagerAbi'

/**
 * Handles creation and persistence of recurring DCA buy orders.
 */
export class DCAManager extends ArmadaManagerShared implements IDCAManager {
  private _deploymentProvider: IDeploymentProvider
  private _dcaSubgraphManager: IDcaSubgraphManager
  private _contractsProvider: IContractsProvider
  private _allowanceManager: IAllowanceManager
  private _supportedChains: IChainInfo[]

  constructor(params: {
    clientId?: string
    configProvider: IConfigurationProvider
    deploymentProvider: IDeploymentProvider
    dcaSubgraphManager: IDcaSubgraphManager
    contractsProvider: IContractsProvider
    allowanceManager: IAllowanceManager
  }) {
    super({ clientId: params.clientId })
    this._deploymentProvider = params.deploymentProvider
    this._dcaSubgraphManager = params.dcaSubgraphManager
    this._contractsProvider = params.contractsProvider
    this._allowanceManager = params.allowanceManager
    this._supportedChains = params.configProvider
      .getConfigurationItem({ name: 'SUMMER_DEPLOYED_CHAINS_ID_DCA' })
      .split(',')
      .map(Number)
      .filter(isChainId)
      .map(getChainInfoByChainId)
  }

  /** Throws unless the DCA module is deployed on `chainId`. */
  private _assertSupportedChain(chainId: ChainId): void {
    this.assertSupportedChain({ chainId, supportedChains: this._supportedChains })
  }

  /** @see IDCAManager.depositAndCreateStrategyTx */
  async depositAndCreateStrategyTx(
    params: Parameters<IDCAManager['depositAndCreateStrategyTx']>[0],
  ): ReturnType<IDCAManager['depositAndCreateStrategyTx']> {
    this._assertSupportedChain(params.chainId)
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    })

    const slippageBps = BigInt(Math.round(Number(params.slippagePercentage) * 100))
    const assetAmount = BigInt(params.assetAmount)

    // expectedMinShares = source-vault shares floor via convertToShares (fee-exclusive), minus slippage.
    const expectedMinShares = await this._expectedMinShares({
      chainId: params.chainId,
      sourceVault: params.fromVault,
      inAsset: params.inAsset,
      assetAmount,
      slippageBps,
    })

    const config = this._buildStrategyConfig(params, slippageBps)

    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: 'depositAndCreate',
      args: [config, assetAmount, expectedMinShares],
    }) as HexData

    const createTx: CreateDcaStrategyTransactionInfo = {
      type: TransactionType.CreateStrategy,
      description: 'Create DCA strategy (with deposit)',
      transaction: this._buildTransaction({
        target: strategyManagerAddress.value,
        calldata,
      }),
    }

    const { permit2AuthTx, permit2SubAllowanceTx } = await this._buildPermit2KeeperPullTxs({
      chainId: params.chainId,
      userAddress: params.userAddress,
      sourceVault: params.fromVault,
      strategyManagerAddress: strategyManagerAddress.value,
      amountShares: params.amountShares,
      maxTrades: params.maxTrades,
    })

    // depositAndCreate pulls `assetAmount` of `inAsset` from the user via transferFrom, so the
    // strategy manager must be approved to spend it — otherwise the tx reverts with
    // "ERC20: transfer amount exceeds allowance". getApproval returns undefined when the existing
    // allowance already covers the amount.
    const approvalTx = await this._allowanceManager.getApprovalFromBaseUnit({
      chainId: params.chainId,
      spenderAddress: strategyManagerAddress.value,
      tokenAddress: params.inAsset,
      amount: assetAmount,
      ownerAddress: params.userAddress,
    })

    LoggingService.debug(
      `DCA depositAndCreateStrategyTx: permit2Auth=${permit2AuthTx ? 'needed' : 'not needed'}, inAssetApproval=${approvalTx ? 'needed' : 'not needed'}`,
    )

    // Order: [permit2 authorization?, permit2 sub-allowance, inAsset approval?, create]. The
    // CreateStrategy tx is always last; send them in tuple order. Returned as one of four exact
    // tuple shapes (not a loose array) so the ordering is encoded in the type.
    if (permit2AuthTx && approvalTx) {
      return [permit2AuthTx, permit2SubAllowanceTx, approvalTx, createTx]
    }
    if (permit2AuthTx) {
      return [permit2AuthTx, permit2SubAllowanceTx, createTx]
    }
    if (approvalTx) {
      return [permit2SubAllowanceTx, approvalTx, createTx]
    }
    return [permit2SubAllowanceTx, createTx]
  }

  /** @see IDCAManager.createStrategyTx */
  async createStrategyTx(
    params: Parameters<IDCAManager['createStrategyTx']>[0],
  ): ReturnType<IDCAManager['createStrategyTx']> {
    this._assertSupportedChain(params.chainId)
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    })

    const slippageBps = BigInt(Math.round(Number(params.slippagePercentage) * 100))
    const config = this._buildStrategyConfig(params, slippageBps)

    // `createStrategy` only registers the strategy — it does NOT deposit, so there is no `inAsset`
    // pull and hence no ERC20 approval to the manager. The user is expected to already hold the
    // source-vault shares the keeper will pull (via the Permit2 sub-allowance below).
    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: 'createStrategy',
      args: [config],
    }) as HexData

    const createTx: CreateDcaStrategyTransactionInfo = {
      type: TransactionType.CreateStrategy,
      description: 'Create DCA strategy',
      transaction: this._buildTransaction({
        target: strategyManagerAddress.value,
        calldata,
      }),
    }

    const { permit2AuthTx, permit2SubAllowanceTx } = await this._buildPermit2KeeperPullTxs({
      chainId: params.chainId,
      userAddress: params.userAddress,
      sourceVault: params.fromVault,
      strategyManagerAddress: strategyManagerAddress.value,
      amountShares: params.amountShares,
      maxTrades: params.maxTrades,
    })

    LoggingService.debug(
      `DCA createStrategyTx: permit2Auth=${permit2AuthTx ? 'needed' : 'not needed'}`,
    )

    // Order: [permit2 authorization?, permit2 sub-allowance, create]. No inAsset approval because
    // there is no deposit. CreateStrategy is always last.
    if (permit2AuthTx) {
      return [permit2AuthTx, permit2SubAllowanceTx, createTx]
    }
    return [permit2SubAllowanceTx, createTx]
  }

  /**
   * Builds the on-chain `StrategyConfig` tuple shared by `createStrategy` and `depositAndCreate`.
   * `assetAmount` is NOT part of the config — it is a separate arg of `depositAndCreate` only.
   */
  private _buildStrategyConfig(
    params: {
      userAddress: AddressValue
      fromVault: AddressValue
      toVault: AddressValue
      inAsset: AddressValue
      outAsset: AddressValue
      inAssetFeed: IChainlinkFeed
      outAssetFeed: IChainlinkFeed
      amountShares: string
      intervalSeconds: number
      maxTrades: number
      neverBuyAbove?: string
      neverSellBelow?: string
      deadlineUnixTimestamp: number
    },
    slippageBps: bigint,
  ) {
    return {
      owner: params.userAddress,
      sourceVault: params.fromVault,
      targetVault: params.toVault,
      inAsset: params.inAsset,
      outAsset: params.outAsset,
      inAssetFeed: params.inAssetFeed,
      outAssetFeed: params.outAssetFeed,
      tradeAmount: BigInt(params.amountShares),
      interval: BigInt(params.intervalSeconds),
      slippageBps,
      maxPrice: BigInt(params.neverBuyAbove ?? '0'),
      minPrice: BigInt(params.neverSellBelow ?? '0'),
      endDate: BigInt(params.deadlineUnixTimestamp),
      maxTrades: BigInt(params.maxTrades),
    }
  }

  /**
   * Builds the two Permit2 setup steps the keeper needs to pull source-vault shares each execution
   * (mirrors the DCA app's usePermit2Approval), on the SOURCE-VAULT SHARE token:
   *   1. ERC20 authorization: `sourceVault.approve(PERMIT2, MaxUint256)` — only when insufficient.
   *   2. Sub-allowance: `PERMIT2.approve(sourceVault, manager, amount, expiration)`.
   * We grant an infinite (MaxUint160), non-expiring (MaxUint48) sub-allowance to the manager: the
   * Permit2 allowance slot is keyed by (owner, token, spender) and is therefore shared across all
   * DCA strategies on the same source vault, so a per-strategy exact amount/expiration would clobber
   * a sibling strategy's remaining allowance. It is revocable anytime via `getPermit2RevokeTx`.
   */
  private async _buildPermit2KeeperPullTxs(params: {
    chainId: ChainId
    userAddress: AddressValue
    sourceVault: AddressValue
    strategyManagerAddress: AddressValue
    amountShares: string
    maxTrades: number
  }): Promise<{
    permit2AuthTx?: Permit2AuthorizationTransactionInfo
    permit2SubAllowanceTx: Permit2SubAllowanceTransactionInfo
  }> {
    const ownerAddress = Address.createFromEthereum({ value: params.userAddress })
    const sourceVaultAddress = Address.createFromEthereum({ value: params.sourceVault })
    const keeperPullTotal = BigInt(params.amountShares) * BigInt(params.maxTrades)

    const isPermit2AuthNeeded = await this._allowanceManager.isPermit2AuthorizationNeeded({
      chainId: params.chainId,
      ownerAddress,
      tokenAddress: sourceVaultAddress,
      amount: keeperPullTotal,
    })
    const [permit2AuthTx] = isPermit2AuthNeeded
      ? this._allowanceManager.getPermit2AuthorizationTx({
          chainId: params.chainId,
          tokenAddress: sourceVaultAddress,
        })
      : []
    const [permit2SubAllowanceTx] = this._allowanceManager.getPermit2SubAllowanceTx({
      chainId: params.chainId,
      tokenAddress: sourceVaultAddress,
      spenderAddress: Address.createFromEthereum({ value: params.strategyManagerAddress }),
      amount: maxUint160,
      expiration: Number(maxUint48),
    })

    return { permit2AuthTx, permit2SubAllowanceTx }
  }

  /**
   * Computes the slippage-protected minimum source-vault shares for `depositAndCreate`.
   * Uses convertToShares (fee-exclusive) — NOT previewDeposit, which can bake in a deposit
   * fee and is not a valid floor (per contract team).
   * expectedMinShares = floor(sourceVault.convertToShares(assetAmount) * (10_000 - slippageBps) / 10_000)
   */
  private async _expectedMinShares(params: {
    chainId: ChainId
    sourceVault: AddressValue
    inAsset: AddressValue
    assetAmount: bigint
    slippageBps: bigint
  }): Promise<bigint> {
    const chainInfo = getChainInfoByChainId(params.chainId)
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo,
      address: Address.createFromEthereum({ value: params.sourceVault }),
    })
    const amount = TokenAmount.createFromBaseUnit({
      token: Token.createFrom({
        address: Address.createFromEthereum({ value: params.inAsset }),
        chainInfo,
        symbol: 'IN',
        name: 'IN',
        decimals: 18, // base-unit amount; decimals only affect display, not toSolidityValue
      }),
      amount: params.assetAmount.toString(),
    })
    // convertToShares takes { amount } and returns shares as ITokenAmount (see IErc4626Contract)
    const expectedShares = await fleetContract.asErc4626().convertToShares({ amount })
    const expected = expectedShares.toSolidityValue() // bigint, base units of shares
    const bps = 10_000n
    return (expected * (bps - params.slippageBps)) / bps
  }

  /** @see IDCAManager.editStrategyTx */
  async editStrategyTx(
    params: Parameters<IDCAManager['editStrategyTx']>[0],
  ): ReturnType<IDCAManager['editStrategyTx']> {
    this._assertSupportedChain(params.chainId)
    const strategyStatus = params.strategy.status
    if (![DcaStrategyStatusEnum.Active, DcaStrategyStatusEnum.Paused].includes(strategyStatus)) {
      throw new Error('Can only edit strategies with status active or paused')
    }
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    // oldConfig must hash to the on-chain commitment (proven by `onlyStrategyOwner`), so it is
    // built from the unmodified current strategy; newConfig is the merge of the requested update.
    const oldStrategyConfig = this._strategyToStrategyConfig({ strategy: params.strategy })
    const updatedStrategy: IDcaStrategy = { ...params.strategy, ...params.update }
    const newStrategyConfig = this._strategyToStrategyConfig({ strategy: updatedStrategy })
    return [
      this._buildStrategyConfigTransaction({
        strategyManagerAddress,
        strategyId: params.strategy.strategyId,
        oldStrategyConfig,
        newStrategyConfig,
        functionName: 'editStrategy',
        description: 'Edit DCA strategy',
        type: TransactionType.EditStrategy,
        metadata: { strategy: updatedStrategy },
      }),
    ] as [EditDcaStrategyTransactionInfo]
  }

  /** @see IDCAManager.pauseStrategyTx */
  async pauseStrategyTx(
    params: Parameters<IDCAManager['pauseStrategyTx']>[0],
  ): ReturnType<IDCAManager['pauseStrategyTx']> {
    this._assertSupportedChain(params.chainId)
    const strategyStatus = params.strategy.status
    if (strategyStatus !== DcaStrategyStatusEnum.Active) {
      throw new Error('Can only pause strategies with status active')
    }
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._strategyToStrategyConfig({ strategy: params.strategy })
    return [
      this._buildStrategyIdTransaction({
        strategyManagerAddress,
        strategyId: params.strategy.strategyId,
        strategyConfig,
        functionName: 'pauseStrategy',
        description: 'Pause DCA strategy',
        type: TransactionType.PauseStrategy,
      }),
    ] as [PauseDcaStrategyTransactionInfo]
  }

  /** @see IDCAManager.resumeStrategyTx */
  async resumeStrategyTx(
    params: Parameters<IDCAManager['resumeStrategyTx']>[0],
  ): ReturnType<IDCAManager['resumeStrategyTx']> {
    this._assertSupportedChain(params.chainId)
    const strategyStatus = params.strategy.status
    if (strategyStatus !== DcaStrategyStatusEnum.Paused) {
      throw new Error('Can only resume strategies with status paused')
    }
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._strategyToStrategyConfig({
      strategy: params.strategy,
    })
    return [
      this._buildStrategyConfigTransaction({
        strategyManagerAddress,
        strategyId: params.strategy.strategyId,
        // resumeStrategy takes only the current config; both slots carry it so the shared builder
        // encodes a single-config call.
        oldStrategyConfig: strategyConfig,
        newStrategyConfig: strategyConfig,
        functionName: 'resumeStrategy',
        description: 'Resume DCA strategy',
        type: TransactionType.ResumeStrategy,
        metadata: { strategy: params.strategy },
      }),
    ] as [ResumeDcaStrategyTransactionInfo]
  }

  /** @see IDCAManager.cancelStrategyTx */
  async cancelStrategyTx(
    params: Parameters<IDCAManager['cancelStrategyTx']>[0],
  ): ReturnType<IDCAManager['cancelStrategyTx']> {
    this._assertSupportedChain(params.chainId)
    const strategyStatus = params.strategy.status
    if (![DcaStrategyStatusEnum.Active, DcaStrategyStatusEnum.Paused].includes(strategyStatus)) {
      throw new Error('Can only cancel strategies with status active or paused')
    }

    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._strategyToStrategyConfig({ strategy: params.strategy })
    return [
      this._buildStrategyIdTransaction({
        strategyManagerAddress,
        strategyId: params.strategy.strategyId,
        strategyConfig,
        functionName: 'cancelStrategy',
        description: 'Cancel DCA strategy',
        type: TransactionType.CancelStrategy,
      }),
    ] as [CancelDcaStrategyTransactionInfo]
  }

  /** @see IDCAManager.getStrategies */
  async getStrategies(
    params: Parameters<IDCAManager['getStrategies']>[0],
  ): ReturnType<IDCAManager['getStrategies']> {
    this._assertSupportedChain(params.chainId)
    const result = await this._dcaSubgraphManager.getStrategies({ chainId: params.chainId })
    let subgraphStrategies = result.strategies
    if (params.userAddress) {
      const lowerAddress = params.userAddress.toLowerCase()
      subgraphStrategies = subgraphStrategies.filter(
        (s) => s.owner.id.toLowerCase() === lowerAddress,
      )
    }
    if (params.status) {
      const lowerStatus = params.status.toLowerCase()
      subgraphStrategies = subgraphStrategies.filter((s) => s.status.toLowerCase() === lowerStatus)
    }
    const strategies = subgraphStrategies.map((s) =>
      this._mapSubgraphStrategyToStrategy(s, params.chainId),
    )
    return strategies
  }

  /** @see IDCAManager.getStrategy */
  async getStrategy(
    params: Parameters<IDCAManager['getStrategy']>[0],
  ): ReturnType<IDCAManager['getStrategy']> {
    this._assertSupportedChain(params.chainId)
    const strategies = await this.getStrategies({ chainId: params.chainId })
    const strategy = strategies.find((s) => s.strategyId.toString() === params.strategyId)
    return strategy
  }

  /** @see IDCAManager.getExecutions */
  async getExecutions(
    params: Parameters<IDCAManager['getExecutions']>[0],
  ): ReturnType<IDCAManager['getExecutions']> {
    this._assertSupportedChain(params.chainId)
    const { executions } = await this._dcaSubgraphManager.getExecutions({
      chainId: params.chainId,
      strategyId: params.strategyId,
    })
    return executions.map((e) => this._mapSubgraphExecutionToExecution(e))
  }

  /** @see IDCAManager.getExecution */
  async getExecution(
    params: Parameters<IDCAManager['getExecution']>[0],
  ): ReturnType<IDCAManager['getExecution']> {
    this._assertSupportedChain(params.chainId)
    const executions = await this.getExecutions({
      chainId: params.chainId,
      strategyId: params.strategyId,
    })
    return executions.find((e) => e.id.toLowerCase() === params.executionId.toLowerCase())
  }

  private _mapSubgraphExecutionToExecution(
    subgraphExecution: Awaited<
      ReturnType<typeof this._dcaSubgraphManager.getExecutions>
    >['executions'][0],
  ): IDcaExecution {
    return {
      id: subgraphExecution.id,
      txHash: subgraphExecution.txHash,
      executionTimestamp: Number(subgraphExecution.executionTimestamp),
      amountIn: subgraphExecution.amountIn.toString(),
      amountOut: subgraphExecution.amountOut.toString(),
      tradesExecutedAfter: Number(subgraphExecution.tradesExecutedAfter),
    }
  }

  private _mapSubgraphStrategyToStrategy(
    subgraphStrategy: GetStrategiesQuery['strategies'][0],
    chainId: ChainId,
  ): IDcaStrategy {
    return {
      id: subgraphStrategy.id,
      strategyId: BigInt(subgraphStrategy.strategyId.toString()),
      ownerAddress: subgraphStrategy.owner.id as AddressValue,
      chainId,
      sourceVault: subgraphStrategy.sourceVault as AddressValue,
      targetVault: subgraphStrategy.targetVault as AddressValue,
      inAsset: subgraphStrategy.inAsset as AddressValue,
      outAsset: subgraphStrategy.outAsset as AddressValue,
      inAssetFeed: {
        feed: subgraphStrategy.inAssetFeed as AddressValue,
        maxStaleness: BigInt(subgraphStrategy.inAssetFeedStaleness ?? 0),
      },
      outAssetFeed: {
        feed: subgraphStrategy.outAssetFeed as AddressValue,
        maxStaleness: BigInt(subgraphStrategy.outAssetFeedStaleness ?? 0),
      },
      tradeAmount: BigInt(subgraphStrategy.tradeAmount.toString()),
      slippagePercentage: Number(subgraphStrategy.slippageBps) / 100,
      intervalSeconds: BigInt(subgraphStrategy.interval.toString()),
      nextTriggerAtUnixTimestamp: BigInt(subgraphStrategy.nextTriggerAt.toString()),
      lastScheduledAtUnixTimestamp: BigInt(subgraphStrategy.lastScheduledAt.toString()),
      deadlineUnixTimestamp: BigInt(subgraphStrategy.endDate.toString()),
      status: subgraphStrategy.status as DcaStrategyStatusEnum,
      maxTrades: BigInt(subgraphStrategy.maxTrades.toString()),
      tradesExecuted: BigInt(subgraphStrategy.tradesExecuted.toString()),
      neverBuyAbove: subgraphStrategy.maxPrice.toString(),
      neverSellBelow: subgraphStrategy.minPrice.toString(),
      createdAtUnixTimestamp: BigInt(subgraphStrategy.createdAt.toString()),
      updatedAtUnixTimestamp: BigInt(subgraphStrategy.updatedAt.toString()),
    }
  }

  private _strategyToStrategyConfig(params: { strategy: IDcaStrategy }): IDcaStrategyConfig {
    return {
      owner: params.strategy.ownerAddress,
      sourceVault: params.strategy.sourceVault,
      targetVault: params.strategy.targetVault,
      inAsset: params.strategy.inAsset,
      outAsset: params.strategy.outAsset,
      inAssetFeed: params.strategy.inAssetFeed,
      outAssetFeed: params.strategy.outAssetFeed,
      tradeAmount: params.strategy.tradeAmount,
      interval: params.strategy.intervalSeconds,
      slippageBps: BigInt(Math.round(params.strategy.slippagePercentage * 100)),
      maxPrice: BigInt(params.strategy.neverBuyAbove),
      minPrice: BigInt(params.strategy.neverSellBelow),
      endDate: params.strategy.deadlineUnixTimestamp,
      maxTrades: params.strategy.maxTrades,
    }
  }

  private _buildStrategyConfigTransaction(params: {
    strategyManagerAddress: AddressValue
    strategyId: bigint
    /** Current on-chain config; hashed against the stored commitment for ownership proof. */
    oldStrategyConfig: IDcaStrategyConfig
    /** Desired config. Equal to `oldStrategyConfig` for `resumeStrategy` (which takes one config). */
    newStrategyConfig: IDcaStrategyConfig
    functionName: 'editStrategy' | 'resumeStrategy'
    description: string
    type: TransactionType.EditStrategy | TransactionType.ResumeStrategy
    metadata: {
      strategy: IDcaStrategy
    }
  }): EditDcaStrategyTransactionInfo | ResumeDcaStrategyTransactionInfo {
    const oldViemConfig = this._toViemStrategyConfig(params.oldStrategyConfig)
    const newViemConfig = this._toViemStrategyConfig(params.newStrategyConfig)
    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: params.functionName,
      // editStrategy(strategyId, oldConfig, newConfig); resumeStrategy(strategyId, config).
      args:
        params.functionName === 'editStrategy'
          ? [params.strategyId, oldViemConfig, newViemConfig]
          : [params.strategyId, oldViemConfig],
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
    strategyId: bigint
    strategyConfig: IDcaStrategyConfig
    functionName: 'pauseStrategy' | 'cancelStrategy'
    description: string
    type: TransactionType.PauseStrategy | TransactionType.CancelStrategy
  }): PauseDcaStrategyTransactionInfo | CancelDcaStrategyTransactionInfo {
    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: params.functionName,
      args: [params.strategyId, this._toViemStrategyConfig(params.strategyConfig)],
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

  private _toViemStrategyConfig(config: IDcaStrategyConfig): IDcaStrategyConfig {
    return {
      owner: config.owner,
      sourceVault: config.sourceVault,
      targetVault: config.targetVault,
      inAsset: config.inAsset,
      outAsset: config.outAsset,
      inAssetFeed: config.inAssetFeed,
      outAssetFeed: config.outAssetFeed,
      tradeAmount: config.tradeAmount,
      interval: config.interval,
      slippageBps: config.slippageBps,
      maxPrice: config.maxPrice,
      minPrice: config.minPrice,
      endDate: config.endDate,
      maxTrades: config.maxTrades,
    }
  }
}
