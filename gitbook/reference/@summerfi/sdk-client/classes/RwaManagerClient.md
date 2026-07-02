# Class: RwaManagerClient

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L8)

Implementation of the RWA manager client interface

## Extends

- `IRPCClient`

## Implements

- [`IRwaManagerClient`](../interfaces/IRwaManagerClient.md)

## Constructors

### Constructor

```ts
new RwaManagerClient(params): RwaManagerClient;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L9)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`RwaManagerClient`

#### Overrides

```ts
IRPCClient.constructor
```

## Accessors

### rpcClient

#### Get Signature

```ts
get protected rpcClient(): TRPCClient;
```

Defined in: [src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IRPCClient.ts#L10)

##### Returns

`TRPCClient`

#### Inherited from

```ts
IRPCClient.rpcClient
```

## Methods

### getCancelRoundDepositTx()

```ts
getCancelRoundDepositTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:55](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L55)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getCancelRoundDepositTx`](../interfaces/IRwaManagerClient.md#getcancelrounddeposittx)

***

### getClaimAssetsTx()

```ts
getClaimAssetsTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L49)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getClaimAssetsTx`](../interfaces/IRwaManagerClient.md#getclaimassetstx)

***

### getClaimSharesTx()

```ts
getClaimSharesTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L37)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getClaimSharesTx`](../interfaces/IRwaManagerClient.md#getclaimsharestx)

***

### getCurrentRound()

```ts
getCurrentRound(params): Promise<bigint>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:61](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L61)

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

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getCurrentRound`](../interfaces/IRwaManagerClient.md#getcurrentround)

***

### getDepositTx()

```ts
getDepositTx(params): Promise<TransactionInfo[]>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L31)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)[]\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getDepositTx`](../interfaces/IRwaManagerClient.md#getdeposittx)

***

### getEmergencyRollbackRoundTx()

```ts
getEmergencyRollbackRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:127](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L127)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getEmergencyRollbackRoundTx`](../interfaces/IRwaManagerClient.md#getemergencyrollbackroundtx)

***

### getExchangeRate()

```ts
getExchangeRate(params): Promise<IPrice>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:73](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L73)

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

`Promise`\<[`IPrice`](../interfaces/IPrice.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getExchangeRate`](../interfaces/IRwaManagerClient.md#getexchangerate)

***

### getGrantRoleTx()

```ts
getGrantRoleTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:145](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L145)

#### Parameters

##### params

###### account

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### role

[`RwaRole`](../type-aliases/RwaRole.md)

#### Returns

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getGrantRoleTx`](../interfaces/IRwaManagerClient.md#getgrantroletx)

***

### getNextRoundTx()

```ts
getNextRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:103](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L103)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getNextRoundTx`](../interfaces/IRwaManagerClient.md#getnextroundtx)

***

### getReceiptBalances()

```ts
getReceiptBalances(params): Promise<object[]>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:79](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L79)

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

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getReceiptBalances`](../interfaces/IRwaManagerClient.md#getreceiptbalances)

***

### getRetryRoundTx()

```ts
getRetryRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:121](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L121)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getRetryRoundTx`](../interfaces/IRwaManagerClient.md#getretryroundtx)

***

### getRevokeRoleTx()

```ts
getRevokeRoleTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:151](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L151)

#### Parameters

##### params

###### account

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### role

[`RwaRole`](../type-aliases/RwaRole.md)

