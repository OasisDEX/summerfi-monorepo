# Interface: IRwaManagerClient

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L24)

Client interface for the RWA (Real-World Asset) namespace.

Mirrors the relevant subset of the Armada vaults surface but is sourced from the RWA subgraph and
returns RWA-specific domain types. This is the canonical, published contract for the `sdk.rwa.*`
methods.

## Methods

### getCancelRoundDepositTx()

```ts
getCancelRoundDepositTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:154](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L154)

Builds the `RoundsVaultBase.redeem` transaction to return an open current-round receipt before it
enters settlement (cancels a pending deposit or withdraw).

#### Parameters

##### params

###### amount

`string`

Human-readable amount of the round receipt to redeem (converted to base
  units using the resolved vault's underlying-token decimals). Generic name because `vaultType`
  selects whether it is a USDC (Input) or share (Output) deposit.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### receiverAddress?

`` `0x${string}` ``

Optional alternative receiver of the returned asset.

###### roundId

`bigint`

The current open round id (must equal `getCurrentRound`).

###### userAddress

`` `0x${string}` ``

The user cancelling their position (owner of the receipt).

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

`RoundsVaultType.Input` (cancels a USDC deposit) or
  `RoundsVaultType.Output` (cancels a share deposit).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getClaimAssetsTx()

```ts
getClaimAssetsTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:130](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L130)

Builds the `RoundsVaultOutput.redeemExchangeAsset` transaction to exchange a settled-round receipt
for the underlying asset (e.g. USDC).

#### Parameters

##### params

###### amount

`string`

Human-readable amount of round receipt to redeem (e.g. `"1"`). Converted to
  base units using the Output vault's underlying-token decimals.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### receiverAddress?

`` `0x${string}` ``

Optional alternative receiver of the underlying asset.

###### roundId

`bigint`

The settled round whose receipt is being exchanged.

###### userAddress

`` `0x${string}` ``

The user holding the receipt (owner).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getClaimSharesTx()

```ts
getClaimSharesTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:88](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L88)

Builds the `RoundsVaultInput.redeemExchangeAsset` transaction to exchange a settled-round receipt
for Fleet shares.

#### Parameters

##### params

###### amount

`string`

Human-readable amount of round receipt to redeem (e.g. `"1"`). Converted to
  base units using the Input vault's underlying-token decimals.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### receiverAddress?

`` `0x${string}` ``

Optional alternative receiver of the Fleet shares.

###### roundId

`bigint`

The settled round whose receipt is being exchanged.

###### userAddress

`` `0x${string}` ``

The user holding the receipt (owner).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getCurrentRound()

```ts
getCurrentRound(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:175](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L175)

Returns the current (open) round number for the given RoundsVault.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to query the Input or Output RoundsVault.

#### Returns

`Promise`\<`bigint`\>

***

### getDepositTx()

```ts
getDepositTx(params): Promise<TransactionInfo[]>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:69](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L69)

Builds the approve + `RoundsVaultInput.deposit` transaction pair for a whitelisted user. Mints an
ERC-1155 receipt for the current open round.

#### Parameters

##### params

###### assetsAmount

`string`

Human-readable amount of the underlying asset (e.g. `"1"` = 1 USDC)
  to deposit. Converted to base units using the vault's underlying-token decimals.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### userAddress

`` `0x${string}` ``

The depositing user (owner + receiver of the round receipt).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)[]\>

***

### getEmergencyRollbackRoundTx()

```ts
getEmergencyRollbackRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:352](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L352)

Builds the `RoundsVault.emergencyRollbackRound` transaction: rolls a stuck in-settlement round back
to Opened (Governor-gated recovery path).

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### roundId

`bigint`

The round number to roll back.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to target the Input or Output RoundsVault.

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getExchangeRate()

```ts
getExchangeRate(params): Promise<IPrice>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:205](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L205)

Returns the snapshotted exchange rate for a settled round (output-asset amount per unit of receipt
token).

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### roundId

`bigint`

A settled round number.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to query the Input or Output RoundsVault.

#### Returns

`Promise`\<[`IPrice`](IPrice.md)\>

***

### getGrantRoleTx()

```ts
getGrantRoleTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:399](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L399)

Builds the transaction to grant a role to an account on the institution's
ProtocolAccessManager(V2), via the matching typed on-chain wrapper.

#### Parameters

##### params

###### account

`` `0x${string}` ``

The account to grant the role to.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the institution is deployed on.

