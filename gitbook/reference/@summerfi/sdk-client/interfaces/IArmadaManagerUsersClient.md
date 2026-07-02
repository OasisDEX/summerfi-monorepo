# Interface: IArmadaManagerUsersClient

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:58](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L58)

Interface of the FleetCommander Users manager for the SDK Client. Allows to instantiate
FleetCommanders to interact with them

## Properties

### getAggregatedRewards()

```ts
getAggregatedRewards: (params) => Promise<{
  distribution: bigint;
  perChain: Record<number, bigint>;
  stakingV2: bigint;
  total: bigint;
  vaultUsage: bigint;
  vaultUsagePerChain: Record<number, bigint>;
  voteDelegation: bigint;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:379](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L379)

Returns the total aggregated rewards a user is eligible to claim cross-chain

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<\{
  `distribution`: `bigint`;
  `perChain`: `Record`\<`number`, `bigint`\>;
  `stakingV2`: `bigint`;
  `total`: `bigint`;
  `vaultUsage`: `bigint`;
  `vaultUsagePerChain`: `Record`\<`number`, `bigint`\>;
  `voteDelegation`: `bigint`;
\}\>

Promise<{
 total: bigint
 vaultUsagePerChain: Record<number, bigint>
 vaultUsage: bigint
 stakingV2: bigint
 merkleDistribution: bigint
 voteDelegation: bigint
}>

#### Throws

Error

***

### getAggregatedRewardsIncludingMerkl()

```ts
getAggregatedRewardsIncludingMerkl: (params) => Promise<{
  distribution: bigint;
  perChain: Record<number, bigint>;
  stakingV2: bigint;
  total: bigint;
  vaultUsage: bigint;
  vaultUsagePerChain: Record<number, bigint>;
  voteDelegation: bigint;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:396](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L396)

Returns the aggregated rewards of a user including Merkl rewards

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

Address of the user to check the rewards for

#### Returns

`Promise`\<\{
  `distribution`: `bigint`;
  `perChain`: `Record`\<`number`, `bigint`\>;
  `stakingV2`: `bigint`;
  `total`: `bigint`;
  `vaultUsage`: `bigint`;
  `vaultUsagePerChain`: `Record`\<`number`, `bigint`\>;
  `voteDelegation`: `bigint`;
\}\>

The aggregated rewards of the user including Merkl rewards

***

### getDelegationChainLength()

```ts
getDelegationChainLength: (params) => Promise<number>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:569](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L569)

Returns the length of the delegation chain

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<`number`\>

The length of the delegation

## Methods

### authorizeStakingRewardsCallerV2()

```ts
authorizeStakingRewardsCallerV2(params): Promise<[ClaimTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:1025](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L1025)

Generates a transaction to authorize a caller for staking rewards.
When authorizedCaller is omitted, the server defaults to the deployed
AdmiralsQuarters address on the hub chain.

#### Parameters

##### params

###### authorizedCaller?

[`IAddress`](IAddress.md)

The address to authorize (optional; defaults to deployed AdmiralsQuarters)

###### isAuthorized

`boolean`

Whether to authorize or revoke authorization

###### user

[`IUser`](IUser.md)

The user who is authorizing

#### Returns

`Promise`\<\[[`ClaimTransactionInfo`](../type-aliases/ClaimTransactionInfo.md)\]\>

Promise<[ClaimTransactionInfo]> Array containing the authorization transaction

***

### getAggregatedClaimsForChainTx()

```ts
getAggregatedClaimsForChainTx(params): Promise<
  | [ClaimTransactionInfo]
| undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:435](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L435)

Returns the multicall transaction needed to claim rewards from the Fleet

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain information

###### includeMerkl?

`boolean`

Whether to include Merkl rewards in the claim

###### includeStakingV2?

`boolean`

Whether to include Staking V2 rewards in the claim

###### user

[`IUser`](IUser.md)

Address of the user to claim rewards for

#### Returns

`Promise`\<
  \| \[[`ClaimTransactionInfo`](../type-aliases/ClaimTransactionInfo.md)\]
  \| `undefined`\>

The transaction needed to claim the rewards

***

### getAuthorizeAsMerklRewardsOperatorTx()

```ts
getAuthorizeAsMerklRewardsOperatorTx(params): Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:976](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L976)

Generates a transaction to toggle AdmiralsQuarters as a Merkl rewards operator for a user

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to perform the operation on

###### user

`` `0x${string}` ``

The user's address

#### Returns

`Promise`\<\[[`ToggleAQasMerklRewardsOperatorTransactionInfo`](../type-aliases/ToggleAQasMerklRewardsOperatorTransactionInfo.md)\]\>

Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]> Array containing the toggle transaction

***

### getBridgeTx()

```ts
getBridgeTx(params): Promise<BridgeTransactionInfo[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:417](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L417)

Returns the bridge transaction needed to bridge tokens between chains

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

The amount to bridge

###### recipient

[`IAddress`](IAddress.md)

The recipient address

###### sourceChain

[`IChainInfo`](IChainInfo.md)

The source chain

###### targetChain

[`IChainInfo`](IChainInfo.md)

The target chain

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<[`BridgeTransactionInfo`](../type-aliases/BridgeTransactionInfo.md)[]\>

The bridge transaction needed to bridge the tokens

***

### getCalculatePenaltyAmount()

```ts
getCalculatePenaltyAmount(params): Promise<bigint[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:667](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L667)

