import {
  Address,
  ArmadaMigrationType,
  FiatCurrency,
  FiatCurrencyAmount,
  LoggingService,
  Percentage,
  TokenAmount,
  TransactionType,
  type AddressValue,
  type ApproveTransactionInfo,
  type ArmadaMigratablePosition,
  type ArmadaMigratablePositionApy,
  type HexData,
  type IAddress,
  type IChainInfo,
  type IPercentage,
  type IToken,
  type ITokenAmount,
  type IUser,
  type MigrationTransactionInfo,
  type TransactionPriceImpact,
} from '@summerfi/sdk-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  getAaveV3Address,
  getDeployedContractAddress,
  type IArmadaManagerMigrations,
  type IArmadaVaultId,
} from '@summerfi/armada-protocol-common'
import { AdmiralsQuartersAbi } from '@summerfi/armada-protocol-abis'
import { encodeFunctionData } from 'viem'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { Erc20Contract } from '@summerfi/contracts-provider-service'
import { compoundConfigsByChainId } from './token-config/compound-config'
import { aaveV3ConfigsByChainId } from './token-config/aaveV3-config'
import { morphoBlueConfigsByChainId } from './token-config/morpho-blue-config'
import type { IOracleManager } from '@summerfi/oracle-common'
import {
  abiIsAllowed,
  abiAllow,
  abiAllowance,
  abiApprove,
  abiConvertToAssets,
  abiGetUserAccountData,
  abiBorrowBalanceOf,
} from './abi'
import type { ArmadaMigrationConfig } from './token-config/types'
import { BigNumber } from 'bignumber.js'

/**
 * @name ArmadaManagerMigrations
 * @description This class is the implementation of the IArmadaManagerMigrations interface
 */
export class ArmadaManagerMigrations implements IArmadaManagerMigrations {
  private _blockchainClientProvider: IBlockchainClientProvider
  private _contractsProvider: IContractsProvider
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _tokensManager: ITokensManager
  private _oracleManager: IOracleManager
  private _getSwapCall: (params: {
    vaultId: IArmadaVaultId
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }) => Promise<{
    calldata: HexData
    minAmount: ITokenAmount
    toAmount: ITokenAmount
  }>
  private _getPriceImpact: (params: {
    fromAmount: ITokenAmount
    toAmount: ITokenAmount
  }) => Promise<TransactionPriceImpact>

