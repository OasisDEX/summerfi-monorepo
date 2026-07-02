# Interface: IRwaManagerClient

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L20)

Client interface for the RWA namespace

## Methods

### getCancelRoundDepositTx()

```ts
getCancelRoundDepositTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:76](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L76)

#### Parameters

##### params

###### amount

`string`

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### receiverAddress?

`` `0x${string}` ``

###### roundId

`bigint`

###### userAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getClaimAssetsTx()

```ts
getClaimAssetsTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:67](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L67)

#### Parameters

##### params

###### amount

`string`

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### receiverAddress?

`` `0x${string}` ``

###### roundId

`bigint`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getClaimSharesTx()

```ts
getClaimSharesTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L49)

#### Parameters

##### params

###### amount

`string`

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### receiverAddress?

`` `0x${string}` ``

###### roundId

`bigint`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getCurrentRound()

```ts
getCurrentRound(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:88](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L88)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<`bigint`\>

***

### getDepositTx()

```ts
getDepositTx(params): Promise<TransactionInfo[]>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L42)

#### Parameters

##### params

###### assetsAmount

`string`

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)[]\>

***

### getEmergencyRollbackRoundTx()

```ts
getEmergencyRollbackRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:162](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L162)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getExchangeRate()

```ts
getExchangeRate(params): Promise<IPrice>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:101](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L101)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`IPrice`](IPrice.md)\>

***

### getGrantRoleTx()

```ts
getGrantRoleTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:183](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L183)

#### Parameters

##### params

###### account

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### role

[`RwaRole`](../type-aliases/RwaRole.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getNextRoundTx()

```ts
getNextRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:135](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L135)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getReceiptBalances()

```ts
getReceiptBalances(params): Promise<object[]>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:108](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L108)

#### Parameters

##### params

###### accountAddress

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<`object`[]\>

***

### getRetryRoundTx()

```ts
getRetryRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:155](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L155)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getRevokeRoleTx()

```ts
getRevokeRoleTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:189](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L189)

#### Parameters

##### params

###### account

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### role

[`RwaRole`](../type-aliases/RwaRole.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getRoundState()

```ts
getRoundState(params): Promise<RoundState>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:94](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L94)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`RoundState`](../enumerations/RoundState.md)\>

***

### getSetFleetTransferabilityTx()

```ts
getSetFleetTransferabilityTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:171](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L171)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetMinimumPositionSizeTx()

```ts
getSetMinimumPositionSizeTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:126](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L126)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### minimumPositionSize

`string`

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetRoundSettledBatchTx()

```ts
getSetRoundSettledBatchTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:148](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L148)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundIds

`bigint`[]

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetRoundSettledTx()

```ts
getSetRoundSettledTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:141](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L141)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetWhitelistedBatchTx()

```ts
getSetWhitelistedBatchTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:204](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L204)

#### Parameters

##### params

###### accountAddresses

`` `0x${string}` ``[]

###### allowed

`boolean`[]

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetWhitelistedTx()

```ts
getSetWhitelistedTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:197](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L197)

#### Parameters

##### params

###### accountAddress

`` `0x${string}` ``

###### allowed

`boolean`

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getSetWhitelistOpenTx()

```ts
getSetWhitelistOpenTx(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:211](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L211)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### isOpen

`boolean`

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

***

### getUserVaultExposure()

```ts
getUserVaultExposure(params): Promise<IRwaUserVaultExposure>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:115](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L115)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`IRwaUserVaultExposure`](IRwaUserVaultExposure.md)\>

***

### getVaultInfoListPerChain()

```ts
getVaultInfoListPerChain(params): Promise<{
  list: IRwaVaultInfo[];
}>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L24)

Retrieves all RWA vaults for a given chain and institution clientId

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### clientId

`string`

#### Returns

`Promise`\<\{
  `list`: [`IRwaVaultInfo`](IRwaVaultInfo.md)[];
\}\>

***

### getVaultMarketValue()

```ts
getVaultMarketValue(params): Promise<IRwaVaultMarketValue>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:121](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L121)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`IRwaVaultMarketValue`](IRwaVaultMarketValue.md)\>

***

### getVaultRaw()

```ts
getVaultRaw(params): Promise<GetVaultQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L38)

Retrieves the raw RWA subgraph GetVault response for a single vault.
RWA equivalent of armada.users.getVaultRaw.

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<`GetVaultQuery`\>

***

### getVaultsRaw()

```ts
getVaultsRaw(params): Promise<GetVaultsQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L32)

Retrieves the raw RWA subgraph GetVaults response for a given chain
and institution clientId. RWA equivalent of armada.users.getVaultsRaw.

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

###### clientId

`string`

#### Returns

`Promise`\<`GetVaultsQuery`\>

***

### getWithdrawTx()

```ts
getWithdrawTx(params): Promise<TransactionInfo[]>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:60](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L60)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### sharesAmount

`string`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)[]\>

***

### isFleetTransfersEnabled()

```ts
isFleetTransfersEnabled(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:176](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L176)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

***

### isWhitelisted()

```ts
isWhitelisted(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:217](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L217)

#### Parameters

##### params

###### accountAddress

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

***

### isWhitelistOpen()

```ts
isWhitelistOpen(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IRwaManagerClient.ts:223](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IRwaManagerClient.ts#L223)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>
