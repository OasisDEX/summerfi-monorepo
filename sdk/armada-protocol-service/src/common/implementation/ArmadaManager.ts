import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'

import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import {
  IArmadaManager,
  IArmadaPool,
  IArmadaPoolId,
  IArmadaPoolInfo,
} from '@summerfi/armada-protocol-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { ArmadaPool } from './ArmadaPool'
import { ArmadaPoolInfo } from './ArmadaPoolInfo'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManager implements IArmadaManager {
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
  }) {
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
  }

  /** POOLS */

  /** @see IArmadaManager.getPool */
  async getPool(params: { poolId: IArmadaPoolId }): Promise<IArmadaPool> {
    // TODO: probably the Pool data type should contain all the pool info directly, and the ID
    // TODO: is the one that gets passed around
    return ArmadaPool.createFrom({
      id: params.poolId,
    })
  }

  /** @see IArmadaManager.getPoolInfo */
  getPoolInfo(params: { poolId: IArmadaPoolId }): Promise<IArmadaPoolInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()

    const depositCap = await fleetERC4626Contract.
    
    return ArmadaPoolInfo.createFrom({
      id: params.poolId,
      depositCap: await fleetContract.depositCap(),
      withdrawCap: await fleetContract.withdrawCap(),
      maxWithdrawFromBuffer: await fleetContract.maxWithdrawFromBuffer(),
    })
  }

  /** TRANSACTIONS */

  /** @see IArmadaManager.deposit */
  async getDepositTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const transactions: TransactionInfo[] = []

    // Approval
    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.poolId.chainInfo,
      spender: params.poolId.fleetAddress,
      amount: params.amount,
    })
    if (approvalTransaction) {
      transactions.push(...approvalTransaction)
    }

    // Deposit
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const fleetDepositTransaction = await fleetContract.deposit({
      assets: params.amount,
      receiver: params.user.wallet.address,
    })

    transactions.push(fleetDepositTransaction)

    return transactions
  }

  /** @see IArmadaManager.withdraw */
  async getWithdrawTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const fleetWithdrawTransaction = await fleetContract.withdraw({
      assets: params.amount,
      receiver: params.user.wallet.address,
      owner: params.user.wallet.address,
    })

    return [fleetWithdrawTransaction]
  }
}
