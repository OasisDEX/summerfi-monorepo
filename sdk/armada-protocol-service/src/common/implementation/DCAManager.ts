import type { IDCAManager } from '@summerfi/armada-protocol-common'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'
import type { IDcaSubgraphManager, GetStrategiesQuery } from '@summerfi/subgraph-manager-common'
import {
  type AddressValue,
  type ChainId,
  type HexData,
  type IDcaStrategy,
  type IDcaExecution,
  type IDcaStrategyConfig,
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
    const calldata = encodeFunctionData({
      abi: DCAStrategyManagerAbi,
      functionName: 'createStrategy',
      args: [
        {
          owner: params.userAddress,
          sourceVault: params.fromVault,
          targetVault: params.toVault,
          inAsset: params.inAsset,
          outAsset: params.outAsset,
          inAssetFeed: params.inAssetFeed,
          outAssetFeed: params.outAssetFeed,
          tradeAmount: BigInt(params.amountShares),
          interval: BigInt(params.intervalSeconds),
          slippageBps: BigInt(Math.round(Number(params.slippagePercentage) * 100)),
          maxPrice: BigInt(params.neverBuyAbove ?? '0'),
          minPrice: BigInt(params.neverSellBelow ?? '0'),
          endDate: BigInt(params.deadlineUnixTimestamp),
          maxTrades: BigInt(params.maxTrades),
        },
      ],
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

  async editStrategyTx(
    params: Parameters<IDCAManager['editStrategyTx']>[0],
  ): ReturnType<IDCAManager['editStrategyTx']> {
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
    return strategies.find((s) => s.strategyId.toString() === params.strategyId)
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
      id: subgraphStrategy.id,
      strategyId: subgraphStrategy.strategyId,
      ownerAddress: subgraphStrategy.owner.id as AddressValue,
      chainId,
      sourceVault: subgraphStrategy.sourceVault as AddressValue,
      targetVault: subgraphStrategy.targetVault as AddressValue,
      inAsset: subgraphStrategy.inAsset as AddressValue,
      outAsset: subgraphStrategy.outAsset as AddressValue,
      inAssetFeed: subgraphStrategy.inAssetFeed as AddressValue,
      outAssetFeed: subgraphStrategy.outAssetFeed as AddressValue,
      tradeAmount: subgraphStrategy.tradeAmount,
      slippagePercentage: Number(subgraphStrategy.slippageBps) / 100,
      intervalSeconds: subgraphStrategy.interval,
      nextTriggerAtUnixTimestamp: subgraphStrategy.nextTriggerAt,
      lastScheduledAtUnixTimestamp: subgraphStrategy.lastScheduledAt,
      deadlineUnixTimestamp: subgraphStrategy.endDate,
      maxTrades: subgraphStrategy.maxTrades,
      tradesExecuted: subgraphStrategy.tradesExecuted,
      status: subgraphStrategy.status.toLowerCase() as DcaStrategyStatusEnum,
      createdAt: subgraphStrategy.createdAt,
      updatedAt: subgraphStrategy.updatedAt,
      neverBuyAbove: subgraphStrategy.maxPrice.toString(),
      neverSellBelow: subgraphStrategy.minPrice.toString(),
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

  private _buildCreateTransaction(params: {
    strategyManagerAddress: AddressValue
    strategyConfig: IDcaStrategyConfig
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
