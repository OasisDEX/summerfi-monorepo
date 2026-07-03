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

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:63](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L63)

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

#### See

IRwaManagerClient.getCancelRoundDepositTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getCancelRoundDepositTx`](../interfaces/IRwaManagerClient.md#getcancelrounddeposittx)

***

### getClaimAssetsTx()

```ts
getClaimAssetsTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:56](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L56)

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

#### See

IRwaManagerClient.getClaimAssetsTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getClaimAssetsTx`](../interfaces/IRwaManagerClient.md#getclaimassetstx)

***

### getClaimSharesTx()

```ts
getClaimSharesTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L42)

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

#### See

IRwaManagerClient.getClaimSharesTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getClaimSharesTx`](../interfaces/IRwaManagerClient.md#getclaimsharestx)

***

### getCurrentRound()

```ts
getCurrentRound(params): Promise<bigint>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:70](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L70)

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

#### See

IRwaManagerClient.getCurrentRound

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getCurrentRound`](../interfaces/IRwaManagerClient.md#getcurrentround)

***

### getDepositTx()

```ts
getDepositTx(params): Promise<TransactionInfo[]>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L35)

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

#### See

IRwaManagerClient.getDepositTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getDepositTx`](../interfaces/IRwaManagerClient.md#getdeposittx)

***

### getEmergencyRollbackRoundTx()

```ts
getEmergencyRollbackRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:147](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L147)

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

#### See

IRwaManagerClient.getEmergencyRollbackRoundTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getEmergencyRollbackRoundTx`](../interfaces/IRwaManagerClient.md#getemergencyrollbackroundtx)

***

### getExchangeRate()

```ts
getExchangeRate(params): Promise<IPrice>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:84](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L84)

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

#### See

IRwaManagerClient.getExchangeRate

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getExchangeRate`](../interfaces/IRwaManagerClient.md#getexchangerate)

***

### getGrantRoleTx()

```ts
getGrantRoleTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:168](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L168)

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

#### See

IRwaManagerClient.getGrantRoleTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getGrantRoleTx`](../interfaces/IRwaManagerClient.md#getgrantroletx)

***

### getNextRoundTx()

```ts
getNextRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:119](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L119)

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

#### See

IRwaManagerClient.getNextRoundTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getNextRoundTx`](../interfaces/IRwaManagerClient.md#getnextroundtx)

***

### getReceiptBalances()

```ts
getReceiptBalances(params): Promise<object[]>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:91](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L91)

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

#### See

IRwaManagerClient.getReceiptBalances

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getReceiptBalances`](../interfaces/IRwaManagerClient.md#getreceiptbalances)

***

### getRetryRoundTx()

```ts
getRetryRoundTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:140](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L140)

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

#### See

IRwaManagerClient.getRetryRoundTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getRetryRoundTx`](../interfaces/IRwaManagerClient.md#getretryroundtx)

***

### getRevokeRoleTx()

```ts
getRevokeRoleTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:175](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L175)

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

#### See

IRwaManagerClient.getRevokeRoleTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getRevokeRoleTx`](../interfaces/IRwaManagerClient.md#getrevokeroletx)

***

### getRoundState()

```ts
getRoundState(params): Promise<RoundState>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:77](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L77)

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

#### See

IRwaManagerClient.getRoundState

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getRoundState`](../interfaces/IRwaManagerClient.md#getroundstate)

***

### getSetFleetTransferabilityTx()

```ts
getSetFleetTransferabilityTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:154](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L154)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../interfaces/TransactionInfo.md)\>

#### See

IRwaManagerClient.getSetFleetTransferabilityTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetFleetTransferabilityTx`](../interfaces/IRwaManagerClient.md#getsetfleettransferabilitytx)

***

### getSetMinimumPositionSizeTx()

```ts
getSetMinimumPositionSizeTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:112](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L112)

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

#### See

IRwaManagerClient.getSetMinimumPositionSizeTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetMinimumPositionSizeTx`](../interfaces/IRwaManagerClient.md#getsetminimumpositionsizetx)

***

### getSetRoundSettledBatchTx()

```ts
getSetRoundSettledBatchTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:133](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L133)

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

#### See

IRwaManagerClient.getSetRoundSettledBatchTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetRoundSettledBatchTx`](../interfaces/IRwaManagerClient.md#getsetroundsettledbatchtx)

***

### getSetRoundSettledTx()

```ts
getSetRoundSettledTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:126](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L126)

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

