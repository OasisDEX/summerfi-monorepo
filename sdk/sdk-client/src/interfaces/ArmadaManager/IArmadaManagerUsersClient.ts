import {
  type GetVaultQuery,
  type GetVaultsQuery,
  type GetGlobalRebalancesQuery,
  type GetUsersActivityQuery,
  type GetUserActivityQuery,
} from '@summerfi/armada-protocol-common'
import type { Position_Filter } from '@summerfi/subgraph-manager-common'
import {
  BridgeTransactionInfo,
  ITokenAmount,
  IUser,
  type AddressValue,
  type ApproveTransactionInfo,
  type ArmadaMigratablePosition,
  type ArmadaMigratablePositionApy,
  type ArmadaMigrationType,
  type ChainInfo,
  type ClaimTransactionInfo,
  type DelegateTransactionInfo,
  type ExtendedTransactionInfo,
  type IAddress,
  type IArmadaPosition,
  type IArmadaPositionId,
  type IArmadaVaultId,
  type IArmadaVaultInfo,
  type IChainInfo,
  type IPercentage,
  type IToken,
  type MigrationTransactionInfo,
  type StakeTransactionInfo,
  type UnstakeTransactionInfo,
  type VaultSwitchTransactionInfo,
} from '@summerfi/sdk-common'

