# Class: DcaManagerClient

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L8)

Implementation of the DCA manager client interface

## Extends

- `IRPCClient`

## Implements

- [`IDcaManagerClient`](../interfaces/IDcaManagerClient.md)

## Constructors

### Constructor

```ts
new DcaManagerClient(params): DcaManagerClient;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L9)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`DcaManagerClient`

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

### cancelStrategyTx()

```ts
cancelStrategyTx(params): Promise<[CancelDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L42)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### strategy

[`IDcaStrategy`](../interfaces/IDcaStrategy.md)

#### Returns

`Promise`\<\[[`CancelDcaStrategyTransactionInfo`](../type-aliases/CancelDcaStrategyTransactionInfo.md)\]\>

#### See

IDcaManagerClient.cancelStrategyTx

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`cancelStrategyTx`](../interfaces/IDcaManagerClient.md#cancelstrategytx)

***

### createStrategyTx()

```ts
createStrategyTx(params): Promise<
  | [CreateDcaStrategyTransactionInfo]
| [ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L14)

#### Parameters

##### params

###### amountShares

`string`

Per-trade amount (source asset base units).

###### assetAmount

`string`

Initial principal deposited at creation (source asset base units). See plan Open Question 2.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### deadlineUnixTimestamp

`number`

###### fromVault

`` `0x${string}` ``

###### inAsset

`` `0x${string}` ``

###### inAssetFeed

[`IChainlinkFeed`](../interfaces/IChainlinkFeed.md)

###### intervalSeconds

`number`

###### maxTrades

`number`

###### neverBuyAbove?

`string`

###### neverSellBelow?

`string`

###### outAsset

`` `0x${string}` ``

###### outAssetFeed

[`IChainlinkFeed`](../interfaces/IChainlinkFeed.md)

###### slippagePercentage

`string`

###### toVault

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<
  \| \[[`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]\>

#### See

IDcaManagerClient.createStrategyTx

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`createStrategyTx`](../interfaces/IDcaManagerClient.md#createstrategytx)

***

### editStrategyTx()

```ts
editStrategyTx(params): Promise<[EditDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L21)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### strategy

[`IDcaStrategy`](../interfaces/IDcaStrategy.md)

###### update

[`IDcaStrategyUpdate`](../type-aliases/IDcaStrategyUpdate.md)

#### Returns

`Promise`\<\[[`EditDcaStrategyTransactionInfo`](../type-aliases/EditDcaStrategyTransactionInfo.md)\]\>

#### See

IDcaManagerClient.editStrategyTx

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`editStrategyTx`](../interfaces/IDcaManagerClient.md#editstrategytx)

***

### getExecution()

```ts
getExecution(params): Promise<IDcaExecution | undefined>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:70](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L70)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### executionId

`string`

###### strategyId

`string`

#### Returns

`Promise`\<[`IDcaExecution`](../interfaces/IDcaExecution.md) \| `undefined`\>

#### See

IDcaManagerClient.getExecution

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`getExecution`](../interfaces/IDcaManagerClient.md#getexecution)

***

### getExecutions()

```ts
getExecutions(params): Promise<IDcaExecution[]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:63](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L63)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### strategyId

`string`

#### Returns

`Promise`\<[`IDcaExecution`](../interfaces/IDcaExecution.md)[]\>

#### See

IDcaManagerClient.getExecutions

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`getExecutions`](../interfaces/IDcaManagerClient.md#getexecutions)

***

### getStrategies()

```ts
getStrategies(params): Promise<IDcaStrategy[]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L49)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### status?

[`DcaStrategyStatusEnum`](../enumerations/DcaStrategyStatusEnum.md)

###### userAddress?

`` `0x${string}` ``

#### Returns

`Promise`\<[`IDcaStrategy`](../interfaces/IDcaStrategy.md)[]\>

#### See

IDcaManagerClient.getStrategies

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`getStrategies`](../interfaces/IDcaManagerClient.md#getstrategies)

***

### getStrategy()

```ts
getStrategy(params): Promise<IDcaStrategy | undefined>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:56](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L56)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### strategyId

`string`

#### Returns

`Promise`\<[`IDcaStrategy`](../interfaces/IDcaStrategy.md) \| `undefined`\>

#### See

IDcaManagerClient.getStrategy

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`getStrategy`](../interfaces/IDcaManagerClient.md#getstrategy)

***

### pauseStrategyTx()

```ts
pauseStrategyTx(params): Promise<[PauseDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L28)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### strategy

[`IDcaStrategy`](../interfaces/IDcaStrategy.md)

#### Returns

`Promise`\<\[[`PauseDcaStrategyTransactionInfo`](../type-aliases/PauseDcaStrategyTransactionInfo.md)\]\>

#### See

IDcaManagerClient.pauseStrategyTx

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`pauseStrategyTx`](../interfaces/IDcaManagerClient.md#pausestrategytx)

***

### resumeStrategyTx()

```ts
resumeStrategyTx(params): Promise<[ResumeDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L35)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### strategy

[`IDcaStrategy`](../interfaces/IDcaStrategy.md)

#### Returns

`Promise`\<\[[`ResumeDcaStrategyTransactionInfo`](../type-aliases/ResumeDcaStrategyTransactionInfo.md)\]\>

#### See

IDcaManagerClient.resumeStrategyTx

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`resumeStrategyTx`](../interfaces/IDcaManagerClient.md#resumestrategytx)
