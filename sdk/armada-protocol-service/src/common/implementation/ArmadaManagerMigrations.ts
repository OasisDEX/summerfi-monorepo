import {
  Address,
  ArmadaMigrationType,
  FiatCurrency,
  FiatCurrencyAmount,
  LoggingService,
  TokenAmount,
  TransactionType,
  type ApproveTransactionInfo,
  type ArmadaMigratablePosition,
  type HexData,
  type IAddress,
  type IChainInfo,
  type IFiatCurrencyAmount,
  type IPercentage,
  type IToken,
  type ITokenAmount,
  type IUser,
  type MigrationTransactionInfo,
} from '@summerfi/sdk-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
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
import { erc4626ConfigsByChainId } from './token-config/erc4626-config'
import type { IOracleManager } from '@summerfi/oracle-common'
import {
  abiBalanceOf,
  abiIsAllowed,
  abiAllow,
  abiAllowance,
  abiApprove,
  abiConvertToAssets,
} from './abi'
import type { ArmadaMigrationConfig } from './token-config/types'

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
  }

  async getMigratablePositions(
    params: Parameters<IArmadaManagerMigrations['getMigratablePositions']>[0],
  ): ReturnType<IArmadaManagerMigrations['getMigratablePositions']> {
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

    // filter the tokens that have balance > 0
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
      [ArmadaMigrationType.Erc4626]: erc4626ConfigsByChainId,
    }

    const configMapsPerChain = configMapsPerType[params.migrationType]
    if (!configMapsPerChain) {
      throw new Error('Unsupported migration type: ' + params.migrationType)
    }
    const configMaps = configMapsPerChain[params.chainInfo.chainId]
    if (!configMaps) {
      throw new Error('No addresses mapping found for chain ' + params.chainInfo.chainId)
    }

    // no configs for this chain
    if (Object.values(configMaps).length === 0) {
      return []
    }

    // get the blockchain client for the provided chain
    const client = await this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.chainInfo,
    })

    // read the balances for all supported tokens
    const positions = await Promise.all(
      Object.entries(configMaps).map(async ([_, config]) => {
        const erc20Contract = Erc20Contract.create({
          blockchainClient: client,
          tokensManager: this._tokensManager,
          chainInfo: params.chainInfo,
          address: Address.createFromEthereum({ value: config.sourceContract }),
        })

        const [balance, token, underlyingToken] = await Promise.all([
          client.readContract({
            abi: abiBalanceOf,
            address: config.sourceContract,
            functionName: 'balanceOf',
            args: [params.user.wallet.address.value],
          }),
          erc20Contract.getToken(),
          this._tokensManager.getTokenByAddress({
            chainInfo: params.chainInfo,
            address: Address.createFromEthereum({ value: config.underlyingToken }),
          }),
        ])

        const [underlyingAmount] = await Promise.all([
          this._getUnderlyingAmount({
            balance: balance.toString(),
            type: params.migrationType,
            token: token,
            underlyingToken,
          }),
        ])

        return {
          id: config.sourceContract,
          migrationType: params.migrationType,
          positionTokenAmount: TokenAmount.createFromBaseUnit({
            token: token,
            amount: balance.toString(),
          }),
          underlyingTokenAmount: underlyingAmount,
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
      quote: FiatCurrency.USD,
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
      } as ArmadaMigratablePosition
    })

    return positionsWithPrices
  }

  private async _getUnderlyingAmount(params: {
    balance: string
    type: ArmadaMigrationType
    token: IToken
    underlyingToken: IToken
  }) {
    switch (params.type) {
      case ArmadaMigrationType.Compound:
        return TokenAmount.createFromBaseUnit({
          token: params.underlyingToken,
          amount: params.balance,
        })
      case ArmadaMigrationType.AaveV3:
        return TokenAmount.createFromBaseUnit({
          token: params.underlyingToken,
          amount: params.balance,
        })
      case ArmadaMigrationType.Erc4626: {
        const client = await this._blockchainClientProvider.getBlockchainClient({
          chainInfo: params.token.chainInfo,
        })
        const convertedBalance = await client.readContract({
          abi: abiConvertToAssets,
          address: params.token.address.value,
          functionName: 'convertToAssets',
          args: [BigInt(params.balance)],
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

  async getMigrationTX(
    params: Parameters<IArmadaManagerMigrations['getMigrationTX']>[0],
  ): ReturnType<IArmadaManagerMigrations['getMigrationTX']> {
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

    // get the migration transaction info from params
    const moveCalls = filteredPositions.map((position) => this._getMoveCall({ ...position }))
    multicallArgs.push(...moveCalls.map((call) => call.call))
    multicallOperations.push(...moveCalls.map((call) => call.operation))

    // check and swap migrated tokens to fleet token
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    const fleetToken = await fleetContract.asErc4626().asset()

    const swapAmountByPositionId: Record<string, ITokenAmount> = {}
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
      },
    }

    const approvalTransactions = await Promise.all(
      filteredPositions.map(async (position) => {
        return await this._getMigrationApproval(params.user, admiralsQuartersAddress, position)
      }),
    )

    const filteredApprovals = approvalTransactions.filter(
      (approval) => approval !== undefined,
    ) as ApproveTransactionInfo[]

    console.log('approvals: ', {
      approvalTransactions,
      filteredApprovals,
    })

    if (filteredApprovals.length > 0) {
      LoggingService.debug(
        'approvalTransactions: ',
        filteredApprovals.map((tx) => tx.metadata.approvalAmount.toString()),
      )
    }

    return filteredApprovals.length > 0
      ? [filteredApprovals, multicallTransaction]
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
      case ArmadaMigrationType.Erc4626:
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
  ): Promise<ApproveTransactionInfo | undefined> {
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

    if (allowance >= position.positionTokenAmount.toSolidityValue()) {
      return
    }

    // Approval for AQ
    const data = encodeFunctionData({
      abi: abiApprove,
      functionName: 'approve',
      args: [spender.value, position.positionTokenAmount.toSolidityValue()],
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
      case ArmadaMigrationType.Erc4626: {
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
