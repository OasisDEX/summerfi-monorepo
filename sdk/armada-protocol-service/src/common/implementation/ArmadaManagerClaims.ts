import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { SummerRewardsRedeemerAbi } from '@summerfi/armada-protocol-abis'
import {
  type IArmadaManagerClaims,
  getClaims,
  getClaim,
  getDeployedContractAddress,
  getDeployedRewardsRedeemerAddress,
} from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { Address, TransactionType } from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { encodeFunctionData } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { IOracleManager } from '@summerfi/oracle-common'

const redeemerAddress = '0xf69943661d989073f1043ee1927ad3c5c2615166'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerClaims implements IArmadaManagerClaims {
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider
  private _subgraphManager: IArmadaSubgraphManager
  private _blockchainClientProvider: IBlockchainClientProvider
  private _swapManager: ISwapManager
  private _oracleManager: IOracleManager

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
    blockchainClientProvider: IBlockchainClientProvider
    swapManager: ISwapManager
    oracleManager: IOracleManager
  }) {
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
    this._subgraphManager = params.subgraphManager
    this._blockchainClientProvider = params.blockchainClientProvider
    this._swapManager = params.swapManager
    this._oracleManager = params.oracleManager
  }

  eligibleForClaim(
    params: Parameters<IArmadaManagerClaims['eligibleForClaim']>[0],
  ): ReturnType<IArmadaManagerClaims['eligibleForClaim']> {
    const address = getDeployedRewardsRedeemerAddress({
      chainInfo: params.user.chainInfo,
    })

    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const balance = await client.readContract({
      abi: SummerRewardsRedeemerAbi,
      address,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })
  }

  async getClaimTX(
    params: Parameters<IArmadaManagerClaims['getClaimTX']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimTX']> {
    const claim = getClaim(params.user.wallet.address.value, params.index)

    if (!claim) {
      return null
    }

    const calldata = encodeFunctionData({
      abi: SummerRewardsRedeemerAbi,
      functionName: 'claim',
      args: [claim.index, claim.amount, claim.proof],
    })

    return {
      type: TransactionType.Claim,
      description: 'Claiming single reward',
      transaction: {
        target: Address.createFromEthereum({ value: redeemerAddress }),
        calldata: calldata,
        value: '0',
      },
    }
  }

  async getClaimAllTX(
    params: Parameters<IArmadaManagerClaims['getClaimAllTX']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimAllTX']> {
    const claims = getClaims(params.user.wallet.address.value)

    const calldata = encodeFunctionData({
      abi: SummerRewardsRedeemerAbi,
      functionName: 'claimMultiple',
      args: [
        claims.map((claim) => claim.index),
        claims.map((claim) => claim.amount),
        claims.map((claim) => claim.proof),
      ],
    })

    return {
      type: TransactionType.Claim,
      description: 'Claiming all rewards',
      transaction: {
        target: Address.createFromEthereum({ value: redeemerAddress }),
        calldata: calldata,
        value: '0',
      },
    }
  }
}
