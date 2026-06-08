import type { IRWAManager } from '@summerfi/armada-protocol-common'
import {
  Address,
  getChainInfoByChainId,
  Price,
  RoundState,
  RoundsVaultType,
  RwaVaultInfo,
  Token,
  TokenAmount,
  User,
  type AddressValue,
  type ChainId,
  type IResolvedRoundsVault,
  type IToken,
  type ITokenAmount,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type {
  IContractsProvider,
  IRoundsVaultContract,
  IProtocolAccessManagerV2Contract,
} from '@summerfi/contracts-provider-common'
import type { IRwaSubgraphManager, GetUserPositionQuery } from '@summerfi/subgraph-manager-common'
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

    // minPositionSize is a constraint on the resulting position balance, not on a single deposit.
    // For the Input vault the underlyingToken IS the Fleet input asset, so the deposit amount, the
    // position's inputTokenBalance and minPositionSize are all already in that denomination. A
    // missing position means a first-time deposit, so it counts as a zero existing balance.
    const position = await this._getUserPosition(
      params.chainId,
      params.userAddress,
      params.fleetAddress,
    )
    const inputTokenBalance = TokenAmount.createFromBaseUnit({
      token: vault.underlyingToken,
      amount: (position?.inputTokenBalance ?? 0n).toString(),
    })
    // Count the user's open Input-round receipts as assets already in-flight: they are pending
    // deposits (denominated in the Input vault underlying = input asset) not yet settled into the
    // position's inputTokenBalance, so they must contribute to the resulting balance.
    const pendingDeposits = TokenAmount.createFromBaseUnit({
      token: vault.underlyingToken,
      amount: (
        await this._sumReceiptBalances(params.chainId, params.userAddress, vault)
      ).toString(),
    })
    const resultingBalance = inputTokenBalance.add(pendingDeposits).add(amount)
    if (resultingBalance.isLessThan(vault.minPositionSize)) {
      throw new Error(
        `Deposit of ${amount.toString()} plus existing balance ${inputTokenBalance.toString()} and pending deposits ${pendingDeposits.toString()} (total ${resultingBalance.toString()}) is below the minimum position size ${vault.minPositionSize.toString()}`,
      )
    }

    return this._buildVaultDepositTxs({
      vault,
      userAddress: params.userAddress,
      amount,
    })
  }

  /** @see IRWAManager.getClaimSharesTx */
  async getClaimSharesTx(
    params: Parameters<IRWAManager['getClaimSharesTx']>[0],
  ): ReturnType<IRWAManager['getClaimSharesTx']> {
    // Exchange a settled Input-round receipt for Fleet shares.
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      RoundsVaultType.Input,
    )
    const contract = await this._getRoundsVaultContract(vault)
    await this._assertRoundSettled(contract, params.roundId)
    // Receipt amount is denominated in the vault's underlying-token decimals.
    const amount = TokenAmount.createFrom({ token: vault.underlyingToken, amount: params.amount })
    const amountBaseUnits = amount.toSolidityValue()
    await this._assertClaimableReceipt({
      vault,
      accountAddress: params.userAddress,
      roundId: params.roundId,
      amount: amountBaseUnits,
    })
    return contract.redeemExchangeAsset({
      id: params.roundId,
      amount: amountBaseUnits,
      receiver: params.receiverAddress ?? params.userAddress,
      owner: params.userAddress,
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

    // minPositionSize is a constraint on the resulting position balance and is always denominated in
    // the Fleet input asset, whereas the withdraw amount is in Fleet shares. Read the user's position,
    // convert the withdrawn shares to the input asset via pricePerShare, and reject the withdrawal if
    // the remaining balance would fall below minPositionSize.
    const position = await this._getUserPosition(
      params.chainId,
      params.userAddress,
      params.fleetAddress,
    )
    if (!position) {
      throw new Error(`No position found for ${params.userAddress} in Fleet ${params.fleetAddress}`)
    }

    // The Fleet input asset (e.g. USDC) — the denomination of inputTokenBalance and minPositionSize.
    const inputToken = this._buildToken(params.chainId, position.vault.inputToken)
    const inputTokenBalance = TokenAmount.createFromBaseUnit({
      token: inputToken,
      amount: position.inputTokenBalance.toString(),
    })

    // pricePerShare is a BigDecimal: input-asset amount per full share.
    const pricePerShare = position.vault.pricePerShare
    if (pricePerShare == null) {
      throw new Error(
        `Vault ${params.fleetAddress} is missing pricePerShare; cannot validate withdrawal`,
      )
    }
    const withdrawInputValue = TokenAmount.createFrom({
      token: inputToken,
      amount: BigNumber(params.sharesAmount).times(pricePerShare).toFixed(),
    })

    // Re-express minPositionSize (resolved with the share token) in the input-asset denomination.
    const minPositionSize = TokenAmount.createFromBaseUnit({
      token: inputToken,
      amount: vault.minPositionSize.toSolidityValue().toString(),
    })

    const remainingBalance = inputTokenBalance.subtract(withdrawInputValue)
    if (remainingBalance.isLessThan(minPositionSize)) {
      throw new Error(
        `Withdrawing ${params.sharesAmount} shares (~${withdrawInputValue.toString()}) would leave ${remainingBalance.toString()}, below the minimum position size ${minPositionSize.toString()}`,
      )
    }

    return this._buildVaultDepositTxs({
      vault,
      userAddress: params.userAddress,
      amount,
    })
  }

  /** @see IRWAManager.getClaimAssetsTx */
  async getClaimAssetsTx(
    params: Parameters<IRWAManager['getClaimAssetsTx']>[0],
  ): ReturnType<IRWAManager['getClaimAssetsTx']> {
    // Exchange a settled Output-round receipt for the underlying asset (e.g. USDC).
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      RoundsVaultType.Output,
    )
    const contract = await this._getRoundsVaultContract(vault)
    await this._assertRoundSettled(contract, params.roundId)
    // Receipt amount is denominated in the vault's underlying-token decimals.
    const amount = TokenAmount.createFrom({ token: vault.underlyingToken, amount: params.amount })
    const amountBaseUnits = amount.toSolidityValue()
    await this._assertClaimableReceipt({
      vault,
      accountAddress: params.userAddress,
      roundId: params.roundId,
      amount: amountBaseUnits,
    })
    return contract.redeemExchangeAsset({
      id: params.roundId,
      amount: amountBaseUnits,
      receiver: params.receiverAddress ?? params.userAddress,
      owner: params.userAddress,
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
    return contract.redeem({
      id: params.roundId,
      amount: amount.toSolidityValue(),
      receiver: params.receiverAddress ?? params.userAddress,
      owner: params.userAddress,
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
      vault: vault.address.toLowerCase(),
    })

    return receipts.map((receipt) => ({
      roundId: BigInt(receipt.round.roundId),
      balance: BigInt(receipt.balance),
    }))
  }

  /** @see IRWAManager.getSetMinimumPositionSizeTx */
  async getSetMinimumPositionSizeTx(
    params: Parameters<IRWAManager['getSetMinimumPositionSizeTx']>[0],
  ): ReturnType<IRWAManager['getSetMinimumPositionSizeTx']> {
    const vault = await this._resolveRoundsVault(
      params.chainId,
      params.fleetAddress,
      params.vaultType,
    )
    const contract = await this._getRoundsVaultContract(vault)
    // Minimum position size is denominated in the vault's underlying-token decimals.
    const minSize = TokenAmount.createFrom({
      token: vault.underlyingToken,
      amount: params.minimumPositionSize,
    })
    return contract.setMinPositionSize({ minSize: minSize.toSolidityValue() })
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
    userAddress: AddressValue
    /** Amount of the vault's underlyingToken to deposit (in the token's display units). */
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const { vault, userAddress, amount } = params
    const contract = await this._getRoundsVaultContract(vault)

    const transactions: TransactionInfo[] = []

    // The approval is denominated in the vault's underlying token (Input: USDC; Output: Fleet shares).
    const approval = await this._allowanceManager.getApproval({
      chainInfo: getChainInfoByChainId(vault.chainId),
      spender: Address.createFromEthereum({ value: vault.address }),
      amount,
      owner: Address.createFromEthereum({ value: userAddress }),
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
   * @name _assertRoundSettled
   * @description Reads the on-chain round state and throws unless it is `Settled` — exchange-asset
   *              redemptions (claim shares / claim assets) are only valid for settled rounds.
   */
  private async _assertRoundSettled(
    contract: IRoundsVaultContract,
    roundId: bigint,
  ): Promise<void> {
    const state = await contract.roundState({ roundId })
    if (state !== RoundState.Settled) {
      throw new Error(
        `Round ${roundId} is not settled (state: ${RoundState[state] ?? state}); claim is only available for settled rounds`,
      )
    }
  }

  /**
   * @name _assertClaimableReceipt
   * @description Validates a claim against the account's subgraph receipt balances: the amount must be
   *              positive, the target round must have a receipt held by the account, and the amount must
   *              not exceed that receipt's balance.
   */
  private async _assertClaimableReceipt(params: {
    vault: IResolvedRoundsVault
    accountAddress: AddressValue
    roundId: bigint
    /** Receipt amount to redeem, in base units. */
    amount: bigint
  }): Promise<void> {
    const { vault, accountAddress, roundId, amount } = params
    if (amount <= 0n) {
      throw new Error(`Claim amount must be greater than zero (got ${amount})`)
    }

    const { receipts } = await this._rwaSubgraphManager.getReceipts({
      chainId: vault.chainId,
      account: accountAddress.toLowerCase(),
      vault: vault.address.toLowerCase(),
    })
    const receipt = receipts.find((r) => BigInt(r.round.roundId) === roundId)
    if (!receipt) {
      throw new Error(
        `No round ${roundId} receipt held by ${accountAddress} for RoundsVault ${vault.address}`,
      )
    }

    const balance = BigInt(receipt.balance)
    if (amount > balance) {
      throw new Error(
        `Claim amount ${amount} exceeds the round ${roundId} receipt balance ${balance}`,
      )
    }
  }

  /**
   * @name _getRoundsVaultContract
   * @description Returns the IRoundsVaultContract wrapper for a resolved RoundsVault.
   */
  private _getRoundsVaultContract(vault: IResolvedRoundsVault): Promise<IRoundsVaultContract> {
    return this._contractsProvider.getRoundsVaultContract({
      chainInfo: getChainInfoByChainId(vault.chainId),
      address: Address.createFromEthereum({ value: vault.address }),
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

    const underlyingToken = this._buildToken(chainId, roundsVault.underlyingToken)
    const exchangeAssetToken = this._buildToken(chainId, roundsVault.exchangeAssetToken)
    // The minimum position size is in fleet asset token, on input that's underlying and on output that's exchange asset
    const minPositionSize = TokenAmount.createFromBaseUnit({
      token: vaultType === RoundsVaultType.Input ? underlyingToken : exchangeAssetToken,
      amount: roundsVault.minPositionSize.toString(),
    })

    return {
      chainId,
      address: roundsVault.id as AddressValue,
      underlyingToken,
      exchangeAssetToken,
      minPositionSize,
    }
  }

  /**
   * @name _getUserPosition
   * @description Reads the user's Fleet position from the RWA subgraph (via the inherited
   *              `getUserPosition`). Returns the single position row, or `undefined` when the user
   *              holds no position in the Fleet.
   */
  private async _getUserPosition(
    chainId: ChainId,
    userAddress: AddressValue,
    fleetAddress: AddressValue,
  ): Promise<GetUserPositionQuery['positions'][number] | undefined> {
    const { positions } = await this._rwaSubgraphManager.getUserPosition({
      user: User.createFromEthereum(chainId, userAddress),
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    return positions[0]
  }

  /**
   * @name _sumReceiptBalances
   * @description Sums the account's open (non-zero) RoundsVault receipt balances for a resolved vault,
   *              in the vault's underlying-token base units. Used to count pending deposits that have
   *              not yet settled into the Fleet position.
   */
  private async _sumReceiptBalances(
    chainId: ChainId,
    accountAddress: AddressValue,
    vault: IResolvedRoundsVault,
  ): Promise<bigint> {
    const { receipts } = await this._rwaSubgraphManager.getReceipts({
      chainId,
      account: accountAddress.toLowerCase(),
      vault: vault.address.toLowerCase(),
    })
    return receipts.reduce((sum, receipt) => sum + BigInt(receipt.balance), 0n)
  }

  /**
   * @name _buildToken
   * @description Builds an IToken from an RWA subgraph token row.
   */
  private _buildToken(
    chainId: ChainId,
    row: { id: string; name: string; symbol: string; decimals: number },
  ): IToken {
    return Token.createFromEthereum({
      chainId,
      addressValue: row.id,
      decimals: row.decimals,
      symbol: row.symbol,
      name: row.name,
    })
  }
}
