import type { IRWAManager } from '@summerfi/armada-protocol-common'
import { RwaVaultInfo } from '@summerfi/sdk-common'
import type { IRwaSubgraphManager } from '@summerfi/subgraph-manager-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { ArmadaManagerShared } from './ArmadaManagerShared'
import { mapSubgraphVaultToVaultInfoParams } from './extensions/mapSubgraphVaultToVaultInfoParams'

/**
 * @name RWAManager
 * @implements IRWAManager
 * @description Mirrors ArmadaManagerVaults.getVaultInfoListPerChain but sources data
 *              from the RWA subgraph and returns RwaVaultInfo instances.
 *              APY / rewards / Merkl emissions are not yet wired up — this is a
 *              first-cut implementation intended to be extended later.
 */
export class RWAManager extends ArmadaManagerShared implements IRWAManager {
  private readonly _rwaSubgraphManager: IRwaSubgraphManager
  private readonly _tokensManager: ITokensManager

  constructor(params: {
    clientId?: string
    rwaSubgraphManager: IRwaSubgraphManager
    tokensManager: ITokensManager
  }) {
    super({ clientId: params.clientId })
    this._rwaSubgraphManager = params.rwaSubgraphManager
    this._tokensManager = params.tokensManager
  }

  async getVaultInfoListPerChain(
    params: Parameters<IRWAManager['getVaultInfoListPerChain']>[0],
  ): ReturnType<IRWAManager['getVaultInfoListPerChain']> {
    const { chainId, clientId } = params
    const queryResult = await this._rwaSubgraphManager.getVaults({
      chainId,
      clientId,
    })

    if (!queryResult || !queryResult.vaults) {
      return { list: [] }
    }

    const list = queryResult.vaults.map((rawVault) =>
      RwaVaultInfo.createFrom(
        mapSubgraphVaultToVaultInfoParams({
          chainId,
          rawVault,
          tokensManager: this._tokensManager,
          apysForVault: undefined,
          rewardsApysForVault: undefined,
          merklRewardsForVault: undefined,
        }),
      ),
    )

    return { list }
  }

  /** @see IRWAManager.getVaultsRaw */
  async getVaultsRaw(
    params: Parameters<IRWAManager['getVaultsRaw']>[0],
  ): ReturnType<IRWAManager['getVaultsRaw']> {
    return this._rwaSubgraphManager.getVaults({
      chainId: params.chainInfo.chainId,
      clientId: params.clientId,
    })
  }

  /** @see IRWAManager.getVaultRaw */
  async getVaultRaw(
    params: Parameters<IRWAManager['getVaultRaw']>[0],
  ): ReturnType<IRWAManager['getVaultRaw']> {
    return this._rwaSubgraphManager.getVault({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
    })
  }

  /** @see IRWAManager.getDepositTx */
  async getDepositTx(
    _params: Parameters<IRWAManager['getDepositTx']>[0],
  ): ReturnType<IRWAManager['getDepositTx']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getClaimSharesTx */
  async getClaimSharesTx(
    _params: Parameters<IRWAManager['getClaimSharesTx']>[0],
  ): ReturnType<IRWAManager['getClaimSharesTx']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getWithdrawTx */
  async getWithdrawTx(
    _params: Parameters<IRWAManager['getWithdrawTx']>[0],
  ): ReturnType<IRWAManager['getWithdrawTx']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getClaimAssetsTx */
  async getClaimAssetsTx(
    _params: Parameters<IRWAManager['getClaimAssetsTx']>[0],
  ): ReturnType<IRWAManager['getClaimAssetsTx']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getCancelRoundDepositTx */
  async getCancelRoundDepositTx(
    _params: Parameters<IRWAManager['getCancelRoundDepositTx']>[0],
  ): ReturnType<IRWAManager['getCancelRoundDepositTx']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getCurrentRound */
  async getCurrentRound(
    _params: Parameters<IRWAManager['getCurrentRound']>[0],
  ): ReturnType<IRWAManager['getCurrentRound']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getRoundState */
  async getRoundState(
    _params: Parameters<IRWAManager['getRoundState']>[0],
  ): ReturnType<IRWAManager['getRoundState']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getExchangeRate */
  async getExchangeRate(
    _params: Parameters<IRWAManager['getExchangeRate']>[0],
  ): ReturnType<IRWAManager['getExchangeRate']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getReceiptBalances */
  async getReceiptBalances(
    _params: Parameters<IRWAManager['getReceiptBalances']>[0],
  ): ReturnType<IRWAManager['getReceiptBalances']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getSetWhitelistedTx */
  async getSetWhitelistedTx(
    _params: Parameters<IRWAManager['getSetWhitelistedTx']>[0],
  ): ReturnType<IRWAManager['getSetWhitelistedTx']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getSetWhitelistedBatchTx */
  async getSetWhitelistedBatchTx(
    _params: Parameters<IRWAManager['getSetWhitelistedBatchTx']>[0],
  ): ReturnType<IRWAManager['getSetWhitelistedBatchTx']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.getSetWhitelistOpenTx */
  async getSetWhitelistOpenTx(
    _params: Parameters<IRWAManager['getSetWhitelistOpenTx']>[0],
  ): ReturnType<IRWAManager['getSetWhitelistOpenTx']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.isWhitelisted */
  async isWhitelisted(
    _params: Parameters<IRWAManager['isWhitelisted']>[0],
  ): ReturnType<IRWAManager['isWhitelisted']> {
    throw new Error('Not implemented')
  }

  /** @see IRWAManager.isWhitelistOpen */
  async isWhitelistOpen(
    _params: Parameters<IRWAManager['isWhitelistOpen']>[0],
  ): ReturnType<IRWAManager['isWhitelistOpen']> {
    throw new Error('Not implemented')
  }
}
