import {
  ArmadaMigrationType,
  ChainFamilyMap,
  LoggingService,
  TokenAmount,
  TransactionType,
  type AddressValue,
  type ApproveTransactionInfo,
  type HexData,
  type IChainInfo,
  type MigrationTransactionInfo,
} from '@summerfi/sdk-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  getDeployedContractAddress,
  type IArmadaManagerMigrations,
} from '@summerfi/armada-protocol-common'
import { AdmiralsQuartersAbi } from '@summerfi/armada-protocol-abis'
import { encodeFunctionData } from 'viem'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type { ITokensManager } from '@summerfi/tokens-common'

const addressesByChainId: Record<number, Record<string, AddressValue>> = {
  [ChainFamilyMap.Base.Base.chainId]: {
    usdc: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
    usdbc: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
    weth: '0x46e6b214b524310239732D51387075E0e70970bf',
    aero: '0x784efeB622244d2348d4F2522f8860B96fbEcE89',
  },
}

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
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._contractsProvider = params.contractsProvider
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._tokensManager = params.tokensManager
    this._supportedChains = params.supportedChains
    this._hubChainInfo = params.hubChainInfo
  }

  async getMigratablePositions(
    params: Parameters<IArmadaManagerMigrations['getMigratablePositions']>[0],
  ): ReturnType<IArmadaManagerMigrations['getMigratablePositions']> {
    // get the blockchain client for the provided chain
    const client = await this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.chainInfo,
    })
    // get supported tokens from compound protocol
    const contractCommon = {
      abi: [
        {
          inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ] as const,
    } as const
    const addresses = addressesByChainId[params.chainInfo.chainId]

    // read the users balances on provided chain for all supported tokens using multicall
    const balances = await Promise.all(
      Object.entries(addresses).map(async ([tokenSymbol, address]) => {
        const [balance, token] = await Promise.all([
          client.readContract({
            abi: contractCommon.abi,
            address: address,
            functionName: 'balanceOf',
            args: [params.user.wallet.address.value],
          }),
          this._tokensManager.getTokenBySymbol({
            chainInfo: params.chainInfo,
            symbol: tokenSymbol,
          }),
        ])

        return TokenAmount.createFromBaseUnit({
          token: token,
          amount: balance.toString(),
        })
      }),
    )

    // filter the tokens that have balance > 0
    const migratableTokenAmount = balances.filter(
      (tokenAmount) => tokenAmount.toSolidityValue() > 0n,
    )

    return migratableTokenAmount.map((tokenAmount) => ({
      migrationType: params.migrationType,
      chainInfo: params.chainInfo,
      tokenAmount: tokenAmount,
    }))
  }

  async getMigrationTX(
    params: Parameters<IArmadaManagerMigrations['getMigrationTX']>[0],
  ): ReturnType<IArmadaManagerMigrations['getMigrationTX']> {
    const shouldStake = params.shouldStake ?? true

    const multicallArgs: HexData[] = []
    const multicallOperations: string[] = []

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // get the migration transaction info from params
    switch (params.migrationType) {
      case ArmadaMigrationType.Compound: {
        const moveAssetsCall = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'moveFromCompoundToAdmiralsQuarters',
          args: [params.tokenAmount.token.address.value, params.tokenAmount.toSolidityValue()],
        })
        multicallArgs.push(moveAssetsCall)
        multicallOperations.push('moveFromCompoundToAdmiralsQuarters')
        break
      }
      case ArmadaMigrationType.AaveV3: {
        const moveAssetsCall = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'moveFromAaveToAdmiralsQuarters',
          args: [params.tokenAmount.token.address.value, params.tokenAmount.toSolidityValue()],
        })
        multicallArgs.push(moveAssetsCall)
        multicallOperations.push('moveFromAaveToAdmiralsQuarters')
        break
      }
      case ArmadaMigrationType.Erc4626: {
        const moveAssetsCall = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'moveFromERC4626ToAdmiralsQuarters',
          args: [params.tokenAmount.token.address.value, params.tokenAmount.toSolidityValue()],
        })
        multicallArgs.push(moveAssetsCall)
        multicallOperations.push('moveFromERC4626ToAdmiralsQuarters')
        break
      }
      default:
        throw new Error('Unsupported migration type: ' + params.migrationType)
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
        migrationType: params.migrationType,
      },
    }

    // Approval for AQ
    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.vaultId.chainInfo,
      spender: admiralsQuartersAddress,
      amount: params.tokenAmount,
      owner: params.user.wallet.address,
    })

    if (approvalTransaction) {
      LoggingService.debug('approvalTransaction', {
        amount: approvalTransaction.metadata.approvalAmount.toString(),
      })
    }

    return approvalTransaction
      ? [approvalTransaction, multicallTransaction]
      : [multicallTransaction]
  }
}