Calculates the penalty amount for early unstaking of specific amounts from multiple stakes

#### Parameters

##### params

###### amounts

`bigint`[]

Array of amounts to unstake (must match userStakes length)

###### userStakes

`object`[]

Array of user stake details

#### Returns

`Promise`\<`bigint`[]\>

Array of penalty amounts in tokens

***

### getCalculatePenaltyPercentage()

```ts
getCalculatePenaltyPercentage(params): Promise<IPercentage[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:655](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L655)

Calculates the penalty percentage for early unstaking of multiple stakes

#### Parameters

##### params

###### userStakes

`object`[]

Array of user stake details

#### Returns

`Promise`\<[`IPercentage`](IPercentage.md)[]\>

Array of penalty percentages (IPercentage objects)

***

### getClaimStakingV2UserRewardsTx()

```ts
getClaimStakingV2UserRewardsTx(params): Promise<[ClaimTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:1013](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L1013)

Generates a transaction to claim staking v2 rewards for a user

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user to claim rewards for

#### Returns

`Promise`\<\[[`ClaimTransactionInfo`](../type-aliases/ClaimTransactionInfo.md)\]\>

Promise<[ClaimTransactionInfo]> Array containing the claim transaction

***

### getCrossChainDepositTx()

```ts
getCrossChainDepositTx(params): Promise<
  | [DepositTransactionInfo]
| [ApproveTransactionInfo, DepositTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:298](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L298)

Returns the transactions needed to deposit tokens cross-chain into a Fleet using Enso routing

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

Token amount to be deposited from source chain

###### fromChainId

[`ChainId`](../type-aliases/ChainId.md)

Source chain ID where user has tokens

###### receiverAddressValue?

`` `0x${string}` ``

Optional address to receive the vault shares (defaults to senderAddressValue)

###### senderAddressValue

`` `0x${string}` ``

Address of the user that is sending tokens

###### slippage

[`IPercentage`](IPercentage.md)

Maximum slippage allowed for the operation

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the pool to deposit in on destination chain

#### Returns

`Promise`\<
  \| \[[`DepositTransactionInfo`](../type-aliases/DepositTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`DepositTransactionInfo`](../type-aliases/DepositTransactionInfo.md)\]\>

The transactions needed to deposit the tokens cross-chain

***

### getCrossChainWithdrawTx()

```ts
getCrossChainWithdrawTx(params): Promise<
  | [WithdrawTransactionInfo]
| [ApproveTransactionInfo, WithdrawTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:318](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L318)

Returns the transactions needed to withdraw tokens cross-chain from a Fleet using Enso routing

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

Token amount to be withdrawn

###### slippage

[`IPercentage`](IPercentage.md)

Maximum slippage allowed for the operation (in basis points)

###### toChainId

[`ChainId`](../type-aliases/ChainId.md)

Destination chain ID where user wants to receive tokens

###### user

[`IUser`](IUser.md)

user that is trying to withdraw

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the pool to withdraw from

#### Returns

`Promise`\<
  \| \[[`WithdrawTransactionInfo`](../type-aliases/WithdrawTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`WithdrawTransactionInfo`](../type-aliases/WithdrawTransactionInfo.md)\]\>

The transactions needed to withdraw the tokens cross-chain

***

### getDelegateTx()

```ts
getDelegateTx(params): Promise<[DelegateTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:467](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L467)

Delegates votes from the sender to delegatee

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<\[[`DelegateTransactionInfo`](../type-aliases/DelegateTransactionInfo.md)\]\>

The transaction information

***

### getDelegateTxV2()

```ts
getDelegateTxV2(params): Promise<[DelegateTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:476](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L476)

Delegates votes for the staked SUMR contract (V2)

#### Parameters

##### params

###### delegateeAddress

`` `0x${string}` ``

Address that should receive delegated votes

#### Returns

`Promise`\<\[[`DelegateTransactionInfo`](../type-aliases/DelegateTransactionInfo.md)\]\>

The transaction information

***

### getDeposits()

```ts
getDeposits(params): Promise<Readonly<{
  amount: ITokenAmount;
  amountUsd: IFiatCurrencyAmount;
  from: `0x${string}`;
  timestamp: number;
  to: `0x${string}`;
  txHash: `0x${string}`;
  vaultBalance: ITokenAmount;
  vaultBalanceUsd: IFiatCurrencyAmount;
}>[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:221](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L221)

Get deposits for a given Armada position ID with optional pagination

#### Parameters

##### params

###### first?

`number`

Optional number of items to return

###### positionId

[`IArmadaPositionId`](IArmadaPositionId.md)

Position ID

###### skip?

`number`

Optional number of items to skip for pagination

#### Returns

`Promise`\<`Readonly`\<\{
  `amount`: [`ITokenAmount`](ITokenAmount.md);
  `amountUsd`: [`IFiatCurrencyAmount`](IFiatCurrencyAmount.md);
  `from`: `` `0x${string}` ``;
  `timestamp`: `number`;
  `to`: `` `0x${string}` ``;
  `txHash`: `` `0x${string}` ``;
  `vaultBalance`: [`ITokenAmount`](ITokenAmount.md);
  `vaultBalanceUsd`: [`IFiatCurrencyAmount`](IFiatCurrencyAmount.md);
\}\>[]\>

Array of deposit transactions with amount, timestamp, and vault balance

***

### getErc20TokenTransferTx()

```ts
getErc20TokenTransferTx(params): Promise<Erc20TransferTransactionInfo[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:490](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L490)

