import { IAddress, type RwaRole, TransactionInfo } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name IProtocolAccessManagerV2Contract
 * @description Interface for the ProtocolAccessManagerV2 contract wrapper. V2 extends the V1 manager
 *              with a per-context whitelist: whitelist status is scoped to a `context` address
 *              (typically a Fleet) so a single access manager can gate many institutional vaults.
 */
export interface IProtocolAccessManagerV2Contract extends IContractWrapper {
  /** WRITE METHODS */

  /**
   * @name setWhitelisted
   * @description Sets an account's explicit whitelist record for a context. Restricted on-chain to
   *              `WHITELIST_MANAGER_ROLE`.
   *
   * @param context The context (typically a Fleet address) the record is scoped to
   * @param account The account to update
   * @param allowed true to whitelist, false to remove the record
   *
   * @returns The transaction information
   */
  setWhitelisted(params: {
    context: IAddress
    account: IAddress
    allowed: boolean
  }): Promise<TransactionInfo>

  /**
   * @name setWhitelistedBatch
   * @description Batch variant of setWhitelisted. Reverts on length mismatch or batches larger than
   *              the on-chain `MAX_WHITELIST_BATCH_SIZE`.
   *
   * @param context The context the records are scoped to
   * @param accounts Accounts to update
   * @param allowed Per-account statuses aligned with `accounts`
   *
   * @returns The transaction information
   */
  setWhitelistedBatch(params: {
    context: IAddress
    accounts: IAddress[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  /**
   * @name setWhitelistOpen
   * @description Sets the global-open flag for a context. When open, every account reads as
   *              whitelisted for that context.
   *
   * @param context The context to update
   * @param isOpen The new open status
   *
   * @returns The transaction information
   */
  setWhitelistOpen(params: { context: IAddress; isOpen: boolean }): Promise<TransactionInfo>

  /**
   * @name grantRole
   * @description Grants a role to an account via the matching on-chain typed wrapper
   *              (`grantGovernorRole`, `grantKeeperRole`, …). Restricted on-chain to the governor.
   *
   * @param role The role descriptor (carries a `target` for contract-specific roles)
   * @param account The account to grant the role to
   *
   * @returns The transaction information
   */
  grantRole(params: { role: RwaRole; account: IAddress }): Promise<TransactionInfo>

  /**
   * @name revokeRole
   * @description Revokes a role from an account via the matching on-chain typed wrapper
   *              (`revokeGovernorRole`, `revokeKeeperRole`, …). Restricted on-chain to the governor.
   *
   * @param role The role descriptor (carries a `target` for contract-specific roles)
   * @param account The account to revoke the role from
   *
   * @returns The transaction information
   */
  revokeRole(params: { role: RwaRole; account: IAddress }): Promise<TransactionInfo>

  /** READ METHODS */

  /**
   * @name isWhitelisted
   * @description Returns whether an account is allowed to interact with a context (explicit record
   *              or globally open).
   *
   * @param context The context the check is scoped to
   * @param account The account to check
   */
  isWhitelisted(params: { context: IAddress; account: IAddress }): Promise<boolean>

  /**
   * @name isWhitelistOpen
   * @description Returns whether a context's whitelist has been globally opened.
   *
   * @param context The context to check
   */
  isWhitelistOpen(params: { context: IAddress }): Promise<boolean>
}
