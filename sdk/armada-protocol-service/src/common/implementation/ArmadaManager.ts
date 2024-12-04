import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AdmiralsQuartersAbi, StakingRewardsManagerBaseAbi } from '@summerfi/armada-protocol-abis'
import {
  createTransaction,
  getDeployedContractAddress,
  IArmadaManager,
  IArmadaVaultInfo,
  IArmadaPosition,
  IArmadaPositionId,
  IArmadaVaultId,
} from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import {
  IAddress,
  ITokenAmount,
  IUser,
  LoggingService,
  TokenAmount,
  TransactionInfo,
  type HexData,
} from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { encodeFunctionData } from 'viem'
import { ArmadaVault } from './ArmadaVault'
import { ArmadaVaultInfo } from './ArmadaVaultInfo'
import { ArmadaPosition } from './ArmadaPosition'
import { parseGetUserPositionQuery } from './extensions/parseGetUserPositionQuery'
import { parseGetUserPositionsQuery } from './extensions/parseGetUserPositionsQuery'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManager implements IArmadaManager {
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider
  private _subgraphManager: IArmadaSubgraphManager
  private _blockchainClientProvider: IBlockchainClientProvider

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
    blockchainClientProvider: IBlockchainClientProvider
  }) {
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
    this._subgraphManager = params.subgraphManager
    this._blockchainClientProvider = params.blockchainClientProvider
  }

  /** POOLS */

  /** @see IArmadaManager.getVaultsRaw */
  async getVaultsRaw(params: Parameters<IArmadaManager['getVaultsRaw']>[0]) {
    return this._subgraphManager.getVaults({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getVaultRaw */
  async getVaultRaw(params: Parameters<IArmadaManager['getVaultRaw']>[0]) {
    return this._subgraphManager.getVault({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
    })
  }

  /** @see IArmadaManager.getGlobalRebalancesRaw */
  async getGlobalRebalancesRaw(params: Parameters<IArmadaManager['getGlobalRebalancesRaw']>[0]) {
    return this._subgraphManager.getGlobalRebalances({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getUsersActivityRaw */
  async getUsersActivityRaw(params: Parameters<IArmadaManager['getUsersActivityRaw']>[0]) {
    return this._subgraphManager.getUsersActivity({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getUserActivityRaw */
  async getUserActivityRaw(params: Parameters<IArmadaManager['getUserActivityRaw']>[0]) {
    return this._subgraphManager.getUserActivity({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
    })
  }

  /** @see IArmadaManager.getVaultInfo */
  async getVaultInfo(
    params: Parameters<IArmadaManager['getVaultInfo']>[0],
  ): Promise<IArmadaVaultInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()
    const fleetERC20Contract = fleetERC4626Contract.asErc20()

    const { depositCap } = await fleetContract.config()
    const totalDeposits = await fleetERC4626Contract.totalAssets()
    const totalShares = await fleetERC20Contract.totalSupply()

    return ArmadaVaultInfo.createFrom({
      id: params.vaultId,
      depositCap: depositCap,
      totalDeposits: totalDeposits,
      totalShares: totalShares,
    })
  }

  /** POSITIONS */
  /** @see IArmadaManager.getUserPositions */
  async getUserPositions({ user }: { user: IUser }): Promise<IArmadaPosition[]> {
    return parseGetUserPositionsQuery({
      user,
      query: await this._subgraphManager.getUserPositions({ user }),
    })
  }

  /** @see IArmadaManager.getUserPosition */
  async getUserPosition({
    user,
    fleetAddress,
  }: {
    user: IUser
    fleetAddress: IAddress
  }): Promise<IArmadaPosition> {
    return parseGetUserPositionQuery({
      user,
      query: await this._subgraphManager.getUserPosition({ user, fleetAddress }),
    })
  }

  /** @see IArmadaManager.getPosition */
  async getPosition(params: {
    vaultId: IArmadaVaultId
    positionId: IArmadaPositionId
  }): Promise<IArmadaPosition> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()
    const fleetERC20Contract = fleetERC4626Contract.asErc20()

    const userShares = await fleetERC20Contract.balanceOf({
      address: params.positionId.user.wallet.address,
    })
    const userAssets = await fleetERC4626Contract.convertToAssets({ amount: userShares })

    const pool = ArmadaVault.createFrom({
      id: params.vaultId,
    })

    return ArmadaPosition.createFrom({
      id: params.positionId,
      pool: pool,
      amount: userAssets,
      shares: userShares,
      deposits: [],
      withdrawals: [],
    })
  }

  async getFleetBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC20Contract = fleetContract.asErc20()
    const shares = await fleetERC20Contract.balanceOf({ address: params.user.wallet.address })
    // LoggingService.debug('fleet shares', shares.toString())

    return fleetContract.asErc4626().convertToAssets({ amount: shares })
  }

  async getStakedBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const { stakingRewardsManager } = await fleetContract.config()
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.vaultId.chainInfo,
    })
    const balance = await client.readContract({
      abi: StakingRewardsManagerBaseAbi,
      address: stakingRewardsManager.value,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })

    const shares = TokenAmount.createFromBaseUnit({
      token: await fleetContract.asErc20().getToken(),
      amount: balance.toString(),
    })
    // LoggingService.debug('staked shares', shares.toString())

    return fleetContract.asErc4626().convertToAssets({ amount: shares })
  }

  async getTotalBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount> {
    const fleetBalance = await this.getFleetBalance(params)
    const stakedBalance = await this.getStakedBalance(params)

    return fleetBalance.add(stakedBalance)
  }

  /** USER TRANSACTIONS */

  /** @see IArmadaManager.getNewDepositTX */
  async getNewDepositTX(
    params: Parameters<IArmadaManager['getNewDepositTX']>[0],
  ): Promise<TransactionInfo[]> {
    return this._getDepositTX(params)
  }

  /** @see IArmadaManager.getUpdateDepositTX */
  async getUpdateDepositTX(
    params: Parameters<IArmadaManager['getUpdateDepositTX']>[0],
  ): Promise<TransactionInfo[]> {
    return this._getDepositTX({
      vaultId: params.vaultId,
      user: params.positionId.user,
      amount: params.amount,
      shouldStake: params.shouldStake,
    })
  }

  /** @see IArmadaManager.getWithdrawTX */
  async getWithdrawTX(
    params: Parameters<IArmadaManager['getWithdrawTX']>[0],
  ): Promise<TransactionInfo[]> {
    const transactions: TransactionInfo[] = []

    const totalBalance = await this.getTotalBalance({
      vaultId: params.vaultId,
      user: params.user,
    })
    if (params.amount.toSolidityValue() > totalBalance.toSolidityValue()) {
      throw new Error(
        `Insufficient balance ${totalBalance.toString()} to withdraw requested: ${params.amount.toString()}`,
      )
    }

    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    const fleetBalance = await this.getFleetBalance({
      vaultId: params.vaultId,
      user: params.user,
    })
    const stakedBalance = await this.getStakedBalance({
      vaultId: params.vaultId,
      user: params.user,
    })

    LoggingService.debug({
      unstakedBalance: fleetBalance.toString(),
      stakedBalance: stakedBalance.toString(),
    })

    // unstaked tokens available?
    if (fleetBalance.toSolidityValue() > 0) {
      // Yes. is the unstaked amount sufficient to meet the withdrawal?
      if (fleetBalance.toSolidityValue() >= params.amount.toSolidityValue()) {
        LoggingService.debug('unstaked balance is enough for requested amount', {
          unstakedBalance: fleetBalance.toString(),
          requested: params.amount.toString(),
        })

        // Yes. Approve the requested amount
        const sharesAmount = await this.convertToShares({
          vaultId: params.vaultId,
          amount: params.amount,
        })
        const approvalTransactions = await this._allowanceManager.getApproval({
          chainInfo: params.vaultId.chainInfo,
          spender: admiralsQuarterAddress,
          amount: sharesAmount,
        })
        if (approvalTransactions) {
          transactions.push(...approvalTransactions)
        }

        // and withdraw the requested amount
        const withdrawArgs = await this._getWithdrawArgs(params)
        const withdrawData = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [withdrawArgs],
        })
        transactions.push(
          createTransaction({
            target: admiralsQuarterAddress,
            calldata: withdrawData,
            description: 'Withdraw Multicall Transaction',
          }),
        )
      } else {
        // No. Unstake missing amount from staked tokens
        const missingUnstakedAmount = params.amount.subtract(fleetBalance)
        LoggingService.debug('unstaked balance is not enough for requested amount', {
          requestedAmount: params.amount.toString(),
          unstakedBalance: fleetBalance.toString(),
          missingUnstakedAmount: missingUnstakedAmount.toString(),
        })

        const tokensToUnstakeTx = await this._getUnstakeTx({
          ...params,
          amount: missingUnstakedAmount,
        })
        transactions.push(tokensToUnstakeTx)

        // then approve the requested amount
        const sharesAmount = await this.convertToShares({
          vaultId: params.vaultId,
          amount: params.amount,
        })
        const approvalTransactions = await this._allowanceManager.getApproval({
          chainInfo: params.vaultId.chainInfo,
          spender: admiralsQuarterAddress,
          amount: sharesAmount,
        })
        if (approvalTransactions) {
          transactions.push(...approvalTransactions)
        }

        // and withdraw the requested amount
        const withdrawArgs = await this._getWithdrawArgs(params)
        const withdrawData = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [withdrawArgs],
        })
        transactions.push(
          createTransaction({
            target: admiralsQuarterAddress,
            calldata: withdrawData,
            description: 'Withdraw Multicall Transaction',
          }),
        )
      }
    } else {
      LoggingService.debug('unstaked balance is 0', {
        requestedAmount: params.amount.toString(),
        unstakedBalance: fleetBalance.toString(),
        stakedBalance: stakedBalance.toString(),
      })
      // No. Withdraw from staked tokens.
      const multicallArgs = await this._getWithdrawUnstakeArgs(params)
      const multicallCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'multicall',
        args: [multicallArgs],
      })
      transactions.push(
        createTransaction({
          target: admiralsQuarterAddress,
          calldata: multicallCalldata,
          description: 'Withdraw and Unstake Multicall Transaction',
        }),
      )
    }

    return transactions
  }

  /** @see IArmadaManager.convertToShares */
  async convertToShares(
    params: Parameters<IArmadaManager['convertToShares']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToShares({ amount: params.amount })
  }

  async convertToAssets(
    params: Parameters<IArmadaManager['convertToAssets']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToAssets({ amount: params.amount })
  }

  /** KEEPERS TRANSACTIONS */

  /** @see IArmadaManager.rebalance */
  async rebalance(params: Parameters<IArmadaManager['rebalance']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.rebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManager.adjustBuffer */
  async adjustBuffer(
    params: Parameters<IArmadaManager['adjustBuffer']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.adjustBuffer({ rebalanceData: params.rebalanceData })
  }

  /** GOVERNANCE TRANSACTIONS */

  /** @see IArmadaManager.setFleetDepositCap */
  async setFleetDepositCap(
    params: Parameters<IArmadaManager['setFleetDepositCap']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setFleetDepositCap({ cap: params.cap })
  }

  /** @see IArmadaManager.setTipJar */
  async setTipJar(params: Parameters<IArmadaManager['setTipJar']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setTipJar()
  }

  /** @see IArmadaManager.setTipRate */
  async setTipRate(params: Parameters<IArmadaManager['setTipRate']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setTipRate({ rate: params.rate })
  }

  /** @see IArmadaManager.addArk */
  async addArk(params: Parameters<IArmadaManager['addArk']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.addArk({ ark: params.ark })
  }

  /** @see IArmadaManager.addArks */
  async addArks(params: Parameters<IArmadaManager['addArks']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.addArks({ arks: params.arks })
  }

  /** @see IArmadaManager.removeArk */
  async removeArk(params: Parameters<IArmadaManager['removeArk']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.removeArk({ ark: params.ark })
  }

  /** @see IArmadaManager.setArkDepositCap */
  async setArkDepositCap(
    params: Parameters<IArmadaManager['setArkDepositCap']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkDepositCap({ ark: params.ark, cap: params.cap })
  }

  /** @see IArmadaManager.setArkMaxRebalanceOutflow */
  async setArkMaxRebalanceOutflow(
    params: Parameters<IArmadaManager['setArkMaxRebalanceOutflow']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkMaxRebalanceOutflow({
      ark: params.ark,
      maxRebalanceOutflow: params.maxRebalanceOutflow,
    })
  }

  /** @see IArmadaManager.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(
    params: Parameters<IArmadaManager['setArkMaxRebalanceInflow']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkMaxRebalanceInflow({
      ark: params.ark,
      maxRebalanceInflow: params.maxRebalanceInflow,
    })
  }

  /** @see IArmadaManager.setMinimumBufferBalance */
  async setMinimumBufferBalance(
    params: Parameters<IArmadaManager['setMinimumBufferBalance']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setMinimumBufferBalance({
      minimumBufferBalance: params.minimumBufferBalance,
    })
  }

  /** @see IArmadaManager.updateRebalanceCooldown */
  async updateRebalanceCooldown(
    params: Parameters<IArmadaManager['updateRebalanceCooldown']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.updateRebalanceCooldown({ cooldown: params.cooldown })
  }

  /** @see IArmadaManager.forceRebalance */
  async forceRebalance(
    params: Parameters<IArmadaManager['forceRebalance']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.forceRebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManager.emergencyShutdown */
  async emergencyShutdown(
    params: Parameters<IArmadaManager['emergencyShutdown']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.emergencyShutdown()
  }

  /** PRIVATE */

  /**
   * Internal utility method to generate a deposit TX
   *
   * @param vaultId The vault for which the deposit is being made
   * @param user The user making the deposit
   * @param amount The amount being deposited
   *
   * @returns The transactions needed to deposit the tokens
   */
  private async _getDepositTX(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    shouldStake?: boolean
  }): Promise<TransactionInfo[]> {
    const transactions: TransactionInfo[] = []
    const shouldStake = params.shouldStake ?? true

    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // Approval
    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.vaultId.chainInfo,
      spender: admiralsQuarterAddress,
      amount: params.amount,
    })
    if (approvalTransaction) {
      transactions.push(...approvalTransaction)
    }

    const multicallArgs: HexData[] = []
    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [params.amount.token.address.value, params.amount.toSolidityValue()],
    })
    multicallArgs.push(depositTokensCalldata)

    // when staking admirals quarters will receive LV tokens, otherwise the user
    const lvTokenReceiver = shouldStake
      ? admiralsQuarterAddress.value
      : params.user.wallet.address.value

    const enterFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'enterFleet',
      args: [
        params.vaultId.fleetAddress.value,
        params.amount.token.address.value,
        params.amount.toSolidityValue(),
        lvTokenReceiver,
      ],
    })
    multicallArgs.push(enterFleetCalldata)

    if (shouldStake) {
      const stakeCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'stake',
        args: [params.vaultId.fleetAddress.value, 0n],
      })
      multicallArgs.push(stakeCalldata)
    }

    const depositMulticallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [multicallArgs],
    })
    transactions.push(
      createTransaction({
        target: admiralsQuarterAddress,
        calldata: depositMulticallCalldata,
        description: 'Deposit Multicall Transaction',
      }),
    )

    return transactions
  }

  /**
   * Internal utility method to generate a withdraw TX
   * @param params The parameters for the withdraw
   *
   * @returns The transactions needed to withdraw the tokens
   */
  async _getWithdrawArgs(
    params: Parameters<IArmadaManager['getWithdrawTX']>[0],
  ): Promise<HexData[]> {
    const transactions: TransactionInfo[] = []
    const multicallArgs: HexData[] = []

    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    const sharesAmount = await this.convertToShares({
      vaultId: params.vaultId,
      amount: params.amount,
    })

    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.vaultId.chainInfo,
      spender: admiralsQuarterAddress,
      amount: sharesAmount,
    })
    if (approvalTransaction) {
      transactions.push(...approvalTransaction)
    }

    const exitFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'exitFleet',
      args: [params.vaultId.fleetAddress.value, params.amount.toSolidityValue()],
    })
    multicallArgs.push(exitFleetCalldata)

    const withdrawTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'withdrawTokens',
      args: [params.amount.token.address.value, 0n],
    })
    multicallArgs.push(withdrawTokensCalldata)

    const withdrawMulticallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [multicallArgs],
    })
    transactions.push(
      createTransaction({
        target: admiralsQuarterAddress,
        calldata: withdrawMulticallCalldata,
        description: 'Withdraw Multicall Transaction',
      }),
    )

    return multicallArgs
  }

  /**
   * Internal utility method to generate a withdraw+unstake TX
   * @param params The parameters for the withdraw+unstake
   *
   * @returns The transactions needed to withdraw+unstake the tokens
   */
  async _getWithdrawUnstakeArgs(
    params: Parameters<IArmadaManager['getWithdrawTX']>[0],
  ): Promise<HexData[]> {
    const multicallArgs: HexData[] = []

    const sharesAmount = await this.convertToShares({
      vaultId: params.vaultId,
      amount: params.amount,
    })

    const withdrawUnstake = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'unstakeAndWithdrawAssets',
      args: [params.vaultId.fleetAddress.value, sharesAmount.toSolidityValue()],
    })
    multicallArgs.push(withdrawUnstake)

    return multicallArgs
  }

  /**
   * Internal utility method to generate a withdraw+unstake TX
   * @param params The parameters for the withdraw+unstake
   *
   * @returns The transactions needed to withdraw+unstake the tokens
   */
  async _getUnstakeTx(
    params: Parameters<IArmadaManager['getWithdrawTX']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    const { stakingRewardsManager } = await fleetContract.config()

    const sharesAmount = await this.convertToShares({
      vaultId: params.vaultId,
      amount: params.amount,
    })
    const withdrawUnstake = encodeFunctionData({
      abi: StakingRewardsManagerBaseAbi,
      functionName: 'unstake',
      args: [sharesAmount.toSolidityValue()],
    })

    return createTransaction({
      target: stakingRewardsManager,
      calldata: withdrawUnstake,
      description: 'Withdraw Multicall Transaction',
    })
  }
}