Generates a transaction for transferring ERC20 tokens

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

Amount of tokens to transfer

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

Chain identifier where the token exists

###### recipientAddress

[`IAddress`](IAddress.md)

Address to receive the tokens

###### tokenAddress

[`IAddress`](IAddress.md)

ERC20 token contract address

#### Returns

`Promise`\<[`Erc20TransferTransactionInfo`](../type-aliases/Erc20TransferTransactionInfo.md)[]\>

Erc20TransferTransactionInfo Transaction information for the transfer

#### See

IArmadaManagerUtils.getErc20TokenTransferTx

***

### getFleetBalance()

```ts
getFleetBalance(params): Promise<{
  assets: ITokenAmount;
  shares: ITokenAmount;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:347](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L347)

Returns the balance of a user in a Fleet

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

Address of the user to check the balance for

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the vault to check the balance in

#### Returns

`Promise`\<\{
  `assets`: [`ITokenAmount`](ITokenAmount.md);
  `shares`: [`ITokenAmount`](ITokenAmount.md);
\}\>

The balance of the user in the Fleet

***

### getGlobalRebalancesRaw()

```ts
getGlobalRebalancesRaw(params): Promise<GetGlobalRebalancesQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:102](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L102)

Get all rebalances per given chain

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain information

#### Returns

`Promise`\<`GetGlobalRebalancesQuery`\>

GerRebalancesQuery

***

### getIsAuthorizedAsMerklRewardsOperator()

```ts
getIsAuthorizedAsMerklRewardsOperator(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:988](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L988)

Checks if AdmiralsQuarters is authorized as a Merkl rewards operator for a user

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to check authorization on

###### user

`` `0x${string}` ``

The user's address

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> True if AdmiralsQuarters is authorized as operator, false otherwise

***

### getMigratablePositions()

```ts
getMigratablePositions(params): Promise<{
  chainInfo: IChainInfo;
  positions: ArmadaMigratablePosition[];
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:824](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L824)

Returns the positions that can be migrated

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain information

###### migrationType?

[`ArmadaMigrationType`](../enumerations/ArmadaMigrationType.md)

The type of migration

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<\{
  `chainInfo`: [`IChainInfo`](IChainInfo.md);
  `positions`: [`ArmadaMigratablePosition`](../type-aliases/ArmadaMigratablePosition.md)[];
\}\>

The positions that can be migrated

#### Throws

Error if the migration type is not supported

***

### getMigratablePositionsApy()

```ts
getMigratablePositionsApy(params): Promise<{
  apyByPositionId: Record<string, ArmadaMigratablePositionApy>;
  chainInfo: IChainInfo;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:841](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L841)

Returns the APY for the positions that can be migrated

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain information

###### positionIds

`` `0x${string}` ``[]

The positions to get the APY for

#### Returns

`Promise`\<\{
  `apyByPositionId`: `Record`\<`string`, [`ArmadaMigratablePositionApy`](../type-aliases/ArmadaMigratablePositionApy.md)\>;
  `chainInfo`: [`IChainInfo`](IChainInfo.md);
\}\>

The APY for the positions that can be migrated

***

### getMigrationTx()

```ts
getMigrationTx(params): Promise<
  | [ApproveTransactionInfo[], MigrationTransactionInfo]
| [MigrationTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:861](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L861)

Returns the transaction for the migration

#### Parameters

##### params

###### positionIds

`` `0x${string}` ``[]

The position IDs to migrate

###### shouldStake?

`boolean`

Should stake

###### slippage

[`IPercentage`](IPercentage.md)

The slippage

###### user

[`IUser`](IUser.md)

The user

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The vault id

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md)[], [`MigrationTransactionInfo`](../type-aliases/MigrationTransactionInfo.md)\]
  \| \[[`MigrationTransactionInfo`](../type-aliases/MigrationTransactionInfo.md)\]\>

The transaction for the migration

#### Throws

Error if the migration type is not supported

***

### getNewDepositTx()

```ts
getNewDepositTx(params): Promise<
  | [DepositTransactionInfo]
| [ApproveTransactionInfo, DepositTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:254](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L254)

Returns the transactions needed to deposit tokens in the Fleet for a new position

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

Token amount to be deposited

###### referralCode?

`string`

Referral code to be used

###### shouldStake?

`boolean`

Whether the user wants to stake the deposited tokens

###### slippage

[`IPercentage`](IPercentage.md)

Maximum slippage allowed

###### user

[`IUser`](IUser.md)

Address of the user that is trying to deposit

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the pool to deposit in

#### Returns

`Promise`\<
  \| \[[`DepositTransactionInfo`](../type-aliases/DepositTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`DepositTransactionInfo`](../type-aliases/DepositTransactionInfo.md)\]\>

The transactions needed to deposit the tokens

***

### getPosition()

```ts
getPosition(params): Promise<IArmadaPosition | undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:202](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L202)

Retrieves the position of a user in an Armada pool

#### Parameters

##### params

