import { IRwaManagerClient } from '../../interfaces/ArmadaManager/IRwaManagerClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * Implementation of the RWA manager client interface
 */
export class RwaManagerClient extends IRPCClient implements IRwaManagerClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IRwaManagerClient.getVaultInfoListPerChain */
  async getVaultInfoListPerChain(
    params: Parameters<IRwaManagerClient['getVaultInfoListPerChain']>[0],
  ): ReturnType<IRwaManagerClient['getVaultInfoListPerChain']> {
    return this.rpcClient.rwa.getVaultInfoListPerChain.query(params)
  }

  /** @see IRwaManagerClient.getVaultsRaw */
  async getVaultsRaw(
    params: Parameters<IRwaManagerClient['getVaultsRaw']>[0],
  ): ReturnType<IRwaManagerClient['getVaultsRaw']> {
    return this.rpcClient.rwa.getVaultsRaw.query(params)
  }

  /** @see IRwaManagerClient.getVaultRaw */
  async getVaultRaw(
    params: Parameters<IRwaManagerClient['getVaultRaw']>[0],
  ): ReturnType<IRwaManagerClient['getVaultRaw']> {
    return this.rpcClient.rwa.getVaultRaw.query(params)
  }

  /** @see IRwaManagerClient.getDepositTx */
  async getDepositTx(
    params: Parameters<IRwaManagerClient['getDepositTx']>[0],
  ): ReturnType<IRwaManagerClient['getDepositTx']> {
    return this.rpcClient.rwa.getDepositTx.query(params)
  }

  /** @see IRwaManagerClient.getClaimSharesTx */
  async getClaimSharesTx(
    params: Parameters<IRwaManagerClient['getClaimSharesTx']>[0],
  ): ReturnType<IRwaManagerClient['getClaimSharesTx']> {
    return this.rpcClient.rwa.getClaimSharesTx.query(params)
  }

  /** @see IRwaManagerClient.getWithdrawTx */
  async getWithdrawTx(
    params: Parameters<IRwaManagerClient['getWithdrawTx']>[0],
  ): ReturnType<IRwaManagerClient['getWithdrawTx']> {
    return this.rpcClient.rwa.getWithdrawTx.query(params)
  }

  /** @see IRwaManagerClient.getClaimAssetsTx */
  async getClaimAssetsTx(
    params: Parameters<IRwaManagerClient['getClaimAssetsTx']>[0],
  ): ReturnType<IRwaManagerClient['getClaimAssetsTx']> {
    return this.rpcClient.rwa.getClaimAssetsTx.query(params)
  }

  /** @see IRwaManagerClient.getCancelRoundDepositTx */
  async getCancelRoundDepositTx(
    params: Parameters<IRwaManagerClient['getCancelRoundDepositTx']>[0],
  ): ReturnType<IRwaManagerClient['getCancelRoundDepositTx']> {
    return this.rpcClient.rwa.getCancelRoundDepositTx.query(params)
  }

  /** @see IRwaManagerClient.getCurrentRound */
  async getCurrentRound(
    params: Parameters<IRwaManagerClient['getCurrentRound']>[0],
  ): ReturnType<IRwaManagerClient['getCurrentRound']> {
    return this.rpcClient.rwa.getCurrentRound.query(params)
  }

  /** @see IRwaManagerClient.getRoundState */
  async getRoundState(
    params: Parameters<IRwaManagerClient['getRoundState']>[0],
  ): ReturnType<IRwaManagerClient['getRoundState']> {
    return this.rpcClient.rwa.getRoundState.query(params)
  }

  /** @see IRwaManagerClient.getExchangeRate */
  async getExchangeRate(
    params: Parameters<IRwaManagerClient['getExchangeRate']>[0],
  ): ReturnType<IRwaManagerClient['getExchangeRate']> {
    return this.rpcClient.rwa.getExchangeRate.query(params)
  }

  /** @see IRwaManagerClient.getReceiptBalances */
  async getReceiptBalances(
    params: Parameters<IRwaManagerClient['getReceiptBalances']>[0],
  ): ReturnType<IRwaManagerClient['getReceiptBalances']> {
    return this.rpcClient.rwa.getReceiptBalances.query(params)
  }

  /** @see IRwaManagerClient.getUserVaultExposure */
  async getUserVaultExposure(
    params: Parameters<IRwaManagerClient['getUserVaultExposure']>[0],
  ): ReturnType<IRwaManagerClient['getUserVaultExposure']> {
    return this.rpcClient.rwa.getUserVaultExposure.query(params)
  }

  /** @see IRwaManagerClient.getVaultMarketValue */
  async getVaultMarketValue(
    params: Parameters<IRwaManagerClient['getVaultMarketValue']>[0],
  ): ReturnType<IRwaManagerClient['getVaultMarketValue']> {
    return this.rpcClient.rwa.getVaultMarketValue.query(params)
  }

  /** @see IRwaManagerClient.getSetMinimumPositionSizeTx */
  async getSetMinimumPositionSizeTx(
    params: Parameters<IRwaManagerClient['getSetMinimumPositionSizeTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetMinimumPositionSizeTx']> {
    return this.rpcClient.rwa.getSetMinimumPositionSizeTx.query(params)
  }

  /** @see IRwaManagerClient.getNextRoundTx */
  async getNextRoundTx(
    params: Parameters<IRwaManagerClient['getNextRoundTx']>[0],
  ): ReturnType<IRwaManagerClient['getNextRoundTx']> {
    return this.rpcClient.rwa.getNextRoundTx.query(params)
  }

  /** @see IRwaManagerClient.getSetRoundSettledTx */
  async getSetRoundSettledTx(
    params: Parameters<IRwaManagerClient['getSetRoundSettledTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetRoundSettledTx']> {
    return this.rpcClient.rwa.getSetRoundSettledTx.query(params)
  }

  /** @see IRwaManagerClient.getSetRoundSettledBatchTx */
  async getSetRoundSettledBatchTx(
    params: Parameters<IRwaManagerClient['getSetRoundSettledBatchTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetRoundSettledBatchTx']> {
    return this.rpcClient.rwa.getSetRoundSettledBatchTx.query(params)
  }

  /** @see IRwaManagerClient.getRetryRoundTx */
  async getRetryRoundTx(
    params: Parameters<IRwaManagerClient['getRetryRoundTx']>[0],
  ): ReturnType<IRwaManagerClient['getRetryRoundTx']> {
    return this.rpcClient.rwa.getRetryRoundTx.query(params)
  }

  /** @see IRwaManagerClient.getEmergencyRollbackRoundTx */
  async getEmergencyRollbackRoundTx(
    params: Parameters<IRwaManagerClient['getEmergencyRollbackRoundTx']>[0],
  ): ReturnType<IRwaManagerClient['getEmergencyRollbackRoundTx']> {
    return this.rpcClient.rwa.getEmergencyRollbackRoundTx.query(params)
  }

  /** @see IRwaManagerClient.getSetFleetTransferabilityTx */
  async getSetFleetTransferabilityTx(
    params: Parameters<IRwaManagerClient['getSetFleetTransferabilityTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetFleetTransferabilityTx']> {
    return this.rpcClient.rwa.getSetFleetTransferabilityTx.query(params)
  }

  /** @see IRwaManagerClient.isFleetTransfersEnabled */
  async isFleetTransfersEnabled(
    params: Parameters<IRwaManagerClient['isFleetTransfersEnabled']>[0],
  ): ReturnType<IRwaManagerClient['isFleetTransfersEnabled']> {
    return this.rpcClient.rwa.isFleetTransfersEnabled.query(params)
  }

  /** @see IRwaManagerClient.getGrantRoleTx */
  async getGrantRoleTx(
    params: Parameters<IRwaManagerClient['getGrantRoleTx']>[0],
  ): ReturnType<IRwaManagerClient['getGrantRoleTx']> {
    return this.rpcClient.rwa.getGrantRoleTx.query(params)
  }

  /** @see IRwaManagerClient.getRevokeRoleTx */
  async getRevokeRoleTx(
    params: Parameters<IRwaManagerClient['getRevokeRoleTx']>[0],
  ): ReturnType<IRwaManagerClient['getRevokeRoleTx']> {
    return this.rpcClient.rwa.getRevokeRoleTx.query(params)
  }

  /** @see IRwaManagerClient.getSetWhitelistedTx */
  async getSetWhitelistedTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistedTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistedTx']> {
    return this.rpcClient.rwa.getSetWhitelistedTx.query(params)
  }

  /** @see IRwaManagerClient.getSetWhitelistedBatchTx */
  async getSetWhitelistedBatchTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistedBatchTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistedBatchTx']> {
    return this.rpcClient.rwa.getSetWhitelistedBatchTx.query(params)
  }

  /** @see IRwaManagerClient.getSetWhitelistOpenTx */
  async getSetWhitelistOpenTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistOpenTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistOpenTx']> {
    return this.rpcClient.rwa.getSetWhitelistOpenTx.query(params)
  }

  /** @see IRwaManagerClient.isWhitelisted */
  async isWhitelisted(
    params: Parameters<IRwaManagerClient['isWhitelisted']>[0],
  ): ReturnType<IRwaManagerClient['isWhitelisted']> {
    return this.rpcClient.rwa.isWhitelisted.query(params)
  }

  /** @see IRwaManagerClient.isWhitelistOpen */
  async isWhitelistOpen(
    params: Parameters<IRwaManagerClient['isWhitelistOpen']>[0],
  ): ReturnType<IRwaManagerClient['isWhitelistOpen']> {
    return this.rpcClient.rwa.isWhitelistOpen.query(params)
  }
}