/**
 * @interface IArmadaManagerUsersClient
 * @description Interface of the FleetCommander Users manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerUsersClient {
  /**
   * @method getSummerToken
   * @description Retrieves the Summer token for a given chain
   *
   * @param chainInfo Chain information
   *
   * @returns The Summer token for the given chain
   */
  getSummerToken(params: { chainInfo: ChainInfo }): Promise<IToken>

  /**
   * @method getVaultsRaw
   * @description Retrieves all protocol vaults
   *
   * @param chainInfo Chain information
   *
   * @returns All Armada vaults
   */
  getVaultsRaw(params: { chainInfo: ChainInfo }): Promise<GetVaultsQuery>

  /**
   * @method getVaultRaw
   * @description Retrieves a specific protocol vault
   *
   * @param vaultId ID of the vault
   *
   * @returns The corresponding Armada vault
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQuery>

  /**
   * @name getGlobalRebalancesRaw
   * @description Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerRebalancesQuery
   */
  getGlobalRebalancesRaw(params: { chainInfo: ChainInfo }): Promise<GetGlobalRebalancesQuery>

  /**
   * @name getUsersActivityRaw
   * @description Get all users activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUsersActivityRaw(params: {
    chainInfo: ChainInfo
    where?: Position_Filter
  }): Promise<GetUsersActivityQuery>

  /**
   * @name getUserActivityRaw
   * @description Get all users activity per given chain
   *
   * @param vaultId ID of the pool to retrieve
   *
   * @returns GerUserActivityQuery
   */
  getUserActivityRaw(params: {
    vaultId: IArmadaVaultId
    accountAddress: string
  }): Promise<GetUserActivityQuery>

  /**
   * @method getVaultInfo
   * @description Retrieves the information of an Armada vault by its ID
   *
   * @param vaultId ID of the vault to retrieve
   *
   * @returns The information of the corresponding Armada vault
   */
  getVaultInfo(params: { vaultId: IArmadaVaultId }): Promise<IArmadaVaultInfo>

  /**
   * @name getUserPositions
   * @description Get all of user positions in the fleet
   *
   * @param user target user
   *
   * @returns IArmadaPosition[] All user positions in the fleet
   *
   */
  getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]>

  /**
   * @method getUserPosition
   * @description Retrieves the position of a user in an Armada pool
   *
   * @param user Target user
   * @param fleetAddress Address of the fleet
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getUserPosition(params: { user: IUser; fleetAddress: IAddress }): Promise<IArmadaPosition>

  /**
   * @method getPosition
   * @description Retrieves the position of a user in an Armada pool
   *
   * @param positionId ID of the position to retrieve
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition>

  /**
   * @method getNewDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet for a new position
   *
   * @param vaultId ID of the pool to deposit in
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   * @param slippage Maximum slippage allowed
   * @param shouldStake Whether the user wants to stake the deposited tokens
   *
   * @returns The transactions needed to deposit the tokens
   */
  getNewDepositTX(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): Promise<ExtendedTransactionInfo[]>

  /**
   * @method getWithdrawTX
   * @description Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param vaultId ID of the pool to withdraw from
   * @param user user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   * @param toToken Token to withdraw to
   * @param slippage Slippage tolerance
   *
   * @returns The transactions needed to withdraw the tokens
   */
  getWithdrawTX(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<ExtendedTransactionInfo[]>

  /**
   * @method getStakedBalance
   * @description Returns the staked balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The staked balance of the user in the Fleet
   */
  getStakedBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @method getFleetBalance
   * @description Returns the balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The balance of the user in the Fleet
   */
  getFleetBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @method getTotalBalance
   * @description Returns the total balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The total balance of the user in the Fleet
   */
  getTotalBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @method getAggregatedRewards
   * @description Returns the total aggregated rewards of a user in a Fleet
   *
   * @param user Address of the user to check the rewards for
   *
   * @returns The aggregated rewards of the user in the Fleet
   */
  getAggregatedRewards(params: { user: IUser }): Promise<{
    total: bigint
    perChain: Record<number, bigint>
  }>

  /**
   * @method getClaimableAggregatedRewards
   * @description Returns the claimable aggregated rewards of a user in a Fleet
   *
   * @param user Address of the user to check the rewards for
   *
   * @returns The claimable aggregated rewards of the user in the Fleet
   */
  getClaimableAggregatedRewards(params: { user: IUser }): Promise<{
    total: bigint
    perChain: Record<number, bigint>
  }>

  /**
   * @method getBridgeTx
   * @description Returns the bridge transaction needed to bridge tokens between chains
   *
   * @param user The user
   * @param recipient The recipient address
   * @param sourceChain The source chain
   * @param targetChain The target chain
   * @param amount The amount to bridge
   *
   * @returns The bridge transaction needed to bridge the tokens
   */
  getBridgeTx(params: {
    user: IUser
    recipient: IAddress
    sourceChain: IChainInfo
    targetChain: IChainInfo
    amount: ITokenAmount
  }): Promise<BridgeTransactionInfo[]>

  /**
   * @method getAggregatedClaimsForChainTX
   * @description Returns the multicall transaction needed to claim rewards from the Fleet
   * @param chainInfo Chain information
   * @param user Address of the user to claim rewards for
   *
   * @returns The transaction needed to claim the rewards
   */
  getAggregatedClaimsForChainTX(params: {
    chainInfo: ChainInfo
    user: IUser
  }): Promise<[ClaimTransactionInfo] | undefined>

  /**
   * @method getUserDelegatee
   * @description Returns delegatee that the account has chosen
   *
   * @param user The user
   *
   * @returns The delegatee address
   */
  getUserDelegatee(params: { user: IUser }): Promise<IAddress>

  /**
   * @method getDelegateTx
   * @description Delegates votes from the sender to delegatee
   *
   * @param user The user
   *
   * @returns The transaction information
   */
  getDelegateTx(params: { user: IUser }): Promise<[DelegateTransactionInfo]>

  /**
   * @method getUndelegateTx
   * @description Undelegates votes from the sender
   *
   * @returns The transaction information
   */
  getUndelegateTx(): Promise<[DelegateTransactionInfo]>

  /**
   * @method getUserVotes
   * @description Returns the number of votes the user has
   *
   * @param user The user
   *
   * @returns The number of votes
   */
  getUserVotes(params: { user: IUser }): Promise<bigint>

  /**
   * @method getUserBalance
   * @description Returns the balance of the user
   *
   * @param user The user
   *
   * @returns The balance
   */
  getUserBalance(params: { user: IUser }): Promise<bigint>

  /**
   * @method getUserStakedBalance
   * @description Returns the staked balance of the user
   *
   * @param user The user
   *
   * @returns The staked balance
   */
  getUserStakedBalance(params: { user: IUser }): Promise<bigint>

  /**
   * @method getUserEarnedRewards
   * @description Returns the rewards the user has earned
   *
   * @param user The user
   *
   * @returns The rewards earned
   */
  getUserEarnedRewards(params: { user: IUser }): Promise<bigint>

  /**
   * @method getStakeTx
   * @description Returns the transaction to stake tokens
   *
   * @param user The user
   * @param amount The amount to stake
   *
   * @returns The transaction information
   */
  getStakeTx(params: {
    user: IUser
    amount: bigint
  }): Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * @method getUnstakeTx
   * @description Returns the transaction to unstake tokens
   *
   * @param amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTx(params: { amount: bigint }): Promise<[UnstakeTransactionInfo]>

  /**
   * @method getDelegationChainLength
   * @description Returns the length of the delegation chain
   *
   * @param user The user
   *
   * @returns The length of the delegation
   */
  getDelegationChainLength: (params: { user: IUser }) => Promise<number>

  /**
   * @method getMigratablePositions
   * @description Returns the positions that can be migrated
   *
   * @param chainInfo Chain information
   * @param user The user
   * @param migrationType The type of migration
   *
   * @returns The positions that can be migrated
   * @throws Error if the migration type is not supported
   */
  getMigratablePositions(params: {
    chainInfo: IChainInfo
    user: IUser
    migrationType?: ArmadaMigrationType
  }): Promise<{
    chainInfo: IChainInfo
    positions: ArmadaMigratablePosition[]
  }>

  /**
   * @method getMigratablePositionsApy
   * @description Returns the APY for the positions that can be migrated
   *
   * @param chainInfo Chain information
   * @param positionIds The positions to get the APY for
   *
   * @returns The APY for the positions that can be migrated
   */
  getMigratablePositionsApy(params: {
    chainInfo: IChainInfo
    positionIds: AddressValue[]
  }): Promise<{
    chainInfo: IChainInfo
    apyByPositionId: Record<string, ArmadaMigratablePositionApy>
  }>

  /**
   * @method getMigrationTX
   * @description Returns the transaction for the migration
   *
   * @param user The user
   * @param vaultId The vault id
   * @param shouldStake Should stake
   * @param slippage The slippage
   * @param positions The positions to migrate
   *
   * @returns The transaction for the migration
   * @throws Error if the migration type is not supported
   */
  getMigrationTX(params: {
    user: IUser
    vaultId: IArmadaVaultId
    shouldStake?: boolean
    slippage: IPercentage
    positionIds: AddressValue[]
  }): Promise<[ApproveTransactionInfo[], MigrationTransactionInfo] | [MigrationTransactionInfo]>

  /**
   * @name getVaultSwitchTx
   * @description Returns the transactions needed to switch from one vault to another
   *
   * @param sourceVaultId ID of the source pool
   * @param destinationVaultId ID of the destination pool
   * @param user Address of the user that is trying to switch
   * @param amount Token amount to be switched
   * @param slippage Maximum slippage allowed for the operation
   *
   * @returns An array of transactions that must be executed
   */
  getVaultSwitchTx(params: {
    sourceVaultId: IArmadaVaultId
    destinationVaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): Promise<
    | [VaultSwitchTransactionInfo]
    | [ApproveTransactionInfo, VaultSwitchTransactionInfo]
    | [VaultSwitchTransactionInfo, VaultSwitchTransactionInfo]
    | [ApproveTransactionInfo, VaultSwitchTransactionInfo, VaultSwitchTransactionInfo]
  >
}