###### role

[`RwaRole`](../type-aliases/RwaRole.md)

The role descriptor (carries a `target` contract for contract-specific roles).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getNextRoundTx()

```ts
getNextRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:290](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L290)

Builds the `RoundsVault.nextRound` transaction: closes the current open round (moving it to
InSettlement) and opens a new round.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to target the Input or Output RoundsVault.

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getReceiptBalances()

```ts
getReceiptBalances(params): Promise<object[]>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:221](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L221)

Returns all ERC-1155 receipt token balances held by an account across every round id (sourced from
the RWA subgraph).

#### Parameters

##### params

###### accountAddress

`` `0x${string}` ``

The account to query.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to query the Input or Output RoundsVault.

#### Returns

`Promise`\<`object`[]\>

***

### getRetryRoundTx()

```ts
getRetryRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:336](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L336)

Builds the `RoundsVault.retryRound` transaction: re-queues a rolled-back round for settlement.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### roundId

`bigint`

The round number to retry.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to target the Input or Output RoundsVault.

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getRevokeRoleTx()

```ts
getRevokeRoleTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:413](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L413)

Builds the transaction to revoke a role from an account on the institution's
ProtocolAccessManager(V2), via the matching typed on-chain wrapper.

#### Parameters

##### params

###### account

`` `0x${string}` ``

The account to revoke the role from.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the institution is deployed on.

###### role

[`RwaRole`](../type-aliases/RwaRole.md)

The role descriptor (carries a `target` contract for contract-specific roles).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getRoundState()

```ts
getRoundState(params): Promise<RoundState>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:189](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L189)

Returns the on-chain state of a specific round.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### roundId

`bigint`

The round number to query.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to query the Input or Output RoundsVault.

#### Returns

`Promise`\<[`RoundState`](../enumerations/RoundState.md)\>

***

### getSetFleetTransferabilityTx()

```ts
getSetFleetTransferabilityTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:370](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L370)

Builds the `FleetCommander.setFleetTokenTransferability` transaction, which flips the fleet
share-token transferability flag (no argument — it is a toggle).

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetMinimumPositionSizeTx()

```ts
getSetMinimumPositionSizeTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:271](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L271)

Builds the `RoundsVaultBase.setMinPositionSize` transaction for the Input or Output RoundsVault of
a Fleet (manager-set config).

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### minimumPositionSize

`string`

Human-readable minimum position size (e.g. `"100"`). Converted
  to base units using the target vault's underlying-token decimals.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to target the Input or Output RoundsVault.

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetRoundSettledBatchTx()

```ts
getSetRoundSettledBatchTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:321](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L321)

Builds the `RoundsVault.setRoundSettledBatch` transaction: settles multiple in-settlement rounds in
a single call.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### roundIds

`bigint`[]

The round numbers to settle.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to target the Input or Output RoundsVault.

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetRoundSettledTx()

```ts
getSetRoundSettledTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:305](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L305)

Builds the `RoundsVault.setRoundSettled` transaction: marks an in-settlement round as Settled,
making its receipts redeemable.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### roundId

`bigint`

The round number to settle.

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

Whether to target the Input or Output RoundsVault.

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetWhitelistedBatchTx()

```ts
getSetWhitelistedBatchTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:448](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L448)

Builds the transaction to set or revoke whitelist status for multiple accounts in a single
on-chain call.

#### Parameters

##### params

###### accountAddresses

`` `0x${string}` ``[]

Array of accounts to update.

###### allowed

`boolean`[]

Parallel array of allowed flags.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address (the whitelist context).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetWhitelistedTx()

```ts
getSetWhitelistedTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:432](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L432)

Builds the transaction to set or revoke whitelist status for a single account on the Fleet's
ProtocolAccessManagerV2 context.

#### Parameters

##### params

###### accountAddress

`` `0x${string}` ``

The account to whitelist or de-list.

###### allowed

`boolean`

`true` to whitelist, `false` to revoke.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address (the whitelist context).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetWhitelistOpenTx()

```ts
getSetWhitelistOpenTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:463](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L463)

Builds the transaction to toggle the open-whitelist flag for the Fleet context. When open, any
address is considered whitelisted regardless of individual entries.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address (the whitelist context).

###### isOpen

`boolean`

`true` to open the whitelist globally, `false` to close it.

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getUserVaultExposure()

