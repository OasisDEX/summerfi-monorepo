import {
  GovernanceRewardsManagerAbi,
  SummerStakingAbi,
  SummerTokenAbi,
} from '@summerfi/armada-protocol-abis'
import {
  getDeployedGovAddress,
  type IArmadaManagerGovernance,
  type IArmadaManagerUtils,
  type StakingBucketInfo,
  type UserStakingBalanceByBucket,
  isTestDeployment,
  type StakingStatsV2,
} from '@summerfi/armada-protocol-common'
import {
  Address,
  AddressValue,
  StakingBucket,
  StakingBucketValues,
  TokenAmount,
  TransactionType,
  Percentage,
  User,
  Wallet,
  type IAddress,
  type IChainInfo,
  Token,
} from '@summerfi/sdk-common'
import { encodeFunctionData, zeroAddress } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { findBucket } from './findBucket'
import { BigNumber } from 'bignumber.js'

const MAX_MULTIPLE = 7.2655

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerGovernance implements IArmadaManagerGovernance {
  private _blockchainClientProvider: IBlockchainClientProvider
  private _allowanceManager: IAllowanceManager
  private _tokensManager: ITokensManager
  private _contractsProvider: IContractsProvider
  private _subgraphManager: IArmadaSubgraphManager
  private _utils: IArmadaManagerUtils
  private _vaults: import('@summerfi/armada-protocol-common').IArmadaManagerVaults

  private _hubChainSummerTokenAddress: IAddress
  private _hubChainInfo: IChainInfo

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    allowanceManager: IAllowanceManager
    tokensManager: ITokensManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
    hubChainInfo: IChainInfo
    utils: IArmadaManagerUtils
    vaults: import('@summerfi/armada-protocol-common').IArmadaManagerVaults
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._allowanceManager = params.allowanceManager
    this._tokensManager = params.tokensManager
    this._contractsProvider = params.contractsProvider
    this._subgraphManager = params.subgraphManager
    this._hubChainInfo = params.hubChainInfo
    this._utils = params.utils
    this._vaults = params.vaults

    const tokenSymbol = isTestDeployment() ? 'BUMMER' : 'SUMR'

    this._hubChainSummerTokenAddress = this._tokensManager.getTokenBySymbol({
      chainInfo: this._hubChainInfo,
      symbol: tokenSymbol,
    }).address
  }

  async getUserDelegatee(
    params: Parameters<IArmadaManagerGovernance['getUserDelegatee']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserDelegatee']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const addressResult = await client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'delegates',
      args: [params.user.wallet.address.value],
    })

    return Address.createFromEthereum({ value: addressResult })
  }

  async getUserDelegateeV2(
    params: Parameters<IArmadaManagerGovernance['getUserDelegateeV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserDelegateeV2']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const stakedSummerTokenAddress = await this._getStakeSummerTokenAddress()

    const addressResult = await client.readContract({
      abi: SummerTokenAbi,
      address: stakedSummerTokenAddress,
      functionName: 'delegates',
      args: [params.userAddress],
    })

    return Address.createFromEthereum({ value: addressResult })
  }

  async getDelegateTx(
    params: Parameters<IArmadaManagerGovernance['getDelegateTx']>[0],
  ): ReturnType<IArmadaManagerGovernance['getDelegateTx']> {
    const calldata = encodeFunctionData({
      abi: SummerTokenAbi,
      functionName: 'delegate',
      args: [params.user.wallet.address.value],
    })

    return [
      {
        type: TransactionType.Delegate,
        description: 'Delegating votes',
        transaction: {
          target: Address.createFromEthereum({ value: this._hubChainSummerTokenAddress.value }),
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getDelegateTxV2(
    params: Parameters<IArmadaManagerGovernance['getDelegateTxV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getDelegateTxV2']> {
    const stakedSummerTokenAddress = await this._getStakeSummerTokenAddress()

    const calldata = encodeFunctionData({
      abi: SummerTokenAbi,
      functionName: 'delegate',
      args: [params.delegateeAddress],
    })

    return [
      {
        type: TransactionType.Delegate,
        description: 'Delegating votes',
        transaction: {
          target: Address.createFromEthereum({ value: stakedSummerTokenAddress }),
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getUndelegateTx(): ReturnType<IArmadaManagerGovernance['getUndelegateTx']> {
    const calldata = encodeFunctionData({
      abi: SummerTokenAbi,
      functionName: 'delegate',
      args: [zeroAddress],
    })

    return [
      {
        type: TransactionType.Delegate,
        description: 'Undelegating votes',
        transaction: {
          target: Address.createFromEthereum({ value: this._hubChainSummerTokenAddress.value }),
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getUserVotes(
    params: Parameters<IArmadaManagerGovernance['getUserVotes']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserVotes']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    return client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'getVotes',
      args: [params.user.wallet.address.value],
    })
  }

  async getUserBalance(
    params: Parameters<IArmadaManagerGovernance['getUserBalance']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserBalance']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    return client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })
  }

  async getUserStakedBalance(
    params: Parameters<IArmadaManagerGovernance['getUserStakedBalance']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakedBalance']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const rewardsManagerAddress = getDeployedGovAddress()

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddress.value,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })
  }

  async getUserEarnedRewards(
    params: Parameters<IArmadaManagerGovernance['getUserEarnedRewards']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserEarnedRewards']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const rewardsManagerAddress = getDeployedGovAddress()

    // for now reward token is just summer token
    // in future potential partners can be added
    const rewardToken = this._hubChainSummerTokenAddress

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddress.value,
      functionName: 'earned',
      args: [params.user.wallet.address.value, rewardToken.value],
    })
  }

  private async _getStakeTx(
    params: Parameters<IArmadaManagerGovernance['getStakeTx']>[0],
    rewardsManagerAddress: IAddress,
  ): ReturnType<IArmadaManagerGovernance['getStakeTx']> {
    const calldata = encodeFunctionData({
      abi: GovernanceRewardsManagerAbi,
      functionName: 'stake',
      args: [params.amount],
    })

    const stakeTx = {
      type: TransactionType.Stake,
      description: 'Staking tokens',
      transaction: {
        target: rewardsManagerAddress,
        calldata: calldata,
        value: '0',
      },
    } as const

    const approveToStakeUserTokens = await this._allowanceManager.getApproval({
      chainInfo: this._hubChainInfo,
      spender: rewardsManagerAddress,
      amount: TokenAmount.createFromBaseUnit({
        amount: params.amount.toString(),
        token: this._utils.getSummerToken({
          chainInfo: this._hubChainInfo,
        }),
      }),
      owner: params.user.wallet.address,
    })

    if (approveToStakeUserTokens) {
      return [approveToStakeUserTokens, stakeTx]
    } else {
      return [stakeTx]
    }
  }

  private async _getUnstakeTx(
    params: Parameters<IArmadaManagerGovernance['getUnstakeTx']>[0],
    rewardsManagerAddress: IAddress,
  ): ReturnType<IArmadaManagerGovernance['getUnstakeTx']> {
    const calldata = encodeFunctionData({
      abi: GovernanceRewardsManagerAbi,
      functionName: 'unstake',
      args: [params.amount],
    })

    return [
      {
        type: TransactionType.Unstake,
        description: 'Unstaking tokens',
        transaction: {
          target: rewardsManagerAddress,
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getStakeTx(
    params: Parameters<IArmadaManagerGovernance['getStakeTx']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakeTx']> {
    const rewardsManagerAddress = getDeployedGovAddress()
    return this._getStakeTx(params, rewardsManagerAddress)
  }

  async getUnstakeTx(
    params: Parameters<IArmadaManagerGovernance['getUnstakeTx']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUnstakeTx']> {
    const rewardsManagerAddress = getDeployedGovAddress()
    return this._getUnstakeTx(params, rewardsManagerAddress)
  }

  async getDelegationChainLength(
    params: Parameters<IArmadaManagerGovernance['getDelegationChainLength']>[0],
  ): ReturnType<IArmadaManagerGovernance['getDelegationChainLength']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const length = await client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'getDelegationChainLength',
      args: [params.user.wallet.address.value],
    })
    const num = Number(length.toString())
    if (!Number.isSafeInteger(num)) {
      throw new Error('Delegation chain length exceeds safe integer limits')
    }
    return num
  }

  async getStakeTxV2(
    params: Parameters<IArmadaManagerGovernance['getStakeTxV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakeTxV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    const [stakeTxInfo, approveToStakeUserTokens] = await Promise.all([
      stakingContract.stakeLockup({
        amount: params.amount,
        lockupPeriod: params.lockupPeriod,
      }),
      this._allowanceManager.getApproval({
        chainInfo: this._hubChainInfo,
        spender: stakingContractAddress,
        amount: TokenAmount.createFromBaseUnit({
          amount: params.amount.toString(),
          token: this._utils.getSummerToken({
            chainInfo: this._hubChainInfo,
          }),
        }),
        owner: params.user.wallet.address,
      }),
    ])

    const stakeTx = {
      type: TransactionType.Stake,
      description: stakeTxInfo.description,
      transaction: stakeTxInfo.transaction,
    } as const

    if (approveToStakeUserTokens) {
      return [approveToStakeUserTokens, stakeTx]
    } else {
      return [stakeTx]
    }
  }

  private async _getStakeSummerTokenAddress(): Promise<AddressValue> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    return stakingContract.stakeSummerTokenAddress()
  }

  private async getRewardsData(params: { rewardTokenAddress: IAddress }): Promise<{
    periodFinish: bigint
    rewardRatePerSecond: bigint
    rewardRatePerYear: bigint
    rewardsDuration: bigint
    lastUpdateTime: bigint
    rewardPerTokenStored: bigint
  }> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    const rewardData = await stakingContract.rewardData({
      rewardToken: params.rewardTokenAddress.value,
    })

    const [
      periodFinish,
      rewardRatePerSecond,
      rewardsDuration,
      lastUpdateTime,
      rewardPerTokenStored,
    ] = rewardData

    const SECONDS_PER_YEAR = 365n * 24n * 60n * 60n

    return {
      periodFinish,
      rewardRatePerSecond,
      rewardRatePerYear: rewardRatePerSecond * SECONDS_PER_YEAR,
      rewardsDuration,
      lastUpdateTime,
      rewardPerTokenStored,
    }
  }

  async getStakeOnBehalfTxV2(
    params: Parameters<IArmadaManagerGovernance['getStakeOnBehalfTxV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakeOnBehalfTxV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    const [stakeTxInfo, approveToStakeUserTokens] = await Promise.all([
      stakingContract.stakeLockupOnBehalf({
        receiver: params.receiver.value,
        amount: params.amount,
        lockupPeriod: params.lockupPeriod,
      }),
      this._allowanceManager.getApproval({
        chainInfo: this._hubChainInfo,
        spender: stakingContractAddress,
        amount: TokenAmount.createFromBaseUnit({
          amount: params.amount.toString(),
          token: this._utils.getSummerToken({
            chainInfo: this._hubChainInfo,
          }),
        }),
        owner: params.user.wallet.address,
      }),
    ])

    const stakeTx = {
      type: TransactionType.Stake,
      description: stakeTxInfo.description,
      transaction: stakeTxInfo.transaction,
    } as const

    if (approveToStakeUserTokens) {
      return [approveToStakeUserTokens, stakeTx]
    } else {
      return [stakeTx]
    }
  }

  async getUnstakeTxV2(
    params: Parameters<IArmadaManagerGovernance['getUnstakeTxV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUnstakeTxV2']> {
    const chainInfo = this._hubChainInfo
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo,
      address: stakingContractAddress,
    })

    // approve staked summer token xSUMR
    const [unstakeTxInfo, stakeSummerTokenAddress] = await Promise.all([
      stakingContract.unstakeLockup({
        stakeIndex: params.userStakeIndex,
        amount: params.amount,
      }),
      stakingContract.stakeSummerTokenAddress(),
    ])

    const unstakeTx = {
      type: TransactionType.Unstake,
      description: unstakeTxInfo.description,
      transaction: unstakeTxInfo.transaction,
    } as const

    const approveToUnstakeUserTokens = await this._allowanceManager.getApproval({
      chainInfo,
      spender: stakingContractAddress,
      amount: TokenAmount.createFromBaseUnit({
        amount: params.amount.toString(),
        token: Token.createFrom({
          address: Address.createFromEthereum({ value: stakeSummerTokenAddress }),
          chainInfo,
          decimals: 18,
          symbol: 'xSUMR',
          name: 'StakedSummerToken',
        }),
      }),
      owner: params.user.wallet.address,
    })

    return approveToUnstakeUserTokens ? [approveToUnstakeUserTokens, unstakeTx] : [unstakeTx]
  }

  async getUserStakesCount(
    params: Parameters<IArmadaManagerGovernance['getUserStakesCount']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakesCount']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get the raw count of user stakes from the contract and user balances in parallel
    const userStakesCountBefore = await stakingContract.getUserStakesCount({
      user: params.user.wallet.address.value,
    })

    // If the provided bucket has zero amount, add 1 to the count
    const userStakesCountAfter = userStakesCountBefore + 1n

    return { userStakesCountBefore, userStakesCountAfter }
  }

  async getUserStakingBalanceV2(
    params: Parameters<IArmadaManagerGovernance['getUserStakingBalanceV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakingBalanceV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get the count of user stakes
    const stakesCount = await stakingContract.getUserStakesCount({
      user: params.user.wallet.address.value,
    })

    if (stakesCount === 0n) {
      // Return empty array with zero balances for all buckets
      return StakingBucketValues.map((bucket) => ({ bucket: bucket as StakingBucket, amount: 0n }))
    }

    // Fetch all user stakes
    const stakesPromises = []
    for (let i = 0n; i < stakesCount; i++) {
      stakesPromises.push(
        stakingContract.getUserStake({
          user: params.user.wallet.address.value,
          index: i,
        }),
      )
    }

    const stakesResults = await Promise.all(stakesPromises)

    // Initialize buckets with zero balances
    const bucketBalances = new Map<StakingBucket, bigint>()
    for (const bucket of StakingBucketValues) {
      bucketBalances.set(bucket as StakingBucket, 0n)
    }

    // Aggregate stakes by bucket
    stakesResults.forEach((result) => {
      const [amount, , , lockupPeriod] = result
      const bucket = findBucket(lockupPeriod)
      bucketBalances.set(bucket, (bucketBalances.get(bucket) || 0n) + amount)
    })

    // Convert to array format
    const resultArray: UserStakingBalanceByBucket[] = []
    for (const [bucket, amount] of bucketBalances.entries()) {
      resultArray.push({ bucket, amount })
    }

    return resultArray
  }

  async getUserStakingWeightedBalanceV2(
    params: Parameters<IArmadaManagerGovernance['getUserStakingWeightedBalanceV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakingWeightedBalanceV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    return stakingContract.weightedBalanceOf({
      account: params.user.wallet.address.value,
    })
  }

  async getUserStakingEarnedV2(
    params: Parameters<IArmadaManagerGovernance['getUserStakingEarnedV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakingEarnedV2']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const stakingContractAddress = getDeployedGovAddress('summerStaking')
    const rewardTokenAddress = params.rewardTokenAddress ?? this._hubChainSummerTokenAddress

    return client.readContract({
      abi: SummerStakingAbi,
      address: stakingContractAddress.value,
      functionName: 'earned',
      args: [params.user.wallet.address.value, rewardTokenAddress.value],
    })
  }

  async getStakingRewardRatesV2(
    params: Parameters<IArmadaManagerGovernance['getStakingRewardRatesV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakingRewardRatesV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Default to summer token address if not provided
    const rewardTokenAddress = params.rewardTokenAddress ?? this._hubChainSummerTokenAddress
    // Get reward token decimals
    const rewardToken = this._tokensManager.getTokenByAddress({
      chainInfo: this._hubChainInfo,
      address: rewardTokenAddress,
    })
    const rewardTokenDecimals = rewardToken.decimals

    // Get SUMR price from params or fallback to utils
    const sumrPrice = params.sumrPriceUsd ?? this._utils.getSummerPrice()

    // Use contract wrapper for all methods
    const [rewardData, _totalWeightedSupply] = await Promise.all([
      this.getRewardsData({ rewardTokenAddress: rewardTokenAddress }),
      stakingContract.totalSupply(),
    ])

    // Check if rewards period has finished
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000))
    const isRewardPeriodActive = rewardData.periodFinish > currentTimestamp

    const totalWeightedSupplyBN = new BigNumber(_totalWeightedSupply).shiftedBy(
      -rewardTokenDecimals,
    )
    // Convert to actual token amounts (not wei)
    const rewardRatePerYearBN = new BigNumber(rewardData.rewardRatePerYear).shiftedBy(
      -rewardTokenDecimals,
    )

    let summerRewardYield = new BigNumber(0)
    // Only calculate yield if reward period is active
    if (isRewardPeriodActive && totalWeightedSupplyBN.gt(0) && rewardRatePerYearBN.gt(0)) {
      summerRewardYield = rewardRatePerYearBN.dividedBy(totalWeightedSupplyBN).multipliedBy(100)
    }

    // Get staking revenue share to calculate baseApy
    const revenueShare = await this.getStakingRevenueShareV2()
    const revenueShareAmountBN = new BigNumber(revenueShare.amount) // in USD

    let baseApy = 0
    let maxApy = 0

    if (revenueShareAmountBN.gt(0)) {
      baseApy = revenueShareAmountBN
        .dividedBy(totalWeightedSupplyBN.multipliedBy(sumrPrice))
        .multipliedBy(100)
        .toNumber() // Convert to percentage

      // maxApy = baseApy * MAX_MULTIPLE
      maxApy = baseApy * MAX_MULTIPLE
    }

    return {
      summerRewardYield: Percentage.createFrom({ value: summerRewardYield.toNumber() }),
      maxSummerRewardYield: Percentage.createFrom({
        value: summerRewardYield.multipliedBy(MAX_MULTIPLE).toNumber(),
      }),
      baseApy: Percentage.createFrom({ value: baseApy }),
      maxApy: Percentage.createFrom({ value: maxApy }),
    }
  }

  async getStakingBucketsInfoV2(): ReturnType<IArmadaManagerGovernance['getStakingBucketsInfoV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get all bucket info at once
    const allBucketInfo = await stakingContract.getAllBucketInfo()

    const [buckets, caps, stakedAmounts, minPeriods, maxPeriods] = allBucketInfo

    const result: StakingBucketInfo[] = []
    for (let i = 0; i < buckets.length; i++) {
      result.push({
        bucket: buckets[i] as StakingBucket,
        cap: caps[i],
        totalStaked: stakedAmounts[i],
        minLockupPeriod: minPeriods[i],
        maxLockupPeriod: maxPeriods[i],
      })
    }

    return result
  }

  async getStakingCalculateWeightedStakeV2(
    params: Parameters<IArmadaManagerGovernance['getStakingCalculateWeightedStakeV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakingCalculateWeightedStakeV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    return stakingContract.calculateWeightedStake({
      amount: params.amount,
      lockupPeriod: params.lockupPeriod,
    })
  }

  async getStakingTotalWeightedSupplyV2(): ReturnType<
    IArmadaManagerGovernance['getStakingTotalWeightedSupplyV2']
  > {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    return stakingContract.totalSupply()
  }

  async getStakingTotalSumrStakedV2(): ReturnType<
    IArmadaManagerGovernance['getStakingTotalSumrStakedV2']
  > {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get all bucket info and sum the staked amounts
    const allBucketInfo = await stakingContract.getAllBucketInfo()
    const [, , stakedAmounts] = allBucketInfo

    // Sum all staked amounts across buckets
    const totalStaked = stakedAmounts.reduce((acc, amount) => acc + amount, 0n)

    return totalStaked
  }

  async getStakingRevenueShareV2(): ReturnType<
    IArmadaManagerGovernance['getStakingRevenueShareV2']
  > {
    const percentage = Percentage.createFrom({ value: 20 })
    const totalRevenue = await this._vaults.getProtocolRevenue()
    const amount = totalRevenue * percentage.toProportion()

    return { percentage, amount }
  }

  async getStakingSimulationDataV2(
    params: Parameters<IArmadaManagerGovernance['getStakingSimulationDataV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakingSimulationDataV2']> {
    // Create user object for method calls
    const user = User.createFrom({
      chainInfo: this._hubChainInfo,
      wallet: Wallet.createFrom({
        address: Address.createFromEthereum({ value: params.userAddress }),
      }),
    })

    const sumrPriceUsd = params.sumrPriceUsd ?? this._utils.getSummerPrice()

    // Get bucket index from lockup period
    const bucketIndex = findBucket(params.period)

    // Get required data
    const [
      rewardRates,
      _totalWeightedSupply,
      stakingRevenue,
      userBalances,
      weightedAmount,
      userStakesCount,
      userWeightedBalance,
    ] = await Promise.all([
      this.getStakingRewardRatesV2({
        rewardTokenAddress: this._utils.getSummerToken({ chainInfo: this._hubChainInfo }).address,
        sumrPriceUsd,
      }),
      this.getStakingTotalWeightedSupplyV2(),
      this.getStakingRevenueShareV2(),
      this.getUserStakingBalanceV2({ user }),
      this.getStakingCalculateWeightedStakeV2({
        amount: params.amount,
        lockupPeriod: params.period,
      }),
      this.getUserStakesCount({
        user,
        bucketIndex,
      }),
      this.getUserStakingWeightedBalanceV2({ user }),
    ])

    const stakingRevAmount = stakingRevenue.amount

    // Calculate user's current balances
    const userSumrStakedBalance = userBalances.reduce((acc, b) => acc + b.amount, 0n)

    // Get SUMR token decimals
    const sumrToken = this._utils.getSummerToken({
      chainInfo: this._hubChainInfo,
    })
    const sumrDecimals = sumrToken.decimals

    // Use BigNumber for calculations
    const sumrPriceUsdBN = new BigNumber(sumrPriceUsd)
    const stakingRevAmountBN = new BigNumber(stakingRevAmount)
    const totalWeightedSupplyBN = new BigNumber(_totalWeightedSupply.toString()).shiftedBy(
      -sumrDecimals,
    )
    const weightedAmountBN = new BigNumber(weightedAmount.toString()).shiftedBy(-sumrDecimals)
    const amountBN = new BigNumber(params.amount.toString()).shiftedBy(-sumrDecimals)
    const userWeightedBalanceBN = new BigNumber(userWeightedBalance.toString())
    const userSumrStakedBalanceBN = new BigNumber(userSumrStakedBalance.toString())

    // Calculate formulas
    // usdcYieldBoost = weightedAmount / amount
    const usdcYieldBoost = weightedAmountBN.dividedBy(amountBN).toNumber()

    const newTotalWeightedSupply = totalWeightedSupplyBN.plus(weightedAmountBN)
    // newApyPerWeightedToken = stakingRevAmount / (newTotalWeightedSupply * sumrPriceUsd)
    const newApyPerWeightedToken = stakingRevAmountBN
      .dividedBy(newTotalWeightedSupply.multipliedBy(sumrPriceUsdBN))
      .times(100)

    // usdcYieldApy = newApyPerWeightedToken * usdcYieldBoost * 100 (convert to percentage)
    const usdcYieldApy = newApyPerWeightedToken.multipliedBy(usdcYieldBoost)

    // usdcBlendedYieldBoostFrom = userWeightedBalance / userSumrStakedBalance
    let usdcBlendedYieldBoostFrom = 0
    if (userSumrStakedBalanceBN.gt(0)) {
      usdcBlendedYieldBoostFrom = userWeightedBalanceBN
        .dividedBy(userSumrStakedBalanceBN)
        .toNumber()
    }

    // usdcBlendedYieldBoostTo = (userWeightedBalance + weightedAmount) / (userSumrStakedBalance + amount)
    const usdcBlendedYieldBoostTo = userWeightedBalanceBN
      .plus(weightedAmountBN)
      .dividedBy(userSumrStakedBalanceBN.plus(amountBN))
      .toNumber()

    return {
      sumrRewardApy: rewardRates.summerRewardYield,
      usdcYieldApy: Percentage.createFrom({ value: usdcYieldApy.toNumber() }),
      usdcYieldBoost,
      usdcBlendedYieldBoostFrom,
      usdcBlendedYieldBoostTo,
      weightedAmount,
      userStakesCountBefore: userStakesCount.userStakesCountBefore,
      userStakesCountAfter: userStakesCount.userStakesCountAfter,
    }
  }

  /**
   * @method getStakingEarningsEstimationV2
   * @description Calculates staking rewards estimation for multiple stakes
   *
   * @param stakes Array of stake positions with amount, period, and weightedAmount
   * @param sumrPriceUsd Optional SUMR price in USD (defaults to current price from utils)
   *
   * @returns Estimation data with SUMR rewards and USD earnings for each stake
   */
  async getStakingEarningsEstimationV2(
    params: Parameters<IArmadaManagerGovernance['getStakingEarningsEstimationV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakingEarningsEstimationV2']> {
    // Note: sumrPriceUsd is available in params but not currently needed for calculations
    // The earnings are calculated based on weightedAmount/totalWeightedSupply ratios
    // Future enhancements may use sumrPriceUsd for additional USD value calculations

    // Get staking contract
    const stakingContractAddress = getDeployedGovAddress('summerStaking')
    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get reward token decimals
    const rewardToken = this._tokensManager.getTokenByAddress({
      chainInfo: this._hubChainInfo,
      address: this._hubChainSummerTokenAddress,
    })
    const rewardTokenDecimals = rewardToken.decimals

    // Get required data: totalWeightedSupply, rewardRate, and revenueShare
    const [totalWeightedSupply, rewardData, revenueShare] = await Promise.all([
      stakingContract.totalSupply(),
      this.getRewardsData({
        rewardTokenAddress: this._hubChainSummerTokenAddress,
      }),
      this.getStakingRevenueShareV2(),
    ])

    // Check if rewards period has finished
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000))
    const isRewardPeriodActive = rewardData.periodFinish > currentTimestamp

    const revenueShareAmountBN = new BigNumber(revenueShare.amount)

    // Calculate earnings for each stake
    const stakes = params.stakes.map((stake) => {
      const weightedAmountBN = new BigNumber(stake.weightedAmount)
      const totalWeightedSupplyBN = new BigNumber(totalWeightedSupply)

      if (totalWeightedSupplyBN.isZero()) {
        return {
          sumrRewardsAmount: 0n,
          usdEarningsAmount: '0.000000',
        }
      }

      // usdEarningsAmount = weightedAmount / totalWeightedSupply * revenueShare
      const usdEarningsAmount = weightedAmountBN
        .dividedBy(totalWeightedSupplyBN)
        .multipliedBy(revenueShareAmountBN)

      // sumrRewardsAmount = weightedAmount / totalWeightedSupply * rewardRate (only if reward period is active)
      let sumrRewardsAmount = new BigNumber(0)
      if (isRewardPeriodActive) {
        const rewardRateBN = new BigNumber(rewardData.rewardRatePerYear).shiftedBy(
          -rewardTokenDecimals,
        )
        sumrRewardsAmount = weightedAmountBN
          .dividedBy(totalWeightedSupplyBN)
          .multipliedBy(rewardRateBN)
      }

      return {
        sumrRewardsAmount: BigInt(sumrRewardsAmount.integerValue(BigNumber.ROUND_DOWN).toFixed(0)),
        usdEarningsAmount: usdEarningsAmount.toFixed(6),
      }
    })

    return { stakes }
  }

  /**
   * @method getStakingConfigV2
   * @description Returns the staking configuration including the staking contract address
   *
   * @returns Object containing staking configuration
   */
  async getStakingConfigV2(): Promise<{ stakingContractAddress: `0x${string}` }> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')
    return {
      stakingContractAddress: stakingContractAddress.value as `0x${string}`,
    }
  }

  /**
   * @method getStakingStatsV2
   * @description Returns staking statistics from the protocol subgraph
   *
   * @returns Object containing staking statistics
   */
  async getStakingStatsV2(): Promise<StakingStatsV2> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const response = await this._subgraphManager.getStakingStatsV2({
      chainId: this._hubChainInfo.chainId,
      id: stakingContractAddress.value,
    })

    if (!response || response.governanceStakings.length !== 1) {
      throw new Error(`No staking stats found for address: ${stakingContractAddress.value}`)
    }

    const stats = response.governanceStakings[0]

    return {
      summerStakedNormalized: stats.summerStakedNormalized,
      amountOfLockedStakes: stats.amountOfLockedStakes,
      averageLockupPeriod: stats.averageLockupPeriod,
      circulatingSupply: '0',
    }
  }

  async getUserStakingSumrStaked(
    params: Parameters<IArmadaManagerGovernance['getUserStakingSumrStaked']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakingSumrStaked']> {
    // Get all user staking balances by bucket
    const balances = await this.getUserStakingBalanceV2({ user: params.user })

    // Sum all amounts across all buckets
    const totalStaked = balances.reduce((sum, balance) => sum + balance.amount, 0n)

    return totalStaked
  }

  async getUserStakesV2(
    params: Parameters<IArmadaManagerGovernance['getUserStakesV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakesV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get the count of user stakes
    const stakesCount = await stakingContract.getUserStakesCount({
      user: params.user.wallet.address.value,
    })

    if (stakesCount === 0n) {
      return []
    }

    // Fetch all user stakes
    const stakesPromises = []
    for (let i = 0n; i < stakesCount; i++) {
      stakesPromises.push(
        stakingContract.getUserStake({
          user: params.user.wallet.address.value,
          index: i,
        }),
      )
    }

    const stakesResults = await Promise.all(stakesPromises)

    // Map results to UserStakeV2 format
    const stakes = stakesResults.map((result, index) => {
      const [amount, weightedAmount, lockupEndTime, lockupPeriod] = result
      // Calculate multiplier in WAD format (weightedAmount / amount * WAD) using BigNumber
      const multiplier =
        amount > 0n
          ? new BigNumber(weightedAmount.toString())
              .dividedBy(new BigNumber(amount.toString()))
              .toNumber()
          : 0
      return {
        index,
        amount,
        weightedAmount,
        lockupEndTime,
        lockupPeriod,
        multiplier,
      }
    })

    return stakes
  }

  async getCalculatePenaltyPercentage(
    params: Parameters<IArmadaManagerGovernance['getCalculatePenaltyPercentage']>[0],
  ): ReturnType<IArmadaManagerGovernance['getCalculatePenaltyPercentage']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Check if penalties are globally disabled
    const penaltyEnabled = await stakingContract.penaltyEnabled()

    // Get current timestamp using local time
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000))

    // Constants from the contract
    const MIN_PENALTY_PERCENTAGE = BigInt('20000000000000000') // 0.02e18 (2%)
    const MAX_PENALTY_PERCENTAGE = BigInt('200000000000000000') // 0.2e18 (20%)
    const FIXED_PENALTY_PERIOD = BigInt(110 * 24 * 60 * 60) // 110 days in seconds
    const MAX_LOCKUP_PERIOD = BigInt(3 * 365 * 24 * 60 * 60) // 3 years in seconds
    const WAD = BigInt('1000000000000000000') // 1e18

    return params.userStakes.map((userStake) => {
      if (!penaltyEnabled) {
        return Percentage.createFrom({ value: 0 })
      }

      const lockupEndTime = userStake.lockupEndTime

      // No penalty if lockup has already expired
      if (currentTimestamp >= lockupEndTime) {
        return Percentage.createFrom({ value: 0 })
      }

      // Near-expiry fixed penalty floor to avoid cliff at zero
      const timeRemaining = lockupEndTime - currentTimestamp
      if (timeRemaining < FIXED_PENALTY_PERIOD) {
        // MIN_PENALTY_PERCENTAGE is 0.02e18 (2%)
        const penaltyValue = new BigNumber(MIN_PENALTY_PERCENTAGE)
          .dividedBy(WAD)
          .multipliedBy(100)
          .toNumber()
        return Percentage.createFrom({ value: penaltyValue })
      }

      // Linear ramp to MAX_PENALTY_PERCENTAGE at MAX_LOCKUP_PERIOD
      const penaltyBigInt = new BigNumber(timeRemaining)
        .multipliedBy(MAX_PENALTY_PERCENTAGE)
        .dividedBy(MAX_LOCKUP_PERIOD)
      const penaltyValue = penaltyBigInt.dividedBy(WAD).multipliedBy(100).toNumber()
      return Percentage.createFrom({ value: penaltyValue })
    })
  }

  async getCalculatePenaltyAmount(
    params: Parameters<IArmadaManagerGovernance['getCalculatePenaltyAmount']>[0],
  ): ReturnType<IArmadaManagerGovernance['getCalculatePenaltyAmount']> {
    if (params.userStakes.length !== params.amounts.length) {
      throw new Error('userStakes and amounts arrays must have the same length')
    }

    // Get penalty percentages for all stakes
    const penaltyPercentages = await this.getCalculatePenaltyPercentage({
      userStakes: params.userStakes,
    })

    // Calculate penalty amounts using BigNumber for precision
    return params.amounts.map((amount, index) => {
      const penaltyPercentage = penaltyPercentages[index]

      // Convert percentage (0-100) to basis points (x100) with rounding
      const basisPoints = new BigNumber(penaltyPercentage.value)
        .multipliedBy(100)
        .integerValue(BigNumber.ROUND_HALF_UP)

      // Calculate: (amount * basisPoints) / 10000
      const penaltyAmount = new BigNumber(amount)
        .multipliedBy(basisPoints)
        .dividedBy(10000)
        .integerValue(BigNumber.ROUND_DOWN)

      return BigInt(penaltyAmount.toFixed(0))
    })
  }

  /**
   * @method getUserBlendedYieldBoost
   * @description Returns the user's current blended yield boost based on their weighted balance and staked balance
   *
   * @param params Object containing user parameter
   *
   * @returns The user's blended yield boost (userWeightedBalance / userSumrStakedBalance), returns 0 if user has no staked balance
   */
  async getUserBlendedYieldBoost(
    params: Parameters<IArmadaManagerGovernance['getUserBlendedYieldBoost']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserBlendedYieldBoost']> {
    // Get user's weighted balance and staked balance in parallel
    const [userWeightedBalance, userBalances] = await Promise.all([
      this.getUserStakingWeightedBalanceV2({ user: params.user }),
      this.getUserStakingBalanceV2({ user: params.user }),
    ])

    // Calculate user's current total staked balance
    const userSumrStakedBalance = userBalances.reduce((acc, b) => acc + b.amount, 0n)

    // Convert to BigNumber for calculations
    const userWeightedBalanceBN = new BigNumber(userWeightedBalance.toString())
    const userSumrStakedBalanceBN = new BigNumber(userSumrStakedBalance.toString())

    // usdcBlendedYieldBoostFrom = userWeightedBalance / userSumrStakedBalance
    let usdcBlendedYieldBoost = 0
    if (userSumrStakedBalanceBN.gt(0)) {
      usdcBlendedYieldBoost = userWeightedBalanceBN.dividedBy(userSumrStakedBalanceBN).toNumber()
    }

    return usdcBlendedYieldBoost
  }
}