###### positionId

[`IArmadaPositionId`](IArmadaPositionId.md)

ID of the position to retrieve

#### Returns

`Promise`\<[`IArmadaPosition`](IArmadaPosition.md) \| `undefined`\>

The position of the user in the corresponding Armada pool

***

### getPositionHistory()

```ts
getPositionHistory(params): Promise<GetPositionHistoryQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:210](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L210)

Retrieves historical snapshots of a position

#### Parameters

##### params

###### positionId

[`IArmadaPositionId`](IArmadaPositionId.md)

The ID of the position to retrieve history for

#### Returns

`Promise`\<`GetPositionHistoryQuery`\>

GetPositionHistoryQuery with hourly, daily, and weekly snapshots

***

### getProtocolAddresses()

```ts
getProtocolAddresses(params): Promise<Record<"admiralsQuarters", `0x${string}`>>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:1051](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L1051)

Returns the deployed contract addresses for the Armada protocol on a given chain

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to retrieve addresses for

#### Returns

`Promise`\<`Record`\<`"admiralsQuarters"`, `` `0x${string}` ``\>\>

Promise with a record containing the admiralsQuarters contract address

***

### getProtocolRevenue()

```ts
getProtocolRevenue(): Promise<number>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:153](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L153)

Calculates the total protocol revenue amount in USD across all vaults and chains

#### Returns

`Promise`\<`number`\>

The revenue amount in USD as a number

***

### getProtocolTvl()

```ts
getProtocolTvl(): Promise<number>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:160](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L160)

Calculates the total protocol TVL in USD across all vaults and chains

#### Returns

`Promise`\<`number`\>

The TVL amount in USD as a number

***

### getReferralFeesMerklClaimTx()

```ts
getReferralFeesMerklClaimTx(params): Promise<
  | [MerklClaimTransactionInfo]
| undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:949](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L949)

Generates a transaction to claim Merkl rewards for a referral on a specific chain

#### Parameters

##### params

###### address

`` `0x${string}` ``

The user's address

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to claim rewards on

###### rewardsTokensAddresses?

`` `0x${string}` ``[]

Optional array of token addresses to claim (default: all tokens)

#### Returns

`Promise`\<
  \| \[[`MerklClaimTransactionInfo`](../type-aliases/MerklClaimTransactionInfo.md)\]
  \| `undefined`\>

Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim

***

### getStakedBalance()

```ts
getStakedBalance(params): Promise<{
  assets: ITokenAmount;
  shares: ITokenAmount;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:334](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L334)

Returns the staked balance of a user in a Fleet

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

Address of the user to check the balance for

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the vault to check the balance in

#### Returns

`Promise`\<\{
  `assets`: [`ITokenAmount`](ITokenAmount.md);
  `shares`: [`ITokenAmount`](ITokenAmount.md);
\}\>

The staked balance of the user in the Fleet

***

### getStakeOnBehalfTxV2()

```ts
getStakeOnBehalfTxV2(params): Promise<
  | [ApproveTransactionInfo, StakeTransactionInfo]
| [StakeTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:596](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L596)

Returns the transaction to stake tokens on behalf with lockup (V2)

#### Parameters

##### params

###### amount

`bigint`

The amount to stake

###### lockupPeriod

`bigint`

The lockup period in seconds (14 days to 3 years)

###### receiver

[`IAddress`](IAddress.md)

The address receiving the staked tokens

###### user

[`IUser`](IUser.md)

The user initiating the stake

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`StakeTransactionInfo`](../type-aliases/StakeTransactionInfo.md)\]
  \| \[[`StakeTransactionInfo`](../type-aliases/StakeTransactionInfo.md)\]\>

The transaction information

***

### getStakeTx()

```ts
getStakeTx(params): Promise<
  | [ApproveTransactionInfo, StakeTransactionInfo]
| [StakeTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:548](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L548)

Returns the transaction to stake tokens

#### Parameters

##### params

###### amount

`bigint`

The amount to stake

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`StakeTransactionInfo`](../type-aliases/StakeTransactionInfo.md)\]
  \| \[[`StakeTransactionInfo`](../type-aliases/StakeTransactionInfo.md)\]\>

The transaction information

***

### getStakeTxV2()

```ts
getStakeTxV2(params): Promise<
  | [ApproveTransactionInfo, StakeTransactionInfo]
| [StakeTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:580](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L580)

Returns the transaction to stake tokens with lockup (V2)

#### Parameters

##### params

###### amount

`bigint`

The amount to stake

###### lockupPeriod

`bigint`

The lockup period in seconds (14 days to 3 years)

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`StakeTransactionInfo`](../type-aliases/StakeTransactionInfo.md)\]
  \| \[[`StakeTransactionInfo`](../type-aliases/StakeTransactionInfo.md)\]\>

The transaction information

***

### getStakingBucketsInfoV2()

```ts
getStakingBucketsInfoV2(): Promise<StakingBucketInfo[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:735](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L735)

Returns information about all staking buckets (V2)

#### Returns

`Promise`\<`StakingBucketInfo`[]\>

Array of bucket information

***

### getStakingCalculateWeightedStakeV2()

