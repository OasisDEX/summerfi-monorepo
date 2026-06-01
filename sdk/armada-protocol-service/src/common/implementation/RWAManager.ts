import type { IRWAManager } from '@summerfi/armada-protocol-common'
import {
  Address,
  Price,
  RoundsVaultType,
  RwaVaultInfo,
  Token,
  TokenAmount,
  type IAddress,
  type IArmadaVaultId,
  type IChainInfo,
  type IResolvedRoundsVault,
  type IToken,
  type RoundState,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type {
  IContractsProvider,
  IRoundsVaultContract,
  IProtocolAccessManagerV2Contract,
} from '@summerfi/contracts-provider-common'
import type { IRwaSubgraphManager } from '@summerfi/subgraph-manager-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { ArmadaManagerShared } from './ArmadaManagerShared'
import { mapSubgraphVaultToVaultInfoParams } from './extensions/mapSubgraphVaultToVaultInfoParams'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'

/**
 * @name RWAManager
 * @implements IRWAManager
 * @description Mirrors ArmadaManagerVaults.getVaultInfoListPerChain but sources data
 *              from the RWA subgraph and returns RwaVaultInfo instances.
 *
 *              The deposit/withdraw flow uses the RoundsVault async settlement model: the Input and
 *              Output RoundsVault addresses are resolved from the RWA subgraph (the Fleet's
 *              `roundsVaultPair`) and the on-chain transactions / reads go through the
 *              IRoundsVaultContract wrapper.
 *
 *              The whitelist methods go through ProtocolAccessManagerV2, resolved via the deployment
 *              provider (`protocolAccessManager`), scoping every call to the Fleet address as context.
 */
export class RWAManager extends ArmadaManagerShared implements IRWAManager {
  private readonly _rwaSubgraphManager: IRwaSubgraphManager
  private readonly _tokensManager: ITokensManager
  private readonly _contractsProvider: IContractsProvider
  private readonly _allowanceManager: IAllowanceManager
  private readonly _deploymentProvider: IDeploymentProvider

  constructor(params: {
    clientId?: string
    rwaSubgraphManager: IRwaSubgraphManager
    tokensManager: ITokensManager
    contractsProvider: IContractsProvider
    allowanceManager: IAllowanceManager
    deploymentProvider: IDeploymentProvider
  }) {
    super({ clientId: params.clientId })
    this._rwaSubgraphManager = params.rwaSubgraphManager
    this._tokensManager = params.tokensManager
    this._contractsProvider = params.contractsProvider
    this._allowanceManager = params.allowanceManager
    this._deploymentProvider = params.deploymentProvider
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
    params: Parameters<IRWAManager['getDepositTx']>[0],
  ): ReturnType<IRWAManager['getDepositTx']> {
    // Deposit the Fleet underlying (e.g. USDC) into the Input RoundsVault for the current round.
    const vault = await this._resolveRoundsVault(params.vaultId, RoundsVaultType.Input)
    return this._buildVaultDepositTxs({
      vault,
      user: params.user,
      amount: params.amount,
    })
  }

  /** @see IRWAManager.getClaimSharesTx */
  async getClaimSharesTx(
    params: Parameters<IRWAManager['getClaimSharesTx']>[0],
  ): ReturnType<IRWAManager['getClaimSharesTx']> {
    // Exchange a settled Input-round receipt for Fleet shares.
    const vault = await this._resolveRoundsVault(params.vaultId, RoundsVaultType.Input)
    const contract = await this._getRoundsVaultContract(vault)
    const owner = params.user.wallet.address
    return contract.redeemExchangeAsset({
      id: params.roundId,
      amount: params.amount,
      receiver: params.receiver ?? owner,
      owner,
    })
  }

  /** @see IRWAManager.getWithdrawTx */
  async getWithdrawTx(
    params: Parameters<IRWAManager['getWithdrawTx']>[0],
  ): ReturnType<IRWAManager['getWithdrawTx']> {
    // Deposit Fleet shares into the Output RoundsVault for the current round.
    const vault = await this._resolveRoundsVault(params.vaultId, RoundsVaultType.Output)
    return this._buildVaultDepositTxs({
      vault,
      user: params.user,
      amount: params.amount,
    })
  }

  /** @see IRWAManager.getClaimAssetsTx */
  async getClaimAssetsTx(
    params: Parameters<IRWAManager['getClaimAssetsTx']>[0],
  ): ReturnType<IRWAManager['getClaimAssetsTx']> {
    // Exchange a settled Output-round receipt for the underlying asset (e.g. USDC).
    const vault = await this._resolveRoundsVault(params.vaultId, RoundsVaultType.Output)
    const contract = await this._getRoundsVaultContract(vault)
    const owner = params.user.wallet.address
    return contract.redeemExchangeAsset({
      id: params.roundId,
      amount: params.amount,
      receiver: params.receiver ?? owner,
      owner,
    })
  }

  /** @see IRWAManager.getCancelRoundDepositTx */
  async getCancelRoundDepositTx(
    params: Parameters<IRWAManager['getCancelRoundDepositTx']>[0],
  ): ReturnType<IRWAManager['getCancelRoundDepositTx']> {
    // Redeem an open current-round receipt back into the originally deposited asset.
    const vault = await this._resolveRoundsVault(params.vaultId, params.vaultType)
    const contract = await this._getRoundsVaultContract(vault)
    const owner = params.user.wallet.address
    return contract.redeem({
      id: params.roundId,
      amount: params.amount,
      receiver: params.receiver ?? owner,
      owner,
    })
  }

  /** @see IRWAManager.getCurrentRound */
  async getCurrentRound(
    params: Parameters<IRWAManager['getCurrentRound']>[0],
  ): ReturnType<IRWAManager['getCurrentRound']> {
    const vault = await this._resolveRoundsVault(params.vaultId, params.vaultType)
    const contract = await this._getRoundsVaultContract(vault)
    return contract.getCurrentRound()
  }

  /** @see IRWAManager.getRoundState */
  async getRoundState(
    params: Parameters<IRWAManager['getRoundState']>[0],
  ): ReturnType<IRWAManager['getRoundState']> {
    const vault = await this._resolveRoundsVault(params.vaultId, params.vaultType)
    const contract = await this._getRoundsVaultContract(vault)
    const state = await contract.roundState({ roundId: params.roundId })
    return state as RoundState
  }

  /** @see IRWAManager.getExchangeRate */
  async getExchangeRate(
    params: Parameters<IRWAManager['getExchangeRate']>[0],
  ): ReturnType<IRWAManager['getExchangeRate']> {
    const vault = await this._resolveRoundsVault(params.vaultId, params.vaultType)
    const contract = await this._getRoundsVaultContract(vault)
    const { baseAmount, quoteAmount } = await contract.getExchangeRate({ round: params.roundId })

    // On-chain Price tuple: baseAmount = underlying, quoteAmount = exchange asset.
    // The resulting IPrice expresses exchange-asset per unit of underlying.
    return Price.createFromAmountsRatio({
      numerator: TokenAmount.createFromBaseUnit({
        token: vault.exchangeAssetToken,
        amount: quoteAmount.toString(),
      }),
      denominator: TokenAmount.createFromBaseUnit({
        token: vault.underlyingToken,
        amount: baseAmount.toString(),
      }),
    })
  }

  /** @see IRWAManager.getReceiptBalances */
  async getReceiptBalances(
    params: Parameters<IRWAManager['getReceiptBalances']>[0],
  ): ReturnType<IRWAManager['getReceiptBalances']> {
    const vault = await this._resolveRoundsVault(params.vaultId, params.vaultType)
    const { receipts } = await this._rwaSubgraphManager.getReceipts({
      chainId: params.vaultId.chainInfo.chainId,
      account: params.account.value.toLowerCase(),
      vault: vault.address.value.toLowerCase(),
    })

    return receipts.map((receipt) => ({
      roundId: BigInt(receipt.round.roundId),
      balance: BigInt(receipt.balance),
    }))
  }

  /** @see IRWAManager.getSetWhitelistedTx */
  async getSetWhitelistedTx(
    params: Parameters<IRWAManager['getSetWhitelistedTx']>[0],
  ): ReturnType<IRWAManager['getSetWhitelistedTx']> {
    const contract = await this._getProtocolAccessManagerV2Contract(params.vaultId)
    return contract.setWhitelisted({
      context: params.vaultId.fleetAddress,
      account: params.account,
      allowed: params.allowed,
    })
  }

  /** @see IRWAManager.getSetWhitelistedBatchTx */
  async getSetWhitelistedBatchTx(
    params: Parameters<IRWAManager['getSetWhitelistedBatchTx']>[0],
  ): ReturnType<IRWAManager['getSetWhitelistedBatchTx']> {
    const contract = await this._getProtocolAccessManagerV2Contract(params.vaultId)
    return contract.setWhitelistedBatch({
      context: params.vaultId.fleetAddress,
      accounts: params.accounts,
      allowed: params.allowed,
    })
  }

  /** @see IRWAManager.getSetWhitelistOpenTx */
  async getSetWhitelistOpenTx(
    params: Parameters<IRWAManager['getSetWhitelistOpenTx']>[0],
  ): ReturnType<IRWAManager['getSetWhitelistOpenTx']> {
    const contract = await this._getProtocolAccessManagerV2Contract(params.vaultId)
    return contract.setWhitelistOpen({
      context: params.vaultId.fleetAddress,
      isOpen: params.isOpen,
    })
  }

  /** @see IRWAManager.isWhitelisted */
  async isWhitelisted(
    params: Parameters<IRWAManager['isWhitelisted']>[0],
  ): ReturnType<IRWAManager['isWhitelisted']> {
    const contract = await this._getProtocolAccessManagerV2Contract(params.vaultId)
    return contract.isWhitelisted({
      context: params.vaultId.fleetAddress,
      account: params.account,
    })
  }

  /** @see IRWAManager.isWhitelistOpen */
  async isWhitelistOpen(
    params: Parameters<IRWAManager['isWhitelistOpen']>[0],
  ): ReturnType<IRWAManager['isWhitelistOpen']> {
    const contract = await this._getProtocolAccessManagerV2Contract(params.vaultId)
    return contract.isWhitelistOpen({
      context: params.vaultId.fleetAddress,
    })
  }

  /** PRIVATE HELPERS */

  /**
   * @name _buildVaultDepositTxs
   * @description Builds the (optional) approval + RoundsVault.deposit transaction pair. The vault's
   *              `underlyingToken` is the asset being deposited and the RoundsVault is the spender.
   */
  private async _buildVaultDepositTxs(params: {
    vault: IResolvedRoundsVault
    user: Parameters<IRWAManager['getDepositTx']>[0]['user']
    amount: Parameters<IRWAManager['getDepositTx']>[0]['amount']
  }): Promise<TransactionInfo[]> {
    const { vault, user, amount } = params
    const contract = await this._getRoundsVaultContract(vault)

    const transactions: TransactionInfo[] = []

    const approval = await this._allowanceManager.getApproval({
      chainInfo: vault.chainInfo,
      spender: vault.address,
      amount,
      owner: user.wallet.address,
    })
    if (approval) {
      transactions.push(approval)
    }

    const depositTx = await contract.deposit({
      assets: amount.toSolidityValue(),
      receiver: user.wallet.address,
    })
    transactions.push(depositTx)

    return transactions
  }

  /**
   * @name _getProtocolAccessManagerV2Contract
   * @description Resolves the institution's ProtocolAccessManagerV2 (which holds the per-context
   *              whitelist) via the deployment provider and returns its contract wrapper. For a v2
   *              institutional SDK the deployment config's `protocolAccessManager` is the per-context
   *              PAM-V2; the whitelist methods scope every call to the Fleet address as `context`.
   */
  private async _getProtocolAccessManagerV2Contract(
    vaultId: IArmadaVaultId,
  ): Promise<IProtocolAccessManagerV2Contract> {
    const address = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'protocolAccessManager',
      chainId: vaultId.chainInfo.chainId,
    })
    return this._contractsProvider.getProtocolAccessManagerV2Contract({
      chainInfo: vaultId.chainInfo,
      address,
    })
  }

  /**
   * @name _getRoundsVaultContract
   * @description Returns the IRoundsVaultContract wrapper for a resolved RoundsVault.
   */
  private _getRoundsVaultContract(vault: IResolvedRoundsVault): Promise<IRoundsVaultContract> {
    return this._contractsProvider.getRoundsVaultContract({
      chainInfo: vault.chainInfo,
      address: vault.address,
    })
  }

  /**
   * @name _resolveRoundsVault
   * @description Resolves the Input or Output RoundsVault address + token metadata for a Fleet from
   *              the RWA subgraph (`vault.roundsVaultPair`).
   *
   * @throws Error if the Fleet has no rounds-vault pair or the requested side is not registered.
   */
  private async _resolveRoundsVault(
    vaultId: IArmadaVaultId,
    vaultType: RoundsVaultType,
  ): Promise<IResolvedRoundsVault> {
    const { vault } = await this._rwaSubgraphManager.getVault({
      chainId: vaultId.chainInfo.chainId,
      vaultId: vaultId.fleetAddress.value.toLowerCase(),
    })

    const pair = vault?.roundsVaultPair
    if (!pair) {
      throw new Error(
        `No RoundsVault pair registered for Fleet ${vaultId.fleetAddress.value} on chain ${vaultId.chainInfo.chainId}`,
      )
    }

    const side = vaultType === RoundsVaultType.Input ? pair.inputVault : pair.outputVault
    if (!side) {
      throw new Error(
        `No ${vaultType} RoundsVault registered for Fleet ${vaultId.fleetAddress.value} on chain ${vaultId.chainInfo.chainId}`,
      )
    }

    return {
      chainInfo: vaultId.chainInfo,
      address: Address.createFromEthereum({ value: side.id }),
      underlyingToken: this._buildToken(vaultId.chainInfo, side.underlyingToken),
      exchangeAssetToken: this._buildToken(vaultId.chainInfo, side.exchangeAssetToken),
    }
  }

  /**
   * @name _buildToken
   * @description Builds an IToken from an RWA subgraph token row.
   */
  private _buildToken(
    chainInfo: IChainInfo,
    row: { id: string; name: string; symbol: string; decimals: number },
  ): IToken {
    return Token.createFrom({
      chainInfo,
      address: Address.createFromEthereum({ value: row.id }),
      decimals: row.decimals,
      symbol: row.symbol,
      name: row.name,
    })
  }
}