#### Returns

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getRevokeRoleTx`](../interfaces/IRwaManagerClient.md#getrevokeroletx)

***

### getRoundState()

```ts
getRoundState(params): Promise<RoundState>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:67](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L67)

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

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getRoundState`](../interfaces/IRwaManagerClient.md#getroundstate)

***

### getSetFleetTransferabilityTx()

```ts
getSetFleetTransferabilityTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:133](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L133)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetFleetTransferabilityTx`](../interfaces/IRwaManagerClient.md#getsetfleettransferabilitytx)

***

### getSetMinimumPositionSizeTx()

```ts
getSetMinimumPositionSizeTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:97](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L97)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetMinimumPositionSizeTx`](../interfaces/IRwaManagerClient.md#getsetminimumpositionsizetx)

***

### getSetRoundSettledBatchTx()

```ts
getSetRoundSettledBatchTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:115](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L115)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetRoundSettledBatchTx`](../interfaces/IRwaManagerClient.md#getsetroundsettledbatchtx)

***

### getSetRoundSettledTx()

```ts
getSetRoundSettledTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:109](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L109)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetRoundSettledTx`](../interfaces/IRwaManagerClient.md#getsetroundsettledtx)

***

### getSetWhitelistedBatchTx()

```ts
getSetWhitelistedBatchTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:163](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L163)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetWhitelistedBatchTx`](../interfaces/IRwaManagerClient.md#getsetwhitelistedbatchtx)

***

### getSetWhitelistedTx()

```ts
getSetWhitelistedTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:157](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L157)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetWhitelistedTx`](../interfaces/IRwaManagerClient.md#getsetwhitelistedtx)

***

### getSetWhitelistOpenTx()

```ts
getSetWhitelistOpenTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:169](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L169)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### isOpen

`boolean`

#### Returns

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetWhitelistOpenTx`](../interfaces/IRwaManagerClient.md#getsetwhitelistopentx)

***

### getUserVaultExposure()

```ts
getUserVaultExposure(params): Promise<IRwaUserVaultExposure>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L85)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`IRwaUserVaultExposure`](../interfaces/IRwaUserVaultExposure.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getUserVaultExposure`](../interfaces/IRwaManagerClient.md#getuservaultexposure)

***

### getVaultInfoListPerChain()

```ts
getVaultInfoListPerChain(params): Promise<{
  list: IRwaVaultInfo[];
}>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L13)

Retrieves all RWA vaults for a given chain and institution clientId

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### clientId

`string`

#### Returns

`Promise`\<\{
  `list`: [`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md)[];
\}\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getVaultInfoListPerChain`](../interfaces/IRwaManagerClient.md#getvaultinfolistperchain)

***

### getVaultMarketValue()

```ts
getVaultMarketValue(params): Promise<IRwaVaultMarketValue>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:91](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L91)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`IRwaVaultMarketValue`](../interfaces/IRwaVaultMarketValue.md)\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getVaultMarketValue`](../interfaces/IRwaManagerClient.md#getvaultmarketvalue)

***

### getVaultRaw()

```ts
getVaultRaw(params): Promise<GetVaultQuery>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L25)

Retrieves the raw RWA subgraph GetVault response for a single vault.
RWA equivalent of armada.users.getVaultRaw.

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md)

#### Returns

`Promise`\<`GetVaultQuery`\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getVaultRaw`](../interfaces/IRwaManagerClient.md#getvaultraw)

***

### getVaultsRaw()

```ts
getVaultsRaw(params): Promise<GetVaultsQuery>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L19)

Retrieves the raw RWA subgraph GetVaults response for a given chain
and institution clientId. RWA equivalent of armada.users.getVaultsRaw.

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](../interfaces/IChainInfo.md)

###### clientId

`string`

#### Returns

`Promise`\<`GetVaultsQuery`\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getVaultsRaw`](../interfaces/IRwaManagerClient.md#getvaultsraw)

***

### getWithdrawTx()

```ts
getWithdrawTx(params): Promise<TransactionInfo[]>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L43)

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

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)[]\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getWithdrawTx`](../interfaces/IRwaManagerClient.md#getwithdrawtx)

***

### isFleetTransfersEnabled()

```ts
isFleetTransfersEnabled(params): Promise<boolean>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:139](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L139)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`isFleetTransfersEnabled`](../interfaces/IRwaManagerClient.md#isfleettransfersenabled)

***

### isWhitelisted()

```ts
isWhitelisted(params): Promise<boolean>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:175](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L175)

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

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`isWhitelisted`](../interfaces/IRwaManagerClient.md#iswhitelisted)

***

### isWhitelistOpen()

```ts
isWhitelistOpen(params): Promise<boolean>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:181](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L181)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`isWhitelistOpen`](../interfaces/IRwaManagerClient.md#iswhitelistopen)