```ts
getStakingCalculateWeightedStakeV2(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:744](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L744)

Calculates the weighted stake for a given amount and lockup period

#### Parameters

##### params

###### amount

`bigint`

The amount to stake

###### lockupPeriod

`bigint`

The lockup period in seconds

#### Returns

`Promise`\<`bigint`\>

The weighted stake amount as bigint

***

### getStakingConfigV2()

```ts
getStakingConfigV2(): Promise<{
  stakingContractAddress: `0x${string}`;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:805](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L805)

Returns the staking configuration including the staking contract address

#### Returns

`Promise`\<\{
  `stakingContractAddress`: `` `0x${string}` ``;
\}\>

Object containing staking configuration

***

### getStakingEarningsEstimationV2()

```ts
getStakingEarningsEstimationV2(params): Promise<StakingEarningsEstimationForStakes>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:795](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L795)

Calculates the earnings estimation for multiple stake positions

#### Parameters

##### params

###### stakes

`object`[]

Array of stake positions with amount, period, and weightedAmount

###### sumrPriceUsd?

`number`

Optional SUMR token price in USD (defaults to current price from utils)

#### Returns

`Promise`\<`StakingEarningsEstimationForStakes`\>

Earnings estimation including SUMR rewards and USD earnings for each stake

***

### getStakingRevenueShareV2()

```ts
getStakingRevenueShareV2(): Promise<{
  amount: number;
  percentage: IPercentage;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:768](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L768)

Returns the revenue share percentage for stakers and the calculated amount

#### Returns

`Promise`\<\{
  `amount`: `number`;
  `percentage`: [`IPercentage`](IPercentage.md);
\}\>

Object containing the revenue share percentage and calculated amount in USD

***

### getStakingRewardRatesV2()

```ts
getStakingRewardRatesV2(params): Promise<StakingRewardRates>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:725](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L725)

Returns the staking reward rates including user-specific boost (V2)

#### Parameters

##### params

###### rewardTokenAddress?

[`IAddress`](IAddress.md)

Optional reward token address (defaults to SUMR token)

###### sumrPriceUsd?

`number`

Optional SUMR price in USD (defaults to current price from utils)

#### Returns

`Promise`\<`StakingRewardRates`\>

Reward rates including APR, APY, and user's boosted multiplier

***

### getStakingSimulationDataV2()

```ts
getStakingSimulationDataV2(params): Promise<StakingSimulationData>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:780](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L780)

Calculates staking simulation data including yield APYs and boosts

#### Parameters

##### params

###### amount

`bigint`

The amount to stake

###### period

`bigint`

The lockup period in seconds

###### sumrPriceUsd?

`number`

Optional SUMR token price in USD (defaults to current price from utils)

###### userAddress

`` `0x${string}` ``

The user's wallet address

#### Returns

`Promise`\<`StakingSimulationData`\>

Simulation data including APYs and yield boosts

***

### getStakingStakesV2()

```ts
getStakingStakesV2(params?): Promise<StakingStake[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:646](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L646)

Retrieves all staking stakes across all users with pagination support (V2)

#### Parameters

##### params?

###### first?

`number`

number of items to return (optional, defaults to 1000)

###### skip?

`number`

number of items to skip for pagination (optional, defaults to 0)

#### Returns

`Promise`\<[`StakingStake`](StakingStake.md)[]\>

Array of StakingStake objects representing the staking stakes, sorted by lockupPeriod in descending order

***

### getStakingStatsV2()

```ts
getStakingStatsV2(): Promise<StakingStats>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:812](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L812)

Returns staking statistics from the protocol subgraph

#### Returns

`Promise`\<`StakingStats`\>

Object containing staking statistics including total staked, average lockup period, and number of locked stakes

***

### getStakingTotalSumrStakedV2()

```ts
getStakingTotalSumrStakedV2(): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:761](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L761)

Returns the total amount of SUMR tokens staked across all buckets

#### Returns

`Promise`\<`bigint`\>

The total staked amount as bigint

***

### getStakingTotalWeightedSupplyV2()

```ts
getStakingTotalWeightedSupplyV2(): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:754](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L754)

Returns the total weighted supply of staked tokens

#### Returns

`Promise`\<`bigint`\>

The total weighted supply as bigint

***

### getSummerPrice()

```ts
getSummerPrice(params?): Promise<{
  price: number;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:75](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L75)

Retrieves the current price of the Summer token

#### Parameters

##### params?

Optional parameters

###### override?

`number`

Optional price override value

#### Returns

`Promise`\<\{
  `price`: `number`;
\}\>

The current price of the Summer token

***

### getSummerToken()

```ts
getSummerToken(params): Promise<ITokenStanalone>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:66](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L66)

Retrieves the Summer token for a given chain

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain information

#### Returns

`Promise`\<[`ITokenStanalone`](ITokenStanalone.md)\>

The Summer token for the given chain

***

### getTotalBalance()

```ts
getTotalBalance(params): Promise<{
  assets: ITokenAmount;
  shares: ITokenAmount;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:360](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L360)

Returns the total balance of a user in a Fleet

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

Address of the user to check the balance for

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the vault to check the balance in

#### Returns

`Promise`\<\{
  `assets`: [`ITokenAmount`](ITokenAmount.md);
  `shares`: [`ITokenAmount`](ITokenAmount.md);
\}\>

The total balance of the user in the Fleet

***

### getUndelegateTx()

```ts
getUndelegateTx(): Promise<[DelegateTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:502](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L502)

