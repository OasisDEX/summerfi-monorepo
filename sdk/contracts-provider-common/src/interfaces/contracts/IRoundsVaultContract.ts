import { AddressValue, TransactionInfo } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name IRoundsVaultContract
 * @description Interface for the RoundsVault contract wrapper (both Input and Output vaults share the
 *              same ABI). A RoundsVault implements the async settlement flow: assets are deposited in
 *              exchange for an ERC-1155 receipt scoped to the current round; once the round settles the
 *              receipt can be redeemed for the exchange asset.
 */
export interface IRoundsVaultContract extends IContractWrapper {
  /** WRITE METHODS */

  /**
   * @name deposit
   * @description Deposits assets into the vault for the current round, minting an ERC-1155 receipt to
   *              the receiver.
   *
   * @param assets The amount of assets to deposit (in base units)
   * @param receiver The address that will receive the round receipt
   *
   * @returns The transaction information
   */
  deposit(params: { assets: bigint; receiver: AddressValue }): Promise<TransactionInfo>

  /**
   * @name redeem
   * @description Redeems a current (open) round receipt back into the originally deposited asset. Used
   *              to cancel a pending deposit before the round settles.
   *
   * @param id The receipt id (round number) to redeem
   * @param amount The amount of receipt to redeem
   * @param receiver The address that will receive the redeemed asset
   * @param owner The owner of the receipt
   *
   * @returns The transaction information
   */
  redeem(params: {
    id: bigint
    amount: bigint
    receiver: AddressValue
    owner: AddressValue
  }): Promise<TransactionInfo>

  /**
   * @name redeemExchangeAsset
   * @description Redeems a settled round receipt into the exchange asset. Used to claim the result of a
   *              settled round (Fleet shares for an Input vault, underlying assets for an Output vault).
   *
   * @param id The receipt id (round number) to redeem
   * @param amount The amount of receipt to redeem
   * @param receiver The address that will receive the exchange asset
   * @param owner The owner of the receipt
   *
   * @returns The transaction information
   */
  redeemExchangeAsset(params: {
    id: bigint
    amount: bigint
    receiver: AddressValue
    owner: AddressValue
  }): Promise<TransactionInfo>

  /**
   * @name setMinPositionSize
   * @description Sets the minimum position size (in the vault's underlying-token base units) required
   *              to hold a position in this RoundsVault.
   *
   * @param minSize The new minimum position size (base units)
   *
   * @returns The transaction information
   */
  setMinPositionSize(params: { minSize: bigint }): Promise<TransactionInfo>

  /**
   * @name nextRound
   * @description Closes the current open round (moving it to InSettlement) and opens a new round.
   *              Keeper/SuperKeeper-gated round-lifecycle operation.
   *
   * @returns The transaction information
   */
  nextRound(): Promise<TransactionInfo>

  /**
   * @name setRoundSettled
   * @description Marks an in-settlement round as Settled (after off-chain settlement completes),
   *              making its receipts redeemable. Keeper/SuperKeeper-gated.
   *
   * @param roundId The round number to settle
   *
   * @returns The transaction information
   */
  setRoundSettled(params: { roundId: bigint }): Promise<TransactionInfo>

  /**
   * @name setRoundSettledBatch
   * @description Marks multiple in-settlement rounds as Settled in a single call. Keeper/SuperKeeper-gated.
   *
   * @param roundIds The round numbers to settle
   *
   * @returns The transaction information
   */
  setRoundSettledBatch(params: { roundIds: bigint[] }): Promise<TransactionInfo>

  /**
   * @name retryRound
   * @description Re-queues a rolled-back round for settlement (Opened → InSettlement again).
   *              Keeper/SuperKeeper-gated.
   *
   * @param roundId The round number to retry
   *
   * @returns The transaction information
   */
  retryRound(params: { roundId: bigint }): Promise<TransactionInfo>

  /**
   * @name emergencyRollbackRound
   * @description Rolls a stuck in-settlement round back to Opened (recovery path). Governor-gated.
   *
   * @param roundId The round number to roll back
   *
   * @returns The transaction information
   */
  emergencyRollbackRound(params: { roundId: bigint }): Promise<TransactionInfo>

  /** READ METHODS */

  /**
   * @name getCurrentRound
   * @description Returns the current open round number
   *
   * @returns The current round number
   */
  getCurrentRound(): Promise<bigint>

  /**
   * @name roundState
   * @description Returns the on-chain state of a round (see RoundState enum: NotOpened=0, Opened=1,
   *              InSettlement=2, Settled=3)
   *
   * @param roundId The round number to query
   *
   * @returns The round state as a numeric enum value
   */
  roundState(params: { roundId: bigint }): Promise<number>

  /**
   * @name getExchangeRate
   * @description Returns the settled exchange rate snapshot for a round as a Price struct
   *              (baseAmount / quoteAmount)
   *
   * @param round The round number to query
   *
   * @returns The exchange rate as a base/quote amount pair
   */
  getExchangeRate(params: { round: bigint }): Promise<{ baseAmount: bigint; quoteAmount: bigint }>
}
