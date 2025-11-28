import { ITokenAmount } from '@summerfi/sdk-common'
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

  /** @see IArmadaManagerUsersClient.getSummerPrice */
  async getSummerPrice(
    params?: Parameters<IArmadaManagerUsersClient['getSummerPrice']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getSummerPrice']> {
    return this.rpcClient.armada.users.getSummerPrice.query(params)
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

  /** @see IArmadaManagerUsersClient.getProtocolRevenue */
  async getProtocolRevenue(): ReturnType<IArmadaManagerUsersClient['getProtocolRevenue']> {
    return this.rpcClient.armada.users.getProtocolRevenue.query()
  }

  /** @see IArmadaManagerUsersClient.getProtocolTvl */
  async getProtocolTvl(): ReturnType<IArmadaManagerUsersClient['getProtocolTvl']> {
    return this.rpcClient.armada.users.getProtocolTvl.query()
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

  /** @see IArmadaManagerUsersClient.getPositionHistory */
  async getPositionHistory(params: Parameters<IArmadaManagerUsersClient['getPositionHistory']>[0]) {
    return this.rpcClient.armada.users.getPositionHistory.query(params)
  }

  /** @see IArmadaManagerUsersClient.getDeposits */
  async getDeposits(params: Parameters<IArmadaManagerUsersClient['getDeposits']>[0]) {
    return this.rpcClient.armada.users.getDeposits.query(params)
  }

  /** @see IArmadaManagerUsersClient.getWithdrawals */
  async getWithdrawals(params: Parameters<IArmadaManagerUsersClient['getWithdrawals']>[0]) {
    return this.rpcClient.armada.users.getWithdrawals.query(params)
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

  /** @see IArmadaManagerUsersClient.getCrossChainDepositTx */
  async getCrossChainDepositTx(
    params: Parameters<IArmadaManagerUsersClient['getCrossChainDepositTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getCrossChainDepositTx']> {
    return this.rpcClient.armada.users.getCrossChainDepositTx.query(params)
  }

  /** @see IArmadaManagerUsersClient.getCrossChainWithdrawTx */
  async getCrossChainWithdrawTx(
    params: Parameters<IArmadaManagerUsersClient['getCrossChainWithdrawTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getCrossChainWithdrawTx']> {
    return this.rpcClient.armada.users.getCrossChainWithdrawTx.query(params)
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

  /** @see IArmadaManagerUsersClient.getAggregatedRewardsIncludingMerkl */
  async getAggregatedRewardsIncludingMerkl(
    params: Parameters<IArmadaManagerUsersClient['getAggregatedRewardsIncludingMerkl']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getAggregatedRewardsIncludingMerkl']> {
    return this.rpcClient.armada.users.getAggregatedRewardsIncludingMerkl.query(params)
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

  /** @see IArmadaManagerUsersClient.getErc20TokenTransferTx */
  async getErc20TokenTransferTx(
    params: Parameters<IArmadaManagerUsersClient['getErc20TokenTransferTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getErc20TokenTransferTx']> {
    return this.rpcClient.armada.users.getErc20TokenTransferTx.query(params)
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

  async getStakeTxV2(
    params: Parameters<IArmadaManagerUsersClient['getStakeTxV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getStakeTxV2']> {
    return this.rpcClient.armada.users.getStakeTxV2.query(params)
  }

  async getStakeOnBehalfTxV2(
    params: Parameters<IArmadaManagerUsersClient['getStakeOnBehalfTxV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getStakeOnBehalfTxV2']> {
    return this.rpcClient.armada.users.getStakeOnBehalfTxV2.query(params)
  }

  async getUnstakeTxV2(
    params: Parameters<IArmadaManagerUsersClient['getUnstakeTxV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUnstakeTxV2']> {
    return this.rpcClient.armada.users.getUnstakeTxV2.query(params)
  }

  async getUserStakesCount(
    params: Parameters<IArmadaManagerUsersClient['getUserStakesCount']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserStakesCount']> {
    return this.rpcClient.armada.users.getUserStakesCount.query(params)
  }

  async getUserStakingBalanceV2(
    params: Parameters<IArmadaManagerUsersClient['getUserStakingBalanceV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserStakingBalanceV2']> {
    return this.rpcClient.armada.users.getUserStakingBalanceV2.query(params)
  }

  async getUserStakingWeightedBalanceV2(
    params: Parameters<IArmadaManagerUsersClient['getUserStakingWeightedBalanceV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserStakingWeightedBalanceV2']> {
    return this.rpcClient.armada.users.getUserStakingWeightedBalanceV2.query(params)
  }

  async getUserStakingEarnedV2(
    params: Parameters<IArmadaManagerUsersClient['getUserStakingEarnedV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUserStakingEarnedV2']> {
    return this.rpcClient.armada.users.getUserStakingEarnedV2.query(params)
  }

  async getStakingRewardRatesV2(
    params: Parameters<IArmadaManagerUsersClient['getStakingRewardRatesV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getStakingRewardRatesV2']> {
    return this.rpcClient.armada.users.getStakingRewardRatesV2.query(params)
  }

  async getStakingBucketsInfoV2(): ReturnType<
    IArmadaManagerUsersClient['getStakingBucketsInfoV2']
  > {
    return this.rpcClient.armada.users.getStakingBucketsInfoV2.query()
  }

  async getStakingCalculateWeightedStakeV2(
    params: Parameters<IArmadaManagerUsersClient['getStakingCalculateWeightedStakeV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getStakingCalculateWeightedStakeV2']> {
    return this.rpcClient.armada.users.getStakingCalculateWeightedStakeV2.query(params)
  }

  async getStakingTotalWeightedSupplyV2(): ReturnType<
    IArmadaManagerUsersClient['getStakingTotalWeightedSupplyV2']
  > {
    return this.rpcClient.armada.users.getStakingTotalWeightedSupplyV2.query()
  }

  async getStakingTotalSumrStakedV2(): ReturnType<
    IArmadaManagerUsersClient['getStakingTotalSumrStakedV2']
  > {
    return this.rpcClient.armada.users.getStakingTotalSumrStakedV2.query()
  }

  async getStakingRevenueShareV2(): ReturnType<
    IArmadaManagerUsersClient['getStakingRevenueShareV2']
  > {
    return this.rpcClient.armada.users.getStakingRevenueShareV2.query()
  }

  async getStakingSimulationDataV2(
    params: Parameters<IArmadaManagerUsersClient['getStakingSimulationDataV2']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getStakingSimulationDataV2']> {
    return this.rpcClient.armada.users.getStakingSimulationDataV2.query(params)
  }

  /** @see IArmadaManagerUsersClient.getStakingConfigV2 */
  async getStakingConfigV2(): ReturnType<IArmadaManagerUsersClient['getStakingConfigV2']> {
    return this.rpcClient.armada.users.getStakingConfigV2.query()
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

  /** @see IArmadaManagerUsersClient.getReferralFeesMerklClaimTx */
  async getReferralFeesMerklClaimTx(
    params: Parameters<IArmadaManagerUsersClient['getReferralFeesMerklClaimTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getReferralFeesMerklClaimTx']> {
    return this.rpcClient.armada.users.getReferralFeesMerklClaimTx.query(params)
  }

  /** @see IArmadaManagerUsersClient.getAuthorizeAsMerklRewardsOperatorTx */
  async getAuthorizeAsMerklRewardsOperatorTx(
    params: Parameters<IArmadaManagerUsersClient['getAuthorizeAsMerklRewardsOperatorTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getAuthorizeAsMerklRewardsOperatorTx']> {
    return this.rpcClient.armada.users.getAuthorizeAsMerklRewardsOperatorTx.query(params)
  }

  /** @see IArmadaManagerUsersClient.getIsAuthorizedAsMerklRewardsOperator */
  async getIsAuthorizedAsMerklRewardsOperator(
    params: Parameters<IArmadaManagerUsersClient['getIsAuthorizedAsMerklRewardsOperator']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getIsAuthorizedAsMerklRewardsOperator']> {
    return this.rpcClient.armada.users.getIsAuthorizedAsMerklRewardsOperator.query(params)
  }

  /** @see IArmadaManagerUsersClient.getUnstakeFleetTokensTx */
  async getUnstakeFleetTokensTx(
    params: Parameters<IArmadaManagerUsersClient['getUnstakeFleetTokensTx']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getUnstakeFleetTokensTx']> {
    return this.rpcClient.armada.users.getUnstakeFleetTokensTx.query(params)
  }

  /** @see IArmadaManagerUsersClient.getVaultsHistoricalRates */
  async getVaultsHistoricalRates(
    params: Parameters<IArmadaManagerUsersClient['getVaultsHistoricalRates']>[0],
  ): ReturnType<IArmadaManagerUsersClient['getVaultsHistoricalRates']> {
    return this.rpcClient.armada.users.getVaultsHistoricalRates.query(params)
  }
}