Undelegates votes from the sender

#### Returns

`Promise`\<\[[`DelegateTransactionInfo`](../type-aliases/DelegateTransactionInfo.md)\]\>

The transaction information

***

### getUnstakeFleetTokensTx()

```ts
getUnstakeFleetTokensTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:1001](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L1001)

Generates a transaction to unstake fleet tokens from the rewards manager

#### Parameters

##### params

###### addressValue

`` `0x${string}` ``

The user's address

###### amountValue?

`string`

Optional amount to unstake (if not provided, unstakes full balance)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The vault ID to unstake from (chain info is derived from vaultId.chainInfo)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction to unstake fleet tokens

***

### getUnstakeTx()

```ts
getUnstakeTx(params): Promise<[UnstakeTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:560](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L560)

Returns the transaction to unstake tokens

#### Parameters

##### params

###### amount

`bigint`

The amount to unstake

#### Returns

`Promise`\<\[[`UnstakeTransactionInfo`](../type-aliases/UnstakeTransactionInfo.md)\]\>

The transaction information

***

### getUnstakeTxV2()

```ts
getUnstakeTxV2(params): Promise<
  | [UnstakeTransactionInfo]
| [ApproveTransactionInfo, UnstakeTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:612](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L612)

Returns the transaction to unstake tokens from a specific stake in the user's portfolio (V2)

#### Parameters

##### params

###### amount

`bigint`

The amount to unstake

###### user

[`IUser`](IUser.md)

The user

###### userStakeIndex

`bigint`

The index of the stake in the user's stake array (portfolio) to unstake from

#### Returns

`Promise`\<
  \| \[[`UnstakeTransactionInfo`](../type-aliases/UnstakeTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`UnstakeTransactionInfo`](../type-aliases/UnstakeTransactionInfo.md)\]\>

The transaction information

***

### getUserActivityRaw()

```ts
getUserActivityRaw(params): Promise<GetUserActivityQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:123](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L123)

Get all users activity per given chain

#### Parameters

##### params

###### accountAddress

`string`

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the pool to retrieve

#### Returns

`Promise`\<`GetUserActivityQuery`\>

GerUserActivityQuery

***

### getUserBalance()

```ts
getUserBalance(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:520](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L520)

Returns the balance of the user

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<`bigint`\>

The balance

***

### getUserBlendedYieldBoost()

```ts
getUserBlendedYieldBoost(params): Promise<number>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:697](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L697)

Returns the user's current blended yield boost based on their weighted balance and staked balance

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user to get the blended yield boost for

#### Returns

`Promise`\<`number`\>

The user's blended yield boost (userWeightedBalance / userSumrStakedBalance)

***

### getUserDelegatee()

```ts
getUserDelegatee(params): Promise<IAddress>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:449](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L449)

Returns delegatee that the account has chosen

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<[`IAddress`](IAddress.md)\>

The delegatee address

***

### getUserDelegateeV2()

```ts
getUserDelegateeV2(params): Promise<IAddress>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:458](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L458)

Returns delegatee configured on the staked SUMR contract (V2)

#### Parameters

##### params

###### userAddress

`` `0x${string}` ``

Address whose delegatee should be fetched

#### Returns

`Promise`\<[`IAddress`](IAddress.md)\>

The delegatee address saved in the staking contract

***

### getUserEarnedRewards()

```ts
getUserEarnedRewards(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:538](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L538)

Returns the rewards the user has earned

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<`bigint`\>

The rewards earned

***

### getUserMerklClaimTx()

```ts
getUserMerklClaimTx(params): Promise<
  | [MerklClaimTransactionInfo]
| undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:936](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L936)

Generates a transaction to claim Merkl rewards for a user on a specific chain

#### Parameters

##### params

###### address

`` `0x${string}` ``

The user's address

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to claim rewards on

#### Returns

`Promise`\<
  \| \[[`MerklClaimTransactionInfo`](../type-aliases/MerklClaimTransactionInfo.md)\]
  \| `undefined`\>

Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim

***

### getUserMerklRewards()

```ts
getUserMerklRewards(params): Promise<{
  perChain: Partial<Record<ChainId, MerklReward[]>>;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:922](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L922)

Gets Merkl rewards for a user across specified chains

#### Parameters

##### params

###### address

`` `0x${string}` ``

The user's address

###### chainIds?

[`ChainId`](../type-aliases/ChainId.md)[]

Optional chain IDs to filter by (default: supported chains)

###### merklChainId?

[`ChainId`](../type-aliases/ChainId.md)

Optional specific Merkl chain ID to get rewards from (if not provided reads from Base chain)

###### rewardsTokensAddresses?

`` `0x${string}` ``[]

Optional array of token addresses to filter rewards (default: all tokens)

#### Returns

`Promise`\<\{
  `perChain`: `Partial`\<`Record`\<[`ChainId`](../type-aliases/ChainId.md), [`MerklReward`](MerklReward.md)[]\>\>;
\}\>

Promise<MerklReward[]> Array of Merkl rewards

***

### getUserPosition()

```ts
getUserPosition(params): Promise<IArmadaPosition | undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:190](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L190)

Retrieves the position of a user in an Armada pool

#### Parameters

##### params

###### fleetAddress

[`IAddress`](IAddress.md)

Address of the fleet

