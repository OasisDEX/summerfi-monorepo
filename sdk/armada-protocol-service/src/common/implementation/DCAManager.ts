import type { IDCAManager } from '@summerfi/armada-protocol-common'
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
  Address,
  Token,
  TokenAmount,
  getChainInfoByChainId,
  isChainId,
  DcaStrategyStatusEnum,
  TransactionType,
  type EditDcaStrategyTransactionInfo,
  type PauseDcaStrategyTransactionInfo,
  type ResumeDcaStrategyTransactionInfo,
  type CancelDcaStrategyTransactionInfo,
} from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import { ArmadaManagerShared } from './ArmadaManagerShared'
import { DCAStrategyManagerAbi } from './abi/DCAStrategyManagerAbi'

/**
 * @name DCAManager
 * @description Handles creation and persistence of recurring DCA buy orders.
 */
export class DCAManager extends ArmadaManagerShared implements IDCAManager {
  private _deploymentProvider: IDeploymentProvider
  private _dcaSubgraphManager: IDcaSubgraphManager
  private _contractsProvider: IContractsProvider
  private _supportedChains: IChainInfo[]

  constructor(params: {
    clientId?: string
    configProvider: IConfigurationProvider
    deploymentProvider: IDeploymentProvider
    dcaSubgraphManager: IDcaSubgraphManager
    contractsProvider: IContractsProvider
  }) {
    super({ clientId: params.clientId })
    this._deploymentProvider = params.deploymentProvider
    this._dcaSubgraphManager = params.dcaSubgraphManager
    this._contractsProvider = params.contractsProvider
    this._supportedChains = params.configProvider
      .getConfigurationItem({ name: 'SUMMER_DEPLOYED_CHAINS_ID_DCA' })
      .split(',')
      .map(Number)
      .filter(isChainId)
      .map(getChainInfoByChainId)
  }

  /**
   * @name _assertSupportedChain
   * @description Throws unless the DCA module is deployed on `chainId`.
   */
  private _assertSupportedChain(chainId: ChainId): void {
    this.assertSupportedChain({ chainId, supportedChains: this._supportedChains })
  }

  async createStrategyTx(
    params: Parameters<IDCAManager['createStrategyTx']>[0],
  ): ReturnType<IDCAManager['createStrategyTx']> {
    this._assertSupportedChain(params.chainId)
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value

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

    const config = {
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

    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: 'depositAndCreate',
      args: [config, assetAmount, expectedMinShares],
    }) as HexData

    return [
      {
        type: TransactionType.CreateStrategy,
        description: 'Create DCA strategy',
        transaction: this._buildTransaction({
          target: strategyManagerAddress,
          calldata,
        }),
      },
    ]
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
    const strategyConfig = this._strategyToStrategyConfig({
      strategy: params.strategy,
    })
    return [
      this._buildStrategyConfigTransaction({
        strategyManagerAddress,
        strategyId: params.strategy.strategyId,
        strategyConfig,
        functionName: 'editStrategy',
        description: 'Edit DCA strategy',
        type: TransactionType.EditStrategy,
        metadata: { strategy: params.strategy },
      }),
    ] as [EditDcaStrategyTransactionInfo]
  }

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
        strategyConfig,
        functionName: 'resumeStrategy',
        description: 'Resume DCA strategy',
        type: TransactionType.ResumeStrategy,
        metadata: { strategy: params.strategy },
      }),
    ] as [ResumeDcaStrategyTransactionInfo]
  }

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

  async getStrategy(
    params: Parameters<IDCAManager['getStrategy']>[0],
  ): ReturnType<IDCAManager['getStrategy']> {
    this._assertSupportedChain(params.chainId)
    const strategies = await this.getStrategies({ chainId: params.chainId })
    const strategy = strategies.find((s) => s.strategyId.toString() === params.strategyId)
    return strategy
  }

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
    strategyConfig: IDcaStrategyConfig
    functionName: 'editStrategy' | 'resumeStrategy'
    description: string
    type: TransactionType.EditStrategy | TransactionType.ResumeStrategy
    metadata: {
      strategy: IDcaStrategy
    }
  }): EditDcaStrategyTransactionInfo | ResumeDcaStrategyTransactionInfo {
    const viemConfig = this._toViemStrategyConfig(params.strategyConfig)
    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: params.functionName,
      args:
        params.functionName === 'editStrategy'
          ? [params.strategyId, viemConfig, viemConfig]
          : [params.strategyId, viemConfig],
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
