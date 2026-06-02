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
    return this.rpcClient.armada.rwa.getVaultInfoListPerChain.query(params)
  }

  async getVaultsRaw(
    params: Parameters<IRwaManagerClient['getVaultsRaw']>[0],
  ): ReturnType<IRwaManagerClient['getVaultsRaw']> {
    return this.rpcClient.armada.rwa.getVaultsRaw.query(params)
  }

  async getVaultRaw(
    params: Parameters<IRwaManagerClient['getVaultRaw']>[0],
  ): ReturnType<IRwaManagerClient['getVaultRaw']> {
    return this.rpcClient.armada.rwa.getVaultRaw.query(params)
  }

  async getDepositTx(
    params: Parameters<IRwaManagerClient['getDepositTx']>[0],
  ): ReturnType<IRwaManagerClient['getDepositTx']> {
    return this.rpcClient.armada.rwa.getDepositTx.query(params)
  }

  async getClaimSharesTx(
    params: Parameters<IRwaManagerClient['getClaimSharesTx']>[0],
  ): ReturnType<IRwaManagerClient['getClaimSharesTx']> {
    return this.rpcClient.armada.rwa.getClaimSharesTx.query(params)
  }

  async getWithdrawTx(
    params: Parameters<IRwaManagerClient['getWithdrawTx']>[0],
  ): ReturnType<IRwaManagerClient['getWithdrawTx']> {
    return this.rpcClient.armada.rwa.getWithdrawTx.query(params)
  }

  async getClaimAssetsTx(
    params: Parameters<IRwaManagerClient['getClaimAssetsTx']>[0],
  ): ReturnType<IRwaManagerClient['getClaimAssetsTx']> {
    return this.rpcClient.armada.rwa.getClaimAssetsTx.query(params)
  }

  async getCancelRoundDepositTx(
    params: Parameters<IRwaManagerClient['getCancelRoundDepositTx']>[0],
  ): ReturnType<IRwaManagerClient['getCancelRoundDepositTx']> {
    return this.rpcClient.armada.rwa.getCancelRoundDepositTx.query(params)
  }

  async getCurrentRound(
    params: Parameters<IRwaManagerClient['getCurrentRound']>[0],
  ): ReturnType<IRwaManagerClient['getCurrentRound']> {
    return this.rpcClient.armada.rwa.getCurrentRound.query(params)
  }

  async getRoundState(
    params: Parameters<IRwaManagerClient['getRoundState']>[0],
  ): ReturnType<IRwaManagerClient['getRoundState']> {
    return this.rpcClient.armada.rwa.getRoundState.query(params)
  }

  async getExchangeRate(
    params: Parameters<IRwaManagerClient['getExchangeRate']>[0],
  ): ReturnType<IRwaManagerClient['getExchangeRate']> {
    return this.rpcClient.armada.rwa.getExchangeRate.query(params)
  }

  async getReceiptBalances(
    params: Parameters<IRwaManagerClient['getReceiptBalances']>[0],
  ): ReturnType<IRwaManagerClient['getReceiptBalances']> {
    return this.rpcClient.armada.rwa.getReceiptBalances.query(params)
  }

  async getSetMinimumPositionSizeTx(
    params: Parameters<IRwaManagerClient['getSetMinimumPositionSizeTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetMinimumPositionSizeTx']> {
    return this.rpcClient.armada.rwa.getSetMinimumPositionSizeTx.query(params)
  }

  async getSetWhitelistedTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistedTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistedTx']> {
    return this.rpcClient.armada.rwa.getSetWhitelistedTx.query(params)
  }

  async getSetWhitelistedBatchTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistedBatchTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistedBatchTx']> {
    return this.rpcClient.armada.rwa.getSetWhitelistedBatchTx.query(params)
  }

  async getSetWhitelistOpenTx(
    params: Parameters<IRwaManagerClient['getSetWhitelistOpenTx']>[0],
  ): ReturnType<IRwaManagerClient['getSetWhitelistOpenTx']> {
    return this.rpcClient.armada.rwa.getSetWhitelistOpenTx.query(params)
  }

  async isWhitelisted(
    params: Parameters<IRwaManagerClient['isWhitelisted']>[0],
  ): ReturnType<IRwaManagerClient['isWhitelisted']> {
    return this.rpcClient.armada.rwa.isWhitelisted.query(params)
  }

  async isWhitelistOpen(
    params: Parameters<IRwaManagerClient['isWhitelistOpen']>[0],
  ): ReturnType<IRwaManagerClient['isWhitelistOpen']> {
    return this.rpcClient.armada.rwa.isWhitelistOpen.query(params)
  }
}
