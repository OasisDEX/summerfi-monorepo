import { IAddress, TransactionInfo } from '@summerfi/sdk-common'
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
  deposit(params: { assets: bigint; receiver: IAddress }): Promise<TransactionInfo>

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
    receiver: IAddress
    owner: IAddress
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
    receiver: IAddress
    owner: IAddress
  }): Promise<TransactionInfo>

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
