import { IRwaManagerClient } from '../../interfaces/ArmadaManager/IRwaManagerClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name RwaManagerClient
 * @description Implementation of the RWA manager client interface
 */
export class RwaManagerClient extends IRPCClient implements IRwaManagerClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  async getVaultInfoListPerChain(
    params: Parameters<IRwaManagerClient['getVaultInfoListPerChain']>[0],
  ): ReturnType<IRwaManagerClient['getVaultInfoListPerChain']> {
    return this.rpcClient.rwa.getVaultInfoListPerChain.query(params)
  }

  async getVaultsRaw(
    params: Parameters<IRwaManagerClient['getVaultsRaw']>[0],
  ): ReturnType<IRwaManagerClient['getVaultsRaw']> {
    return this.rpcClient.rwa.getVaultsRaw.query(params)
  }

  async getVaultRaw(
    params: Parameters<IRwaManagerClient['getVaultRaw']>[0],
  ): ReturnType<IRwaManagerClient['getVaultRaw']> {
    return this.rpcClient.rwa.getVaultRaw.query(params)
  }

  async getDepositTx(
    params: Parameters<IRwaManagerClient['getDepositTx']>[0],
  ): ReturnType<IRwaManagerClient['getDepositTx']> {
    return this.rpcClient.rwa.getDepositTx.query(params)
  }

  async getClaimSharesTx(
    params: Parameters<IRwaManagerClient['getClaimSharesTx']>[0],
  ): ReturnType<IRwaManagerClient['getClaimSharesTx']> {
    return this.rpcClient.rwa.getClaimSharesTx.query(params)
  }

  async getWithdrawTx(
    params: Parameters<IRwaManagerClient['getWithdrawTx']>[0],
  ): ReturnType<IRwaManagerClient['getWithdrawTx']> {
    return this.rpcClient.rwa.getWithdrawTx.query(params)
  }

  async getClaimAssetsTx(
    params: Parameters<IRwaManagerClient['getClaimAssetsTx']>[0],
  ): ReturnType<IRwaManagerClient['getClaimAssetsTx']> {
    return this.rpcClient.rwa.getClaimAssetsTx.query(params)
  }

  async getCancelRoundDepositTx(
    params: Parameters<IRwaManagerClient['getCancelRoundDepositTx']>[0],
  ): ReturnType<IRwaManagerClient['getCancelRoundDepositTx']> {
    return this.rpcClient.rwa.getCancelRoundDepositTx.query(params)
  }

  async getCurrentRound(
    params: Parameters<IRwaManagerClient['getCurrentRound']>[0],
  ): ReturnType<IRwaManagerClient['getCurrentRound']> {
    return this.rpcClient.rwa.getCurrentRound.query(params)
  }

  async getRoundState(
    params: Parameters<IRwaManagerClient['getRoundState']>[0],
  ): ReturnType<IRwaManagerClient['getRoundState']> {
    return this.rpcClient.rwa.getRoundState.query(params)
  }

  async getExchangeRate(
    params: Parameters<IRwaManagerClient['getExchangeRate']>[0],
  ): ReturnType<IRwaManagerClient['getExchangeRate']> {
    return this.rpcClient.rwa.getExchangeRate.query(params)
  }

  async getReceiptBalances(
    params: Parameters<IRwaManagerClient['getReceiptBalances']>[0],
  ): ReturnType<IRwaManagerClient['getReceiptBalances']> {
    return this.rpcClient.rwa.getReceiptBalances.query(params)
  }

  async getUserVaultExposure(
    params: Parameters<IRwaManagerClient['getUserVaultExposure']>[0],
  ): ReturnType<IRwaManagerClient['getUserVaultExposure']> {
    return this.rpcClient.rwa.getUserVaultExposure.query(params)
  }

  async getVaultMarketValue(
    params: Parameters<IRwaManagerClient['getVaultMarketValue']>[0],
  ): ReturnType<IRwaManagerClient['getVaultMarketValue']> {
    return this.rpcClient.rwa.getVaultMarketValue.query(params)
  }

  async getSetMinimumPositionSizeTx(
    params: Parameters<IRwaManagerClient['getSetMinimumPositionSizeTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetMinimumPositionSizeTx']> {
    return this.rpcClient.rwa.getSetMinimumPositionSizeTx.query(params)
  }

  async getNextRoundTx(
    params: Parameters<IRwaManagerClient['getNextRoundTx']>[0],
  ): ReturnType<IRwaManagerClient['getNextRoundTx']> {
    return this.rpcClient.rwa.getNextRoundTx.query(params)
  }

  async getSetRoundSettledTx(
    params: Parameters<IRwaManagerClient['getSetRoundSettledTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetRoundSettledTx']> {
    return this.rpcClient.rwa.getSetRoundSettledTx.query(params)
  }

  async getSetRoundSettledBatchTx(
    params: Parameters<IRwaManagerClient['getSetRoundSettledBatchTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetRoundSettledBatchTx']> {
    return this.rpcClient.rwa.getSetRoundSettledBatchTx.query(params)
  }

  async getRetryRoundTx(
    params: Parameters<IRwaManagerClient['getRetryRoundTx']>[0],
  ): ReturnType<IRwaManagerClient['getRetryRoundTx']> {
    return this.rpcClient.rwa.getRetryRoundTx.query(params)
  }

  async getEmergencyRollbackRoundTx(
    params: Parameters<IRwaManagerClient['getEmergencyRollbackRoundTx']>[0],
  ): ReturnType<IRwaManagerClient['getEmergencyRollbackRoundTx']> {
    return this.rpcClient.rwa.getEmergencyRollbackRoundTx.query(params)
  }

  async getSetFleetTransferabilityTx(
    params: Parameters<IRwaManagerClient['getSetFleetTransferabilityTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetFleetTransferabilityTx']> {
    return this.rpcClient.rwa.getSetFleetTransferabilityTx.query(params)
  }

  async isFleetTransfersEnabled(
    params: Parameters<IRwaManagerClient['isFleetTransfersEnabled']>[0],
  ): ReturnType<IRwaManagerClient['isFleetTransfersEnabled']> {
    return this.rpcClient.rwa.isFleetTransfersEnabled.query(params)
  }

  async getSetWhitelistedTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistedTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistedTx']> {
    return this.rpcClient.rwa.getSetWhitelistedTx.query(params)
  }

  async getSetWhitelistedBatchTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistedBatchTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistedBatchTx']> {
    return this.rpcClient.rwa.getSetWhitelistedBatchTx.query(params)
  }

  async getSetWhitelistOpenTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistOpenTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistOpenTx']> {
    return this.rpcClient.rwa.getSetWhitelistOpenTx.query(params)
  }

  async isWhitelisted(
    params: Parameters<IRwaManagerClient['isWhitelisted']>[0],
  ): ReturnType<IRwaManagerClient['isWhitelisted']> {
    return this.rpcClient.rwa.isWhitelisted.query(params)
  }

  async isWhitelistOpen(
    params: Parameters<IRwaManagerClient['isWhitelistOpen']>[0],
  ): ReturnType<IRwaManagerClient['isWhitelistOpen']> {
    return this.rpcClient.rwa.isWhitelistOpen.query(params)
  }
}