###### user

[`IUser`](IUser.md)

Target user

#### Returns

`Promise`\<[`IArmadaPosition`](IArmadaPosition.md) \| `undefined`\>

The position of the user in the corresponding Armada pool

***

### getUserPositions()

```ts
getUserPositions(params): Promise<IArmadaPosition[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:180](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L180)

Get all of user positions in the fleet

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

target user

#### Returns

`Promise`\<[`IArmadaPosition`](IArmadaPosition.md)[]\>

IArmadaPosition[] All user positions in the fleet

***

### getUsersActivityRaw()

```ts
getUsersActivityRaw(params): Promise<GetUsersActivityQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:111](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L111)

Get all users activity per given chain

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain information

###### where?

`Position_Filter`

#### Returns

`Promise`\<`GetUsersActivityQuery`\>

GerUsersActivityQuery

***

### getUserStakedBalance()

```ts
getUserStakedBalance(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:529](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L529)

Returns the staked balance of the user

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<`bigint`\>

The staked balance

***

### getUserStakesCount()

```ts
getUserStakesCount(params): Promise<{
  userStakesCountAfter: bigint;
  userStakesCountBefore: bigint;
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:625](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L625)

Returns the number of stakes a user has before and after considering a specific bucket

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<\{
  `userStakesCountAfter`: `bigint`;
  `userStakesCountBefore`: `bigint`;
\}\>

Object containing userStakesCountBefore and userStakesCountAfter

***

### getUserStakesV2()

```ts
getUserStakesV2(params): Promise<UserStakeV2[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:636](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L636)

Returns all staking positions for a user with detailed information

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user to get staking positions for

#### Returns

`Promise`\<[`UserStakeV2`](UserStakeV2.md)[]\>

Array of user stake positions

***

### getUserStakingBalanceV2()

```ts
getUserStakingBalanceV2(params): Promise<StakingBalanceByBucket[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:679](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L679)

Returns the user's staking balance for each bucket (V2)

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<`StakingBalanceByBucket`[]\>

Array of balances by bucket

***

### getUserStakingEarnedV2()

```ts
getUserStakingEarnedV2(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:707](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L707)

Returns the user's earned rewards (V2)

#### Parameters

##### params

###### rewardTokenAddress?

[`IAddress`](IAddress.md)

The reward token address

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<`bigint`\>

The earned rewards

***

### getUserStakingSumrStaked()

```ts
getUserStakingSumrStaked(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:715](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L715)

Returns the total amount of SUMR tokens staked by the user across all buckets

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user to get staking balance for

#### Returns

`Promise`\<`bigint`\>

The total SUMR amount staked

***

### getUserStakingWeightedBalanceV2()

```ts
getUserStakingWeightedBalanceV2(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:688](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L688)

Returns the user's weighted staking balance for all buckets (V2)

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<`bigint`\>

The weighted balance

***

### getUserVotes()

```ts
getUserVotes(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:511](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L511)

Returns the number of votes the user has

#### Parameters

##### params

###### user

[`IUser`](IUser.md)

The user

#### Returns

`Promise`\<`bigint`\>

The number of votes

***

### getVaultInfo()

```ts
getVaultInfo(params): Promise<IArmadaVaultInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:135](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L135)

Retrieves the information of an Armada vault by its ID

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the vault to retrieve

#### Returns

`Promise`\<[`IArmadaVaultInfo`](IArmadaVaultInfo.md)\>

The information of the corresponding Armada vault

***

### getVaultInfoList()

```ts
getVaultInfoList(params): Promise<{
  list: IArmadaVaultInfo[];
}>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:144](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L144)

Retrieves the information of all Armada vaults for a given chain

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to list vaults for

#### Returns

`Promise`\<\{
  `list`: [`IArmadaVaultInfo`](IArmadaVaultInfo.md)[];
\}\>

The information of all Armada vaults for the given chain

***

### getVaultRaw()

```ts
getVaultRaw(params): Promise<GetVaultQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:93](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L93)

Retrieves a specific protocol vault

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the vault

#### Returns

`Promise`\<`GetVaultQuery`\>

The corresponding Armada vault

***

### getVaultRewardsMerklClaimTx()

```ts
getVaultRewardsMerklClaimTx(params): Promise<
  | [MerklClaimTransactionInfo]
| undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:963](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L963)

Generates a transaction to claim Merkl rewards for a vault on a specific chain

#### Parameters

##### params

###### address

`` `0x${string}` ``

The vault's address

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to claim rewards on

###### rewardsTokensAddresses?

`` `0x${string}` ``[]

Optional array of token addresses to claim (default: all tokens)

#### Returns

`Promise`\<
  \| \[[`MerklClaimTransactionInfo`](../type-aliases/MerklClaimTransactionInfo.md)\]
  \| `undefined`\>

Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim

***

### getVaultsHistoricalRates()

```ts
getVaultsHistoricalRates(params): Promise<HistoricalFleetRateResult[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:168](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L168)

Retrieves historical rates for a list of fleets across chains

#### Parameters

##### params

###### fleets

`object`[]

Array of fleet descriptors with fleetAddress and chainId

#### Returns

`Promise`\<[`HistoricalFleetRateResult`](HistoricalFleetRateResult.md)[]\>

Array of HistoricalFleetRateResult per fleet

***

### getVaultsRaw()

```ts
getVaultsRaw(params): Promise<GetVaultsQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:84](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L84)

