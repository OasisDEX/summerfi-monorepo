import {
  BridgeTransactionInfo,
  ITokenAmount,
  type ApproveTransactionInfo,
  type IArmadaPosition,
  type IArmadaVaultId,
  type IArmadaVaultInfo,
  type IPercentage,
  type IUser,
  type VaultSwitchTransactionInfo,
} from '@summerfi/sdk-common'
import { IArmadaManagerUsersClient } from '../../interfaces/ArmadaManager/IArmadaManagerUsersClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name ArmadaManagerUsersClient
 * @description Implementation of the Armada Manager client interface for Users of the Armada
 */
export class ArmadaManagerUsersClient extends IRPCClient implements IArmadaManagerUsersClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaManagerUsersClient.getSummerToken */
  async getSummerToken(params: Parameters<IArmadaManagerUsersClient['getSummerToken']>[0]) {
    return this.rpcClient.armada.users.getSummerToken.query(params)
  }

  /** @see IArmadaManagerUsersClient.getVaultsRaw */
  async getVaultsRaw(params: Parameters<IArmadaManagerUsersClient['getVaultsRaw']>[0]) {
    return this.rpcClient.armada.users.getVaultsRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getVaultRaw */
  async getVaultRaw(params: Parameters<IArmadaManagerUsersClient['getVaultRaw']>[0]) {
    return this.rpcClient.armada.users.getVaultRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getGlobalRebalancesRaw */
  async getGlobalRebalancesRaw(
    params: Parameters<IArmadaManagerUsersClient['getGlobalRebalancesRaw']>[0],
  ) {
    return this.rpcClient.armada.users.getGlobalRebalancesRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUsersActivityRaw */
  async getUsersActivityRaw(
    params: Parameters<IArmadaManagerUsersClient['getUsersActivityRaw']>[0],
  ) {
    return this.rpcClient.armada.users.getUsersActivityRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserActivityRaw */
  async getUserActivityRaw(params: Parameters<IArmadaManagerUsersClient['getUserActivityRaw']>[0]) {
    return this.rpcClient.armada.users.getUserActivityRaw.query(params)
  }

  /** @see IArmadaManagerUsersClient.getVaultInfo */
  async getVaultInfo(params: Parameters<IArmadaManagerUsersClient['getVaultInfo']>[0]) {
    return this.rpcClient.armada.users.getVaultInfo.query(params)
  }

  /** @see IArmadaManagerUsersClient.getVaultInfoList */
  async getVaultInfoList(params: Parameters<IArmadaManagerUsersClient['getVaultInfoList']>[0]) {
    return this.rpcClient.armada.users.getVaultInfoList.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserPositions */
  async getUserPositions(params: Parameters<IArmadaManagerUsersClient['getUserPositions']>[0]) {
    return this.rpcClient.armada.users.getUserPositions.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserPositions */
  async getUserPosition(params: Parameters<IArmadaManagerUsersClient['getUserPosition']>[0]) {
    return this.rpcClient.armada.users.getUserPosition.query({
      user: params.user,
      fleetAddress: params.fleetAddress,
    })
  }

  /** @see IArmadaManagerUsersClient.getPosition */
  async getPosition(params: Parameters<IArmadaManagerUsersClient['getPosition']>[0]) {
    return this.rpcClient.armada.users.getPosition.query(params)
  }

  /** @see IArmadaManagerUsersClient.getNewDepositTx */
  async getNewDepositTx(
    params: Parameters<IArmadaManagerUsersClient['getNewDepositTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getNewDepositTx']> {
    return this.rpcClient.armada.users.getDepositTx.query(params)
  }

  /** @see IArmadaManagerUsersClient.getWithdrawTx */
  async getWithdrawTx(
    params: Parameters<IArmadaManagerUsersClient['getWithdrawTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getWithdrawTx']> {
    return this.rpcClient.armada.users.getWithdrawTx.query(params)
  }

  async getStakedBalance(
    params: Parameters<IArmadaManagerUsersClient['getStakedBalance']>[0],
  ): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    return this.rpcClient.armada.users.getStakedBalance.query(params)
  }

  async getFleetBalance(
    params: Parameters<IArmadaManagerUsersClient['getFleetBalance']>[0],
  ): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    return this.rpcClient.armada.users.getFleetBalance.query(params)
  }

  /** @see IArmadaManagerUsersClient.getBridgeTx */
  async getBridgeTx(
    params: Parameters<IArmadaManagerUsersClient['getBridgeTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getBridgeTx']> {
    return this.rpcClient.armada.users.getBridgeTx.query(params)
  }

  async getTotalBalance(
    params: Parameters<IArmadaManagerUsersClient['getTotalBalance']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getTotalBalance']> {
    return this.rpcClient.armada.users.getTotalBalance.query(params)
  }

  async getAggregatedRewards(
    params: Parameters<IArmadaManagerUsersClient['getAggregatedRewards']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getAggregatedRewards']> {
    return this.rpcClient.armada.users.getAggregatedRewards.query(params)
  }

  async getClaimableAggregatedRewards(
    params: Parameters<IArmadaManagerUsersClient['getClaimableAggregatedRewards']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getClaimableAggregatedRewards']> {
    return this.rpcClient.armada.users.getClaimableAggregatedRewards.query(params)
  }

  async getAggregatedClaimsForChainTx(
    params: Parameters<IArmadaManagerUsersClient['getAggregatedClaimsForChainTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getAggregatedClaimsForChainTx']> {
    return this.rpcClient.armada.users.getAggregatedClaimsForChainTx.query(params)
  }

  async getUserDelegatee(
    params: Parameters<IArmadaManagerUsersClient['getUserDelegatee']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserDelegatee']> {
    return this.rpcClient.armada.users.getUserDelegatee.query(params)
  }

  async getDelegateTx(
    params: Parameters<IArmadaManagerUsersClient['getDelegateTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getDelegateTx']> {
    return this.rpcClient.armada.users.getDelegateTx.query(params)
  }

  async getUndelegateTx(): ReturnType<IArmadaManagerUsersClient['getUndelegateTx']> {
    return this.rpcClient.armada.users.getUndelegateTx.query()
  }

  async getUserVotes(
    params: Parameters<IArmadaManagerUsersClient['getUserVotes']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserVotes']> {
    return this.rpcClient.armada.users.getUserVotes.query(params)
  }

  async getUserBalance(
    params: Parameters<IArmadaManagerUsersClient['getUserBalance']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserBalance']> {
    return this.rpcClient.armada.users.getUserBalance.query(params)
  }

  async getUserStakedBalance(
    params: Parameters<IArmadaManagerUsersClient['getUserStakedBalance']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserStakedBalance']> {
    return this.rpcClient.armada.users.getUserStakedBalance.query(params)
  }

  async getUserEarnedRewards(
    params: Parameters<IArmadaManagerUsersClient['getUserEarnedRewards']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserEarnedRewards']> {
    return this.rpcClient.armada.users.getUserEarnedRewards.query(params)
  }

  async getStakeTx(
    params: Parameters<IArmadaManagerUsersClient['getStakeTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getStakeTx']> {
    return this.rpcClient.armada.users.getStakeTx.query(params)
  }

  async getUnstakeTx(
    params: Parameters<IArmadaManagerUsersClient['getUnstakeTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUnstakeTx']> {
    return this.rpcClient.armada.users.getUnstakeTx.query(params)
  }

  async getDelegationChainLength(
    params: Parameters<IArmadaManagerUsersClient['getDelegationChainLength']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getDelegationChainLength']> {
    return this.rpcClient.armada.users.getDelegationChainLength.query(params)
  }

  async getMigratablePositions(
    params: Parameters<IArmadaManagerUsersClient['getMigratablePositions']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getMigratablePositions']> {
    return this.rpcClient.armada.users.getMigratablePositions.query(params)
  }

  async getMigratablePositionsApy(
    params: Parameters<IArmadaManagerUsersClient['getMigratablePositionsApy']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getMigratablePositionsApy']> {
    return this.rpcClient.armada.users.getMigratablePositionsApy.query(params)
  }

  async getMigrationTx(
    params: Parameters<IArmadaManagerUsersClient['getMigrationTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getMigrationTx']> {
    return this.rpcClient.armada.users.getMigrationTx.query(params)
  }

  async getVaultSwitchTx(
    params: Parameters<IArmadaManagerUsersClient['getVaultSwitchTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getVaultSwitchTx']> {
    return this.rpcClient.armada.users.getVaultSwitchTx.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserMerklRewards */
  async getUserMerklRewards(
    params: Parameters<IArmadaManagerUsersClient['getUserMerklRewards']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserMerklRewards']> {
    return this.rpcClient.armada.users.getUserMerklRewards.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUserMerklClaimTx */
  async getUserMerklClaimTx(
    params: Parameters<IArmadaManagerUsersClient['getUserMerklClaimTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserMerklClaimTx']> {
    return this.rpcClient.armada.users.getUserMerklClaimTx.query(params)
  }
}