  private _supportedChains: IChainInfo[]
  private _hubChainInfo: IChainInfo

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    contractsProvider: IContractsProvider
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    tokensManager: ITokensManager
    supportedChains: IChainInfo[]
    hubChainInfo: IChainInfo
    oracleManager: IOracleManager
    getSwapCall: (params: {
      vaultId: IArmadaVaultId
      fromAmount: ITokenAmount
      toToken: IToken
      slippage: IPercentage
    }) => Promise<{
      calldata: HexData
      minAmount: ITokenAmount
      toAmount: ITokenAmount
    }>
    getPriceImpact: (params: {
      fromAmount: ITokenAmount
      toAmount: ITokenAmount
    }) => Promise<TransactionPriceImpact>
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._contractsProvider = params.contractsProvider
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._tokensManager = params.tokensManager
    this._supportedChains = params.supportedChains
    this._hubChainInfo = params.hubChainInfo
    this._oracleManager = params.oracleManager
    this._getSwapCall = params.getSwapCall
    this._getPriceImpact = params.getPriceImpact
  }

  async getMigratablePositions(
    params: Parameters<IArmadaManagerMigrations['getMigratablePositions']>[0],
  ): ReturnType<IArmadaManagerMigrations['getMigratablePositions']> {
    LoggingService.debug('getMigratablePositions: ', {
      chainId: params.chainInfo.chainId,
      user: params.user.wallet.address.value,
      migrationType: params.migrationType,
    })
    // read the users balances on provided chain/source for all supported tokens using multicall
    let positions: ArmadaMigratablePosition[] = []

    if (params.migrationType) {
      positions = await this._getPositions({
        chainInfo: params.chainInfo,
        user: params.user,
        migrationType: params.migrationType,
      })
    } else {
      const allMigrationTypes = Object.values(ArmadaMigrationType)
      const positionsPromises = allMigrationTypes.map((migrationType) =>
        this._getPositions({
          chainInfo: params.chainInfo,
          user: params.user,
          migrationType: migrationType as ArmadaMigrationType,
        }),
      )
      const positionsArrays = await Promise.all(positionsPromises)
      positions = positionsArrays.flat()
    }

    // filter positions with balance
    const nonEmptyPositions = positions.filter(
      (position) => position.positionTokenAmount.toSolidityValue() > 0n,
    )

    return {
      chainInfo: params.chainInfo,
      positions: nonEmptyPositions,
    }
  }

  private async _getPositions(params: {
    chainInfo: IChainInfo
    user: IUser
    migrationType: ArmadaMigrationType
  }): Promise<ArmadaMigratablePosition[]> {
    const configMapsPerType: Record<
      ArmadaMigrationType,
      Record<number, Record<string, ArmadaMigrationConfig>>
    > = {
      [ArmadaMigrationType.Compound]: compoundConfigsByChainId,
      [ArmadaMigrationType.AaveV3]: aaveV3ConfigsByChainId,
      [ArmadaMigrationType.Morpho]: morphoBlueConfigsByChainId,
    }

    const configMapsPerChain = configMapsPerType[params.migrationType]
    if (!configMapsPerChain) {
      throw new Error('Unsupported migration type: ' + params.migrationType)
    }

    // no configs for this chain
    const configMaps = configMapsPerChain[params.chainInfo.chainId]
    if (!configMaps || Object.keys(configMaps).length === 0) {
      return []
    }

    // get the blockchain client for the provided chain
    const client = await this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.chainInfo,
    })

    // read the balances for all supported tokens
    const positions = await Promise.all(
      Object.entries(configMaps).map(async ([_, config]) => {
        const positionErc20Contract = Erc20Contract.create({
          blockchainClient: client,
          tokensManager: this._tokensManager,
          chainInfo: params.chainInfo,
          address: Address.createFromEthereum({ value: config.positionAddress }),
        })

        const [positionBalance, underlyingToken] = await Promise.all([
          positionErc20Contract.balanceOf({
            address: params.user.wallet.address,
          }),
          this._tokensManager.getTokenByAddress({
            chainInfo: params.chainInfo,
            address: Address.createFromEthereum({ value: config.underlyingToken }),
          }),
        ])

        const [underlyingAmount] = await Promise.all([
          this._getUnderlyingAmount({
            borrowBalance: positionBalance,
            type: params.migrationType,
            underlyingToken,
          }),
        ])

        const debt = await this._getPositionDebt({
          chainInfo: params.chainInfo,
          migrationType: params.migrationType,
          user: params.user,
          positionAddress: config.positionAddress,
        })
        const hasDebt = debt > 0n

        return {
          id: config.positionAddress,
          migrationType: params.migrationType,
          positionTokenAmount: positionBalance,
          underlyingTokenAmount: underlyingAmount,
          hasDebt,
          usdValue: FiatCurrencyAmount.createFrom({
            amount: '0',
            fiat: FiatCurrency.USD,
          }),
        }
      }),
    )

    const tokens = positions.map((position) => {
      return position.underlyingTokenAmount.token
    })
    const prices = await this._oracleManager.getSpotPrices({
      chainInfo: params.chainInfo,
      baseTokens: tokens,
      quoteCurrency: FiatCurrency.USD,
    })

    const positionsWithPrices = positions.map((position) => {
      const price =
        prices.priceByAddress[position.underlyingTokenAmount.token.address.value.toLowerCase()]
      if (!price) {
        throw new Error(
          'No price found for token: ' + position.underlyingTokenAmount.token.address.value,
        )
      }

      return {
        ...position,
        usdValue: position.underlyingTokenAmount.multiply(price),
      }
    })

    const positionsWithoutDebt = positionsWithPrices.filter((position) => !position.hasDebt)

    // sort by usd value
    const sortedPositions = positionsWithoutDebt.sort((a, b) => {
      if (b.usdValue.toSolidityValue() > a.usdValue.toSolidityValue()) {
        return 1
      }
      if (b.usdValue.toSolidityValue() < a.usdValue.toSolidityValue()) {
        return -1
      }
      return 0
    })

    return sortedPositions as ArmadaMigratablePosition[]
  }

  private async _getPositionDebt(params: {
    chainInfo: IChainInfo
    migrationType: ArmadaMigrationType
    user: IUser
    positionAddress: AddressValue
  }): Promise<bigint> {
    switch (params.migrationType) {
      case ArmadaMigrationType.Compound:
        return this._getCompoundPositionDebt({
          chainInfo: params.chainInfo,
          user: params.user,
          positionAddress: params.positionAddress,
        })
      case ArmadaMigrationType.AaveV3:
        return this._getAaveV3PositionDebt({
          chainInfo: params.chainInfo,
          user: params.user,
          positionAddress: params.positionAddress,
        })
      case ArmadaMigrationType.Morpho:
        // morpho does not have debt
        return 0n
      default:
        throw new Error('Unsupported migration type: ' + params.migrationType)
    }
  }

  private async _getCompoundPositionDebt(params: {
    chainInfo: IChainInfo
    user: IUser
    positionAddress: AddressValue
  }): Promise<bigint> {
    const client = await this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.chainInfo,
    })

    const borrowBalance = await client.readContract({
      abi: abiBorrowBalanceOf,
      address: params.positionAddress,
      functionName: 'borrowBalanceOf',
      args: [params.user.wallet.address.value],
    })

    return borrowBalance
  }

  private async _getAaveV3PositionDebt(params: {
    chainInfo: IChainInfo
    user: IUser
    positionAddress: AddressValue
  }): Promise<bigint> {
    const client = await this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.chainInfo,
    })

    const [, totalDebtBase] = await client.readContract({
      abi: abiGetUserAccountData,
      address: getAaveV3Address({
        chainInfo: params.chainInfo,
        contractName: 'pool',
      }).value,
      functionName: 'getUserAccountData',
      args: [params.user.wallet.address.value],
    })

    return totalDebtBase
  }

  private async _getUnderlyingAmount(params: {
    borrowBalance: ITokenAmount
    type: ArmadaMigrationType
    underlyingToken: IToken
  }) {
    switch (params.type) {
      case ArmadaMigrationType.Compound:
        return TokenAmount.createFrom({
          token: params.underlyingToken,
          amount: params.borrowBalance.amount,
        })
      case ArmadaMigrationType.AaveV3:
        return TokenAmount.createFrom({
          token: params.underlyingToken,
          amount: params.borrowBalance.amount,
        })
      case ArmadaMigrationType.Morpho: {
        const client = await this._blockchainClientProvider.getBlockchainClient({
          chainInfo: params.borrowBalance.token.chainInfo,
        })
        const convertedBalance = await client.readContract({
          abi: abiConvertToAssets,
          address: params.borrowBalance.token.address.value,
          functionName: 'convertToAssets',
          args: [params.borrowBalance.toSolidityValue()],
        })

        return TokenAmount.createFromBaseUnit({
          token: params.underlyingToken,
          amount: convertedBalance.toString(),
        })
      }
      default:
        throw new Error('Unsupported migration type: ' + params.type)
    }
  }

  async getMigratablePositionsApy(
    params: Parameters<IArmadaManagerMigrations['getMigratablePositionsApy']>[0],
  ): ReturnType<IArmadaManagerMigrations['getMigratablePositionsApy']> {
    LoggingService.debug('getMigratablePositionsApy: ', {
      chainId: params.chainInfo.chainId,
      positionIds: params.positionIds.join(', '),
    })
    // read apy timeseries for all position ids
    const baseUrl = 'https://yields.llama.fi/chart/'
    const records = await Promise.all(
      params.positionIds.map(async (positionId) => {
        const defillamaId = this._getDefillamaId(positionId)
        if (!defillamaId) {
          return Promise.resolve({
            positionId: positionId,
            apy: null,
            apy7d: null,
          } as ArmadaMigratablePositionApy)
        }
        const url = `${baseUrl}${defillamaId}`
        const response = await fetch(url)
        const json = (await response.json()) as {
          data: {
            apy: number
            apyBase: number
            apyReward: number | null
          }[]
        }
        // take the last record for current apy
        const apy = json.data[json.data.length - 1].apy

        // take last 7 records for the 7 days and calculate the SMA fer the last 7 days
        const last7Records = json.data.slice(-7)
        const apy7d = last7Records.reduce((acc, record) => acc + record.apy, 0) / 7
        // take last 30 records for the 30 days and calculate the SMA fer the last 30 days
        const last30Records = json.data.slice(-30)
        const apy30d = last30Records.reduce((acc, record) => acc + record.apy, 0) / 30

        return {
          positionId: positionId,
          apy: Percentage.createFrom({ value: apy }),
          apy7d: Percentage.createFrom({ value: apy7d }),
          apy30d: Percentage.createFrom({ value: apy30d }),
        } as ArmadaMigratablePositionApy
      }),
    )

    // return the apy in a record structure with position id as key
    const apyByPositionId: Record<string, ArmadaMigratablePositionApy> = {}
    records.forEach((record) => {
      apyByPositionId[record.positionId] = record
    })

    return {
      chainInfo: params.chainInfo,
      apyByPositionId,
    }
  }

  private _getDefillamaId(positionId: string) {
    const configMapsPerType: Record<
      ArmadaMigrationType,
      Record<number, Record<string, ArmadaMigrationConfig>>
    > = {
      [ArmadaMigrationType.Compound]: compoundConfigsByChainId,
      [ArmadaMigrationType.AaveV3]: aaveV3ConfigsByChainId,
      [ArmadaMigrationType.Morpho]: morphoBlueConfigsByChainId,
    }

    const allMigrationTypes = Object.values(ArmadaMigrationType)
    for (const migrationType of allMigrationTypes) {
      const configMapsPerChain = configMapsPerType[migrationType]
      if (!configMapsPerChain) {
        continue
      }
      for (const chainId in configMapsPerChain) {
        const configMaps = configMapsPerChain[chainId]
        if (!configMaps) {
          continue
        }
        for (const [, config] of Object.entries(configMaps)) {
          if (config.positionAddress === positionId) {
            return config.pool
          }
        }
      }
    }
    return null
  }

  async getMigrationTX(
    params: Parameters<IArmadaManagerMigrations['getMigrationTX']>[0],
  ): ReturnType<IArmadaManagerMigrations['getMigrationTX']> {
    LoggingService.debug('getMigrationTX: ', {
      user: params.user.wallet.address.value,
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
      slippage: params.slippage.toString(),
      shouldStake: params.shouldStake,
    })
    if (!params.positionIds || params.positionIds.length === 0) {
      throw new Error('PositionIds are required')
    }

    const shouldStake = params.shouldStake ?? true

    const multicallArgs: HexData[] = []
    const multicallOperations: string[] = []

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    const positionsResponse = await this.getMigratablePositions({
      chainInfo: params.vaultId.chainInfo,
      user: params.user,
    })

    const filteredPositions = positionsResponse.positions.filter((position) =>
      params.positionIds.some((id) => id === position.id),
    )

    if (filteredPositions.length === 0) {
      throw new Error(
        'No positions found to migrate for the provided position ids: ' + params.positionIds,
      )
    }

    LoggingService.debug('positions: ', {
      positionsIds: params.positionIds.join(', '),
      positionsResponse: positionsResponse.positions.map((position) => position.id).join(', '),
      filteredPositions: filteredPositions.map((position) => position.id).join(', '),
    })

    // get the move calls to multicall
    const moveCalls = filteredPositions.map((position) => this._getMoveCall({ ...position }))
    multicallArgs.push(...moveCalls.map((call) => call.call))
    multicallOperations.push(...moveCalls.map((call) => call.operation))

    // check the fleet token
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    const fleetToken = await fleetContract.asErc4626().asset()

    const swapAmountByPositionId: Record<string, ITokenAmount> = {}
    const priceImpactByPositionId: Record<string, TransactionPriceImpact> = {}

    LoggingService.debug('tokens: ', {
      fleetToken: fleetToken.toString(),
      moveCalls: moveCalls.map((call) => call.operation),
    })

    for (const position of filteredPositions) {
      // We need to swap position when token is not a fleet token
      if (!position.underlyingTokenAmount.token.equals(fleetToken)) {
        const swapCall = await this._getSwapCall({
          vaultId: params.vaultId,
          fromAmount: position.underlyingTokenAmount,
          toToken: fleetToken,
          slippage: params.slippage,
        })
        multicallArgs.push(swapCall.calldata)
        multicallOperations.push(
          `swap ${position.underlyingTokenAmount.toString()} to ${swapCall.toAmount.toString()} (min ${swapCall.minAmount.toString()})`,
        )
        swapAmountByPositionId[position.id] = swapCall.toAmount
        priceImpactByPositionId[position.id] = await this._getPriceImpact({
          fromAmount: position.underlyingTokenAmount,
          toAmount: swapCall.toAmount,
        })
      }
    }

    // when staking admirals quarters will receive LV tokens, otherwise the user
    const fleetTokenReceiver = shouldStake
      ? admiralsQuartersAddress.value
      : params.user.wallet.address.value
    const enterFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'enterFleet',
      args: [params.vaultId.fleetAddress.value, 0n, fleetTokenReceiver],
    })
    multicallArgs.push(enterFleetCalldata)
    multicallOperations.push('enterFleet all (0)')

    if (shouldStake) {
      const stakeCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'stake',
        args: [params.vaultId.fleetAddress.value, 0n],
      })
      multicallArgs.push(stakeCalldata)
      multicallOperations.push('stake all (0)')
    }

    // return the migration transaction info
    const multicallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [multicallArgs],
    })
    const multicallTransaction: MigrationTransactionInfo = {
      type: TransactionType.Migration,
      description: 'Migrating assets to Admirals Quarters: ' + multicallOperations.join(', '),
      transaction: {
        target: admiralsQuartersAddress,
        calldata: multicallCalldata,
        value: '0',
      },
      metadata: {
        swapAmountByPositionId,
        priceImpactByPositionId,
      },
    }
    LoggingService.debug(
      'multicallTransaction: ',
      multicallOperations.map((op) => op.toString()),
    )

    const approvalTransactions = await Promise.all(
      filteredPositions.map(async (position) => {
        return await this._getMigrationApproval(params.user, admiralsQuartersAddress, position)
      }),
    )

    const validApprovalTransactions = approvalTransactions.filter(
      (approval) => approval !== undefined,
    ) as ApproveTransactionInfo[]
    if (validApprovalTransactions.length > 0) {
      LoggingService.debug(
        'approvalTransactions: ',
        validApprovalTransactions.map((tx) => tx.metadata.approvalAmount.toString()),
      )
    }

    return validApprovalTransactions.length > 0
      ? [validApprovalTransactions, multicallTransaction]
      : [multicallTransaction]
  }

  private async _getMigrationApproval(
    user: IUser,
    spender: IAddress,
    position: ArmadaMigratablePosition,
  ) {
    switch (position.migrationType) {
      case ArmadaMigrationType.Compound:
        return this._getMigrationCompoundApproval(user, spender, position)
      case ArmadaMigrationType.AaveV3:
        return this._getMigrationErc20Approval(user, spender, position, true)
      case ArmadaMigrationType.Morpho:
        return this._getMigrationErc20Approval(user, spender, position)
      default:
        throw new Error('Unsupported migration type: ' + position.migrationType)
    }
  }

  private async _getMigrationCompoundApproval(
    user: IUser,
    spender: IAddress,
    position: ArmadaMigratablePosition,
  ): Promise<ApproveTransactionInfo | undefined> {
    const client = await this._blockchainClientProvider.getBlockchainClient({
      chainInfo: user.chainInfo,
    })

    // check if allowance is needed
    const isAllowed = await client.readContract({
      abi: abiIsAllowed,
      address: position.positionTokenAmount.token.address.value,
      functionName: 'isAllowed',
      args: [user.wallet.address.value, spender.value],
    })

    if (isAllowed) {
      return
    }

    // Approval for AQ
    const data = encodeFunctionData({
      abi: abiAllow,
      functionName: 'allow',
      args: [spender.value, true],
    })
    const approval: ApproveTransactionInfo = {
      description: `Approving Admirals Quarters to move ${position.positionTokenAmount} from ${position.migrationType}`,
      metadata: {
        approvalSpender: spender,
        approvalAmount: position.positionTokenAmount,
      },
      transaction: {
        target: position.positionTokenAmount.token.address,
        calldata: data,
        value: '0',
      },
      type: TransactionType.Approve,
    }
    return approval
  }

  private async _getMigrationErc20Approval(
    user: IUser,
    spender: IAddress,
    position: ArmadaMigratablePosition,
    isRebasing: boolean = false,
  ): Promise<ApproveTransactionInfo | undefined> {
    let requestedAmount = position.positionTokenAmount.toSolidityValue()

    if (isRebasing) {
      const rebasingAllowanceBuffer = 1.01 // 1%
      // when rebasing we need to slightly increase the amount to avoid failing transactions
      const compensatedAmount = new BigNumber(requestedAmount.toString())
        .multipliedBy(rebasingAllowanceBuffer)
        .toFixed(0)
      requestedAmount = BigInt(compensatedAmount)
    }

    // check if allowance is needed
    const client = await this._blockchainClientProvider.getBlockchainClient({
      chainInfo: user.chainInfo,
    })
    const allowance = await client.readContract({
      abi: abiAllowance,
      address: position.positionTokenAmount.token.address.value,
      functionName: 'allowance',
      args: [user.wallet.address.value, spender.value],
    })

    if (allowance >= requestedAmount) {
      return
    }

    // Approval for AQ
    const data = encodeFunctionData({
      abi: abiApprove,
      functionName: 'approve',
      args: [spender.value, requestedAmount],
    })
    const approval: ApproveTransactionInfo = {
      description: `Approving Admirals Quarters to move ${position.positionTokenAmount} from ${position.migrationType}`,
      metadata: {
        approvalSpender: spender,
        approvalAmount: position.positionTokenAmount,
      },
      transaction: {
        target: position.positionTokenAmount.token.address,
        calldata: data,
        value: '0',
      },
      type: TransactionType.Approve,
    }
    return approval
  }

  private _getMoveCall(position: ArmadaMigratablePosition) {
    const migrationAmount = 0n

    switch (position.migrationType) {
      case ArmadaMigrationType.Compound: {
        const moveAssetsCall = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'moveFromCompoundToAdmiralsQuarters',
          args: [position.positionTokenAmount.token.address.value, migrationAmount],
        })
        return {
          call: moveAssetsCall,
          operation: 'moveFromCompoundToAdmiralsQuarters: ' + migrationAmount,
        }
      }
      case ArmadaMigrationType.AaveV3: {
        const moveAssetsCall = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'moveFromAaveToAdmiralsQuarters',
          args: [position.positionTokenAmount.token.address.value, migrationAmount],
        })
        return {
          call: moveAssetsCall,
          operation: 'moveFromAaveToAdmiralsQuarters: ' + migrationAmount,
        }
      }
      case ArmadaMigrationType.Morpho: {
        const moveAssetsCall = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'moveFromERC4626ToAdmiralsQuarters',
          args: [position.positionTokenAmount.token.address.value, migrationAmount],
        })
        return {
          call: moveAssetsCall,
          operation: 'moveFromERC4626ToAdmiralsQuarters: ' + migrationAmount,
        }
      }
      default:
        throw new Error('Unsupported migration type: ' + position.migrationType)
    }
  }
}