Retrieves all protocol vaults

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain information

#### Returns

`Promise`\<`GetVaultsQuery`\>

All Armada vaults

***

### getVaultSwitchEnsoTx()

```ts
getVaultSwitchEnsoTx(params): Promise<
  | [VaultSwitchTransactionInfo]
| [ApproveTransactionInfo, VaultSwitchTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:905](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L905)

Returns the transactions needed to switch from one vault to another using Enso routing.
Source and destination vaults must be on the same chain.

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

Token amount (in source vault's underlying asset) to be switched

###### destinationVaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the destination pool (must be same chain as source)

###### slippage

[`IPercentage`](IPercentage.md)

Maximum slippage allowed for the operation

###### sourceVaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the source pool

###### user

[`IUser`](IUser.md)

Address of the user that is trying to switch

#### Returns

`Promise`\<
  \| \[[`VaultSwitchTransactionInfo`](../type-aliases/VaultSwitchTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`VaultSwitchTransactionInfo`](../type-aliases/VaultSwitchTransactionInfo.md)\]\>

An array of transactions that must be executed

***

### getVaultSwitchTx()

```ts
getVaultSwitchTx(params): Promise<
  | [VaultSwitchTransactionInfo]
  | [ApproveTransactionInfo, VaultSwitchTransactionInfo]
| [ApproveTransactionInfo, ApproveTransactionInfo, VaultSwitchTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:880](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L880)

Returns the transactions needed to switch from one vault to another

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

Token amount to be switched

###### destinationVaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the destination pool

###### shouldStake?

`boolean`

###### slippage

[`IPercentage`](IPercentage.md)

Maximum slippage allowed for the operation

###### sourceVaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the source pool

###### user

[`IUser`](IUser.md)

Address of the user that is trying to switch

#### Returns

`Promise`\<
  \| \[[`VaultSwitchTransactionInfo`](../type-aliases/VaultSwitchTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`VaultSwitchTransactionInfo`](../type-aliases/VaultSwitchTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`VaultSwitchTransactionInfo`](../type-aliases/VaultSwitchTransactionInfo.md)\]\>

An array of transactions that must be executed

***

### getWithdrawals()

```ts
getWithdrawals(params): Promise<Readonly<{
  amount: ITokenAmount;
  amountUsd: IFiatCurrencyAmount;
  from: `0x${string}`;
  timestamp: number;
  to: `0x${string}`;
  txHash: `0x${string}`;
  vaultBalance: ITokenAmount;
  vaultBalanceUsd: IFiatCurrencyAmount;
}>[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:236](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L236)

Get withdrawals for a given Armada position ID with optional pagination

#### Parameters

##### params

###### first?

`number`

Optional number of items to return

###### positionId

[`IArmadaPositionId`](IArmadaPositionId.md)

Position ID

###### skip?

`number`

Optional number of items to skip for pagination

#### Returns

`Promise`\<`Readonly`\<\{
  `amount`: [`ITokenAmount`](ITokenAmount.md);
  `amountUsd`: [`IFiatCurrencyAmount`](IFiatCurrencyAmount.md);
  `from`: `` `0x${string}` ``;
  `timestamp`: `number`;
  `to`: `` `0x${string}` ``;
  `txHash`: `` `0x${string}` ``;
  `vaultBalance`: [`ITokenAmount`](ITokenAmount.md);
  `vaultBalanceUsd`: [`IFiatCurrencyAmount`](IFiatCurrencyAmount.md);
\}\>[]\>

Array of withdrawal transactions with amount, timestamp, and vault balance

***

### getWithdrawTx()

```ts
getWithdrawTx(params): Promise<
  | [WithdrawTransactionInfo]
  | [ApproveTransactionInfo, WithdrawTransactionInfo]
| [ApproveTransactionInfo, ApproveTransactionInfo, WithdrawTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:274](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L274)

Returns the transactions needed to withdraw tokens from the Fleet

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

Token amount to be withdrawn

###### slippage

[`IPercentage`](IPercentage.md)

Slippage tolerance

###### toToken

[`ITokenStanalone`](ITokenStanalone.md)

Token to withdraw to

###### user

[`IUser`](IUser.md)

user that is trying to withdraw

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the pool to withdraw from

#### Returns

`Promise`\<
  \| \[[`WithdrawTransactionInfo`](../type-aliases/WithdrawTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`WithdrawTransactionInfo`](../type-aliases/WithdrawTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`WithdrawTransactionInfo`](../type-aliases/WithdrawTransactionInfo.md)\]\>

The transactions needed to withdraw the tokens

***

### isAuthorizedStakingRewardsCallerV2()

```ts
isAuthorizedStakingRewardsCallerV2(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts:1040](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerUsersClient.ts#L1040)

Checks if a caller is authorized for staking rewards.
When authorizedCaller is omitted, the server defaults to the deployed
AdmiralsQuarters address on the hub chain.

#### Parameters

##### params

###### authorizedCaller?

[`IAddress`](IAddress.md)

The address to check authorization for (optional; defaults to deployed AdmiralsQuarters)

###### owner

[`IAddress`](IAddress.md)

The owner address

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> True if the caller is authorized, false otherwise
