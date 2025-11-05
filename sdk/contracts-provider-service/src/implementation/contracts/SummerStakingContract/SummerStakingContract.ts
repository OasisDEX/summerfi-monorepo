import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { ISummerStakingContract } from '@summerfi/contracts-provider-common'
import { IAddress, AddressValue, IChainInfo, TransactionInfo } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'
import { SummerStakingAbi } from '@summerfi/armada-protocol-abis'

/**
 * @name SummerStakingContract
 * @description Implementation for the SummerStaking contract wrapper
 * @implements ISummerStakingContract
 */
export class SummerStakingContract<TClient extends IBlockchainClient, TAddress extends IAddress>
  extends ContractWrapper<typeof SummerStakingAbi, TClient, TAddress>
  implements ISummerStakingContract
{
  /** STATIC CONSTRUCTOR */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<ISummerStakingContract> {
    return new SummerStakingContract({
      blockchainClient: params.blockchainClient,
      chainInfo: params.chainInfo,
      address: params.address,
    })
  }

  getAbi(): typeof SummerStakingAbi {
    return SummerStakingAbi
  }

  /** WRITE METHODS */

  /** @see ISummerStakingContract.stakeLockup */
  async stakeLockup(params: { amount: bigint; lockupPeriod: bigint }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'stakeLockup',
      args: [params.amount, params.lockupPeriod],
      description: 'Stake SUMR tokens with a lockup period',
    })
  }

  /** @see ISummerStakingContract.stakeLockupOnBehalf */
  async stakeLockupOnBehalf(params: {
    receiver: AddressValue
    amount: bigint
    lockupPeriod: bigint
  }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'stakeLockupOnBehalf',
      args: [params.receiver, params.amount, params.lockupPeriod],
      description: 'Stake SUMR tokens on behalf of another address with a lockup period',
    })
  }

  /** @see ISummerStakingContract.unstakeLockup */
  async unstakeLockup(params: { stakeIndex: bigint; amount: bigint }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'unstakeLockup',
      args: [params.stakeIndex, params.amount],
      description: 'Unstake SUMR tokens from a lockup position',
    })
  }

  /** @see ISummerStakingContract.updateLockupBucketCap */
  async updateLockupBucketCap(params: {
    bucket: number
    newCap: bigint
  }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'updateLockupBucketCap',
      args: [params.bucket, params.newCap],
      description: 'Update the cap for a lockup bucket',
    })
  }

  /** @see ISummerStakingContract.updatePenaltyEnabled */
  async updatePenaltyEnabled(params: { penaltyEnabled: boolean }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'updatePenaltyEnabled',
      args: [params.penaltyEnabled],
      description: 'Enable or disable penalty',
    })
  }

  /** @see ISummerStakingContract.rescueToken */
  async rescueToken(params: { token: AddressValue; to: AddressValue }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'rescueToken',
      args: [params.token, params.to],
      description: 'Rescue tokens from the contract',
    })
  }

  /** READ METHODS */

  /** @see ISummerStakingContract.getUserStakesCount */
  async getUserStakesCount(params: { user: AddressValue }): Promise<bigint> {
    return this.contract.read.getUserStakesCount([params.user])
  }

  /** @see ISummerStakingContract.getUserStake */
  async getUserStake(params: {
    user: AddressValue
    index: bigint
  }): Promise<readonly [bigint, bigint, bigint, bigint]> {
    return this.contract.read.getUserStake([params.user, params.index])
  }

  /** @see ISummerStakingContract.weightedBalanceOf */
  async weightedBalanceOf(params: { account: AddressValue }): Promise<bigint> {
    return this.contract.read.weightedBalanceOf([params.account])
  }

  /** @see ISummerStakingContract.getBucketTotalStaked */
  async getBucketTotalStaked(params: { bucket: number }): Promise<bigint> {
    return this.contract.read.getBucketTotalStaked([params.bucket])
  }

  /** @see ISummerStakingContract.getBucketDetails */
  async getBucketDetails(params: {
    bucket: number
  }): Promise<readonly [bigint, bigint, bigint, bigint]> {
    return this.contract.read.getBucketDetails([params.bucket])
  }

  /** @see ISummerStakingContract.getAllBucketInfo */
  async getAllBucketInfo(): Promise<readonly [number[], bigint[], bigint[], bigint[], bigint[]]> {
    // The ABI returns readonly arrays, but we cast to mutable arrays for compatibility
    const result = await this.contract.read.getAllBucketInfo()
    return result as unknown as [number[], bigint[], bigint[], bigint[], bigint[]]
  }

  /** @see ISummerStakingContract.calculatePenaltyPercentage */
  async calculatePenaltyPercentage(params: {
    user: AddressValue
    stakeIndex: bigint
  }): Promise<bigint> {
    return this.contract.read.calculatePenaltyPercentage([params.user, params.stakeIndex])
  }

  /** @see ISummerStakingContract.calculatePenalty */
  async calculatePenalty(params: {
    user: AddressValue
    amount: bigint
    stakeIndex: bigint
  }): Promise<bigint> {
    return this.contract.read.calculatePenalty([params.user, params.amount, params.stakeIndex])
  }

  /** @see ISummerStakingContract.calculateWeightedStake */
  async calculateWeightedStake(params: { amount: bigint; lockupPeriod: bigint }): Promise<bigint> {
    return this.contract.read.calculateWeightedStake([params.amount, params.lockupPeriod])
  }
}