#### See

IRwaManagerClient.getSetRoundSettledTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetRoundSettledTx`](../interfaces/IRwaManagerClient.md#getsetroundsettledtx)

***

### getSetWhitelistedBatchTx()

```ts
getSetWhitelistedBatchTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:189](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L189)

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

#### See

IRwaManagerClient.getSetWhitelistedBatchTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetWhitelistedBatchTx`](../interfaces/IRwaManagerClient.md#getsetwhitelistedbatchtx)

***

### getSetWhitelistedTx()

```ts
getSetWhitelistedTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:182](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L182)

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

#### See

IRwaManagerClient.getSetWhitelistedTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetWhitelistedTx`](../interfaces/IRwaManagerClient.md#getsetwhitelistedtx)

***

### getSetWhitelistOpenTx()

```ts
getSetWhitelistOpenTx(params): Promise<TransactionInfo>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:196](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L196)

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

#### See

IRwaManagerClient.getSetWhitelistOpenTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getSetWhitelistOpenTx`](../interfaces/IRwaManagerClient.md#getsetwhitelistopentx)

***

### getUserVaultExposure()

```ts
getUserVaultExposure(params): Promise<IRwaUserVaultExposure>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:98](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L98)

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

#### See

IRwaManagerClient.getUserVaultExposure

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getUserVaultExposure`](../interfaces/IRwaManagerClient.md#getuservaultexposure)

***

### getVaultInfoListPerChain()

```ts
getVaultInfoListPerChain(params): Promise<{
  list: IRwaVaultInfo[];
}>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L14)

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

#### See

IRwaManagerClient.getVaultInfoListPerChain

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getVaultInfoListPerChain`](../interfaces/IRwaManagerClient.md#getvaultinfolistperchain)

***

### getVaultMarketValue()

```ts
getVaultMarketValue(params): Promise<IRwaVaultMarketValue>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:105](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L105)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`IRwaVaultMarketValue`](../interfaces/IRwaVaultMarketValue.md)\>

#### See

IRwaManagerClient.getVaultMarketValue

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getVaultMarketValue`](../interfaces/IRwaManagerClient.md#getvaultmarketvalue)

***

### getVaultRaw()

```ts
getVaultRaw(params): Promise<GetVaultQuery>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L28)

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md)

#### Returns

`Promise`\<`GetVaultQuery`\>

#### See

IRwaManagerClient.getVaultRaw

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getVaultRaw`](../interfaces/IRwaManagerClient.md#getvaultraw)

***

### getVaultsRaw()

```ts
getVaultsRaw(params): Promise<GetVaultsQuery>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L21)

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](../interfaces/IChainInfo.md)

###### clientId

`string`

#### Returns

`Promise`\<`GetVaultsQuery`\>

#### See

IRwaManagerClient.getVaultsRaw

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getVaultsRaw`](../interfaces/IRwaManagerClient.md#getvaultsraw)

***

### getWithdrawTx()

```ts
getWithdrawTx(params): Promise<TransactionInfo[]>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L49)

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

#### See

IRwaManagerClient.getWithdrawTx

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`getWithdrawTx`](../interfaces/IRwaManagerClient.md#getwithdrawtx)

***

### isFleetTransfersEnabled()

```ts
isFleetTransfersEnabled(params): Promise<boolean>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:161](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L161)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

#### See

IRwaManagerClient.isFleetTransfersEnabled

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`isFleetTransfersEnabled`](../interfaces/IRwaManagerClient.md#isfleettransfersenabled)

***

### isWhitelisted()

```ts
isWhitelisted(params): Promise<boolean>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:203](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L203)

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

#### See

IRwaManagerClient.isWhitelisted

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`isWhitelisted`](../interfaces/IRwaManagerClient.md#iswhitelisted)

***

### isWhitelistOpen()

```ts
isWhitelistOpen(params): Promise<boolean>;
```

Defined in: [src/implementation/ArmadaManager/RwaManagerClient.ts:210](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/RwaManagerClient.ts#L210)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

#### See

IRwaManagerClient.isWhitelistOpen

#### Implementation of

[`IRwaManagerClient`](../interfaces/IRwaManagerClient.md).[`isWhitelistOpen`](../interfaces/IRwaManagerClient.md#iswhitelistopen)
