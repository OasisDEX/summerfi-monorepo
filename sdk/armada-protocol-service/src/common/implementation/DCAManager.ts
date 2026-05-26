import type { IDCAManager } from '@summerfi/armada-protocol-common'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'
import type { IDcaSubgraphManager, GetStrategiesQuery } from '@summerfi/subgraph-manager-common'
import {
  type AddressValue,
  type ChainId,
  type HexData,
  type IDcaStrategy,
  type IDcaExecution,
  type IArmadaDcaStrategyConfig,
  Address,
  DcaStrategyStatusEnum,
  TransactionType,
  type CreateDcaStrategyTransactionInfo,
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

  constructor(params: {
    clientId?: string
    deploymentProvider: IDeploymentProvider
    dcaSubgraphManager: IDcaSubgraphManager
  }) {
    super({ clientId: params.clientId })
    this._deploymentProvider = params.deploymentProvider
    this._dcaSubgraphManager = params.dcaSubgraphManager
  }

  async createStrategyTx(
    params: Parameters<IDCAManager['createStrategyTx']>[0],
  ): ReturnType<IDCAManager['createStrategyTx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig: IArmadaDcaStrategyConfig = {
      strategyId: '0',
      owner: params.userAddress,
      sourceVault: params.fromVault,
      targetVault: params.toVault,
      inAsset: params.inAsset,
      outAsset: params.outAsset,
      inAssetFeed: params.inAssetFeed,
      outAssetFeed: params.outAssetFeed,
      tradeAmount: params.amountShares,
      interval: String(params.intervalSeconds),
      slippageBps: String(Math.round(Number(params.slippagePercentage) * 100)),
      maxPrice: params.neverBuyAbove ?? '0',
      minPrice: params.neverSellBelow ?? '0',
      endDate: String(params.deadlineUnixTimestamp ?? 0),
      maxTrades: String(params.maxTrades),
    }
    return [
      this._buildCreateTransaction({
        strategyManagerAddress,
        strategyConfig,
        functionName: 'createStrategy',
        description: 'Create DCA strategy',
        type: TransactionType.CreateStrategy,
      }),
    ] as [CreateDcaStrategyTransactionInfo]
  }

  async editStrategyTx(
    params: Parameters<IDCAManager['editStrategyTx']>[0],
  ): ReturnType<IDCAManager['editStrategyTx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._strategyToStrategyConfig({
      strategy: params.strategy,
      strategyId: params.strategyId,
    })
    return [
      this._buildStrategyConfigTransaction({
        strategyManagerAddress,
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
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    return [
      this._buildStrategyIdTransaction({
        strategyManagerAddress,
        strategyId: params.strategyId,
        functionName: 'pauseStrategy',
        description: 'Pause DCA strategy',
        type: TransactionType.PauseStrategy,
      }),
    ] as [PauseDcaStrategyTransactionInfo]
  }

  async resumeStrategyTx(
    params: Parameters<IDCAManager['resumeStrategyTx']>[0],
  ): ReturnType<IDCAManager['resumeStrategyTx']> {
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    const strategyConfig = this._strategyToStrategyConfig({
      strategy: params.strategy,
      strategyId: params.strategyId,
    })
    return [
      this._buildStrategyConfigTransaction({
        strategyManagerAddress,
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
    const strategyManagerAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'dcaStrategyManager',
      chainId: params.chainId,
    }).value
    return [
      this._buildStrategyIdTransaction({
        strategyManagerAddress,
        strategyId: params.strategyId,
        functionName: 'cancelStrategy',
        description: 'Cancel DCA strategy',
        type: TransactionType.CancelStrategy,
      }),
    ] as [CancelDcaStrategyTransactionInfo]
  }

  async getStrategies(
    params: Parameters<IDCAManager['getStrategies']>[0],
  ): ReturnType<IDCAManager['getStrategies']> {
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
    const strategies = await this.getStrategies({ chainId: params.chainId })
    return strategies.find((s) => s.id === params.strategyId)
  }

  async getExecutions(
    params: Parameters<IDCAManager['getExecutions']>[0],
  ): ReturnType<IDCAManager['getExecutions']> {
    const { executions } = await this._dcaSubgraphManager.getExecutions({
      chainId: params.chainId,
      strategyId: params.strategyId,
    })
    return executions.map((e) => this._mapSubgraphExecutionToExecution(e))
  }

  async getExecution(
    params: Parameters<IDCAManager['getExecution']>[0],
  ): ReturnType<IDCAManager['getExecution']> {
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
      id: subgraphStrategy.strategyId.toString(),
      userAddress: subgraphStrategy.owner.id as AddressValue,
      chainId,
      fromVault: subgraphStrategy.sourceVault as AddressValue,
      toVault: subgraphStrategy.targetVault as AddressValue,
      inAsset: subgraphStrategy.inAsset as AddressValue,
      outAsset: subgraphStrategy.outAsset as AddressValue,
      inAssetFeed: subgraphStrategy.inAssetFeed as AddressValue,
      outAssetFeed: subgraphStrategy.outAssetFeed as AddressValue,
      amount: subgraphStrategy.tradeAmount.toString(),
      slippage: String(Number(subgraphStrategy.slippageBps) / 100),
      intervalSeconds: Number(subgraphStrategy.interval),
      nextExecutionAtUnixTimestamp: Number(subgraphStrategy.nextTriggerAt),
      deadlineUnixTimestamp:
        subgraphStrategy.endDate > 0n ? Number(subgraphStrategy.endDate) : undefined,
      maxTrades: Number(subgraphStrategy.maxTrades),
      tradesExecuted: Number(subgraphStrategy.tradesExecuted),
      status: subgraphStrategy.status.toLowerCase() as DcaStrategyStatusEnum,
      createdAt: Number(subgraphStrategy.createdAt),
      updatedAt: Number(subgraphStrategy.updatedAt),
      neverBuyAbove:
        subgraphStrategy.maxPrice > 0n ? subgraphStrategy.maxPrice.toString() : undefined,
      neverSellBelow:
        subgraphStrategy.minPrice > 0n ? subgraphStrategy.minPrice.toString() : undefined,
    }
  }

  private _strategyToStrategyConfig(params: {
    strategy: IDcaStrategy
    strategyId: string
  }): IArmadaDcaStrategyConfig {
    return {
      strategyId: params.strategyId,
      owner: params.strategy.userAddress,
      sourceVault: params.strategy.fromVault,
      targetVault: params.strategy.toVault,
      inAsset: params.strategy.inAsset,
      outAsset: params.strategy.outAsset,
      inAssetFeed: params.strategy.inAssetFeed,
      outAssetFeed: params.strategy.outAssetFeed,
      tradeAmount: params.strategy.amount,
      interval: String(params.strategy.intervalSeconds),
      slippageBps: String(Math.round(Number(params.strategy.slippage) * 100)),
      maxPrice: params.strategy.neverBuyAbove ?? '0',
      minPrice: params.strategy.neverSellBelow ?? '0',
      endDate: String(params.strategy.deadlineUnixTimestamp ?? 0),
      maxTrades: String(params.strategy.maxTrades),
    }
  }

  private _buildCreateTransaction(params: {
    strategyManagerAddress: AddressValue
    strategyConfig: IArmadaDcaStrategyConfig
    functionName: 'createStrategy'
    description: string
    type: TransactionType.CreateStrategy
  }): CreateDcaStrategyTransactionInfo {
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
    }
  }

  private _buildStrategyConfigTransaction(params: {
    strategyManagerAddress: AddressValue
    strategyConfig: IArmadaDcaStrategyConfig
    functionName: 'editStrategy' | 'resumeStrategy'
    description: string
    type: TransactionType.EditStrategy | TransactionType.ResumeStrategy
    metadata: {
      strategy: IDcaStrategy
    }
  }): EditDcaStrategyTransactionInfo | ResumeDcaStrategyTransactionInfo {
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
}
