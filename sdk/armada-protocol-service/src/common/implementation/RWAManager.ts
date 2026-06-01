import type { IRWAManager } from '@summerfi/armada-protocol-common'
import {
  Address,
  getChainInfoByChainId,
  Price,
  RoundsVaultType,
  RwaVaultInfo,
  Token,
  TokenAmount,
  type AddressValue,
  type ChainId,
  type IAddress,
  type IChainInfo,
  type IResolvedRoundsVault,
  type IToken,
  type ITokenAmount,
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
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      RoundsVaultType.Input,
    )
    // Interpret the human-readable amount in the vault's underlying-token decimals.
    const amount = TokenAmount.createFrom({
      token: vault.underlyingToken,
      amount: params.assetsAmount,
    })

    if (amount.isLessThan(vault.minPositionSize)) {
      throw new Error(
        `Deposit amount ${amount.toString()} is less than the minimum position size ${vault.minPositionSize.toString()}`,
      )
    }

    return this._buildVaultDepositTxs({
      vault,
      userAddress: Address.createFromEthereum({ value: params.userAddress }),
      amount,
    })
  }

  /** @see IRWAManager.getClaimSharesTx */
  async getClaimSharesTx(
    params: Parameters<IRWAManager['getClaimSharesTx']>[0],
  ): ReturnType<IRWAManager['getClaimSharesTx']> {
    // Exchange a settled Input-round receipt for Fleet shares.
    const vault = await this._resolveRoundsVault(
      params.vaultId.chainInfo.chainId,
      params.vaultId.fleetAddress.value,
      RoundsVaultType.Input,
    )
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
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      RoundsVaultType.Output,
    )
    // Interpret the human-readable amount in the Output vault's underlying-token (share) decimals.
    const amount = TokenAmount.createFrom({
      token: vault.underlyingToken,
      amount: params.sharesAmount,
    })

    if (amount.isLessThan(vault.minPositionSize)) {
      throw new Error(
        `Withdraw amount ${amount.toString()} is less than the minimum position size ${vault.minPositionSize.toString()}`,
      )
    }

    return this._buildVaultDepositTxs({
      vault,
      userAddress: Address.createFromEthereum({ value: params.userAddress }),
      amount,
    })
  }

  /** @see IRWAManager.getClaimAssetsTx */
  async getClaimAssetsTx(
    params: Parameters<IRWAManager['getClaimAssetsTx']>[0],
  ): ReturnType<IRWAManager['getClaimAssetsTx']> {
    // Exchange a settled Output-round receipt for the underlying asset (e.g. USDC).
    const vault = await this._resolveRoundsVault(
      params.vaultId.chainInfo.chainId,
      params.vaultId.fleetAddress.value,
      RoundsVaultType.Output,
    )
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
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      params.vaultType,
    )
    const contract = await this._getRoundsVaultContract(vault)
    // The receipt amount is denominated in the resolved vault's underlying-token decimals.
    const amount = TokenAmount.createFrom({
      token: vault.underlyingToken,
      amount: params.amount,
    })
    const owner = Address.createFromEthereum({ value: params.userAddress })
    return contract.redeem({
      id: params.roundId,
      amount: amount.toSolidityValue(),
      receiver: params.receiverAddress
        ? Address.createFromEthereum({ value: params.receiverAddress })
        : owner,
      owner,
    })
  }

  /** @see IRWAManager.getCurrentRound */
  async getCurrentRound(
    params: Parameters<IRWAManager['getCurrentRound']>[0],
  ): ReturnType<IRWAManager['getCurrentRound']> {
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      params.vaultType,
    )
    const contract = await this._getRoundsVaultContract(vault)
    return contract.getCurrentRound()
  }

  /** @see IRWAManager.getRoundState */
  async getRoundState(
    params: Parameters<IRWAManager['getRoundState']>[0],
  ): ReturnType<IRWAManager['getRoundState']> {
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      params.vaultType,
    )
    const contract = await this._getRoundsVaultContract(vault)
    const state = await contract.roundState({ roundId: params.roundId })
    return state as RoundState
  }

  /** @see IRWAManager.getExchangeRate */
  async getExchangeRate(
    params: Parameters<IRWAManager['getExchangeRate']>[0],
  ): ReturnType<IRWAManager['getExchangeRate']> {
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      params.vaultType,
    )
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
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      params.vaultType,
    )
    const { receipts } = await this._rwaSubgraphManager.getReceipts({
      chainId: params.chainId,
      account: params.accountAddress.toLowerCase(),
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
    const context = Address.createFromEthereum({ value: params.fleetAddress })
    const contract = await this._getProtocolAccessManagerV2Contract(params.chainId)
    return contract.setWhitelisted({
      context,
      account: Address.createFromEthereum({ value: params.accountAddress }),
      allowed: params.allowed,
    })
  }

  /** @see IRWAManager.getSetWhitelistedBatchTx */
  async getSetWhitelistedBatchTx(
    params: Parameters<IRWAManager['getSetWhitelistedBatchTx']>[0],
  ): ReturnType<IRWAManager['getSetWhitelistedBatchTx']> {
    const context = Address.createFromEthereum({ value: params.fleetAddress })
    const contract = await this._getProtocolAccessManagerV2Contract(params.chainId)
    return contract.setWhitelistedBatch({
      context,
      accounts: params.accountAddresses.map((value) => Address.createFromEthereum({ value })),
      allowed: params.allowed,
    })
  }

  /** @see IRWAManager.getSetWhitelistOpenTx */
  async getSetWhitelistOpenTx(
    params: Parameters<IRWAManager['getSetWhitelistOpenTx']>[0],
  ): ReturnType<IRWAManager['getSetWhitelistOpenTx']> {
    const context = Address.createFromEthereum({ value: params.fleetAddress })
    const contract = await this._getProtocolAccessManagerV2Contract(params.chainId)
    return contract.setWhitelistOpen({
      context,
      isOpen: params.isOpen,
    })
  }

  /** @see IRWAManager.isWhitelisted */
  async isWhitelisted(
    params: Parameters<IRWAManager['isWhitelisted']>[0],
  ): ReturnType<IRWAManager['isWhitelisted']> {
    const context = Address.createFromEthereum({ value: params.fleetAddress })
    const contract = await this._getProtocolAccessManagerV2Contract(params.chainId)
    return contract.isWhitelisted({
      context,
      account: Address.createFromEthereum({ value: params.accountAddress }),
    })
  }

  /** @see IRWAManager.isWhitelistOpen */
  async isWhitelistOpen(
    params: Parameters<IRWAManager['isWhitelistOpen']>[0],
  ): ReturnType<IRWAManager['isWhitelistOpen']> {
    const context = Address.createFromEthereum({ value: params.fleetAddress })
    const contract = await this._getProtocolAccessManagerV2Contract(params.chainId)
    return contract.isWhitelistOpen({ context })
  }

  /** PRIVATE HELPERS */

  /**
   * @name _buildVaultDepositTxs
   * @description Builds the (optional) approval + RoundsVault.deposit transaction pair. The vault's
   *              `underlyingToken` is the asset being deposited and the RoundsVault is the spender.
   */
  private async _buildVaultDepositTxs(params: {
    vault: IResolvedRoundsVault
    /** The depositing user — owner of the approval and receiver of the round receipt. */
    userAddress: IAddress
    /** Amount of the vault's underlyingToken to deposit (in the token's display units). */
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const { vault, userAddress, amount } = params
    const contract = await this._getRoundsVaultContract(vault)

    const transactions: TransactionInfo[] = []

    // The approval is denominated in the vault's underlying token (Input: USDC; Output: Fleet shares).
    const approval = await this._allowanceManager.getApproval({
      chainInfo: vault.chainInfo,
      spender: vault.address,
      amount,
      owner: userAddress,
    })
    if (approval) {
      transactions.push(approval)
    }

    const depositTx = await contract.deposit({
      assets: amount.toSolidityValue(),
      receiver: userAddress,
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
    chainId: ChainId,
  ): Promise<IProtocolAccessManagerV2Contract> {
    const chainInfo = getChainInfoByChainId(chainId)
    const address = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'protocolAccessManager',
      chainId,
    })
    return this._contractsProvider.getProtocolAccessManagerV2Contract({
      chainInfo,
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
   * @throws Error if the Fleet (or the requested RoundsVault side) is not registered.
   */
  private async _resolveRoundsVault(
    chainId: ChainId,
    fleetAddress: AddressValue,
    vaultType: RoundsVaultType,
  ): Promise<IResolvedRoundsVault> {
    const chainInfo = getChainInfoByChainId(chainId)
    const { vault } = await this._rwaSubgraphManager.getVault({
      chainId,
      vaultId: fleetAddress.toLowerCase(),
    })

    const roundsVault =
      vaultType === RoundsVaultType.Input
        ? vault?.roundsVaultPair?.inputVault
        : vault?.roundsVaultPair?.outputVault
    if (!roundsVault) {
      throw new Error(
        `No ${vaultType} RoundsVault registered for Fleet ${fleetAddress} on chain ${chainId}`,
      )
    }

    const underlyingToken = this._buildToken(chainInfo, roundsVault.underlyingToken)
    return {
      chainInfo,
      address: Address.createFromEthereum({ value: roundsVault.id }),
      underlyingToken,
      exchangeAssetToken: this._buildToken(chainInfo, roundsVault.exchangeAssetToken),
      minPositionSize: TokenAmount.createFromBaseUnit({
        token: underlyingToken,
        amount: roundsVault.minPositionSize.toString(),
      }),
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
    return Token.createFromEthereum({
      chainId: chainInfo.chainId,
      addressValue: row.id,
      decimals: row.decimals,
      symbol: row.symbol,
      name: row.name,
    })
  }
}