```ts
getUserVaultExposure(params): Promise<IRwaUserVaultExposure>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:241](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L241)

Returns a user's total economic exposure to an RWA vault, denominated in the Fleet input asset
(e.g. USDC) plus a USD valuation and a per-component breakdown. Stitches the three pools of the
RoundsVault model: `settledPosition + pendingDeposits + claimableDeposits + pendingWithdrawals`.
`claimableDeposits` (settled, unclaimed Input receipts) is added because those shares are held by
the RoundsVault, not the user, so they are absent from the per-user `position.inputTokenBalance`.
Pending withdrawals are share-denominated Output receipts converted via the vault `pricePerShare`;
claimable withdrawals are excluded.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### userAddress

`` `0x${string}` ``

The user to query.

#### Returns

`Promise`\<[`IRwaUserVaultExposure`](IRwaUserVaultExposure.md)\>

***

### getVaultInfoListPerChain()

```ts
getVaultInfoListPerChain(params): Promise<{
  list: IRwaVaultInfo[];
}>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L32)

Retrieves the information of all RWA vaults for a given chain and institution.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

Chain to query.

###### clientId

`string`

Institution client ID string (e.g. `'ExtDemoCorp_v2'`).

#### Returns

`Promise`\<\{
  `list`: [`IRwaVaultInfo`](IRwaVaultInfo.md)[];
\}\>

The information of all RWA vaults for the given chain/clientId.

***

### getVaultMarketValue()

```ts
getVaultMarketValue(params): Promise<IRwaVaultMarketValue>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:256](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L256)

Returns the total market value (true TVL) of an RWA vault across all users, denominated in the
Fleet input asset plus a USD valuation and a per-component breakdown. Treats the Fleet and both
RoundsVaults as one system: `fleetAssets + pendingDeposits + claimableWithdrawals`, where
`fleetAssets` (on-chain `totalAssets()`) already accounts for settled deposits/withdrawals.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

#### Returns

`Promise`\<[`IRwaVaultMarketValue`](IRwaVaultMarketValue.md)\>

***

### getVaultRaw()

```ts
getVaultRaw(params): Promise<GetVaultQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:53](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L53)

Retrieves the raw RWA subgraph response for a single vault. The RWA equivalent of
`armada.users.getVaultRaw`.

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

Identifier of the vault to query (chain + fleet address).

#### Returns

`Promise`\<`GetVaultQuery`\>

The raw GetVault query result from the RWA subgraph.

***

### getVaultsRaw()

```ts
getVaultsRaw(params): Promise<GetVaultsQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L44)

Retrieves the raw RWA subgraph response for all vaults of a given chain and institution. The RWA
equivalent of `armada.users.getVaultsRaw`.

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain to query.

###### clientId

`string`

Institution client ID string (e.g. `'ExtDemoCorp_v2'`).

#### Returns

`Promise`\<`GetVaultsQuery`\>

The raw GetVaults query result from the RWA subgraph.

***

### getWithdrawTx()

```ts
getWithdrawTx(params): Promise<TransactionInfo[]>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:111](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L111)

Builds the approve + `RoundsVaultOutput.deposit` transaction pair for a whitelisted user who wants
to exit the Fleet. Mints an ERC-1155 receipt for the current round.

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

###### sharesAmount

`string`

Human-readable amount of Fleet shares to deposit into the Output
  vault. Converted to base units using the Output vault's underlying-token (share) decimals.

###### userAddress

`` `0x${string}` ``

The withdrawing user (owner + receiver of the round receipt).

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)[]\>

***

### isFleetTransfersEnabled()

```ts
isFleetTransfersEnabled(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:382](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L382)

Returns whether the Fleet's share token is currently transferable (read the current state so
callers can label the toggle).

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address.

#### Returns

`Promise`\<`boolean`\>

***

### isWhitelisted()

```ts
isWhitelisted(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:477](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L477)

Returns whether an account is whitelisted on the Fleet context (either individually or because the
whitelist is open).

#### Parameters

##### params

###### accountAddress

`` `0x${string}` ``

The account to check.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address (the whitelist context).

#### Returns

`Promise`\<`boolean`\>

***

### isWhitelistOpen()

```ts
isWhitelistOpen(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:490](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L490)

Returns whether the Fleet's whitelist is globally open (i.e. `_isWhitelistOpen[fleetAddress] ==
true`).

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the Fleet is on.

###### fleetAddress

`` `0x${string}` ``

The Fleet address (the whitelist context).

#### Returns

`Promise`\<`boolean`\>
