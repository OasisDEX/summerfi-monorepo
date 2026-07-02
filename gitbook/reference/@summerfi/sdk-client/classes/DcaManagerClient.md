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

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L37)

Builds the transaction that permanently cancels a DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](../interfaces/IDcaStrategy.md)

The strategy to cancel.

#### Returns

`Promise`\<\[[`CancelDcaStrategyTransactionInfo`](../type-aliases/CancelDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the cancel-strategy transaction info.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`cancelStrategyTx`](../interfaces/IDcaManagerClient.md#cancelstrategytx)

***

### createStrategyTx()

```ts
createStrategyTx(params): Promise<
  | [CreateDcaStrategyTransactionInfo]
| [ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L13)

Builds the transaction that creates a new DCA (dollar-cost-averaging) strategy.

#### Parameters

##### params

Strategy configuration (chain, user, source/target vaults and assets, price
  feeds, share amount, slippage, interval, trade count, optional price guards and deadline).

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

A promise resolving to the create-strategy transaction info.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`createStrategyTx`](../interfaces/IDcaManagerClient.md#createstrategytx)

***

### editStrategyTx()

```ts
editStrategyTx(params): Promise<[EditDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L19)

Builds the transaction that updates the parameters of an existing DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](../interfaces/IDcaStrategy.md)

The strategy (with its updated fields) to apply.

#### Returns

`Promise`\<\[[`EditDcaStrategyTransactionInfo`](../type-aliases/EditDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the edit-strategy transaction info.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`editStrategyTx`](../interfaces/IDcaManagerClient.md#editstrategytx)

***

### getExecution()

```ts
getExecution(params): Promise<IDcaExecution | undefined>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:61](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L61)

Fetches a single execution of a DCA strategy by its id.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### executionId

`string`

The id of the execution to fetch.

###### strategyId

`string`

The id of the strategy the execution belongs to.

#### Returns

`Promise`\<[`IDcaExecution`](../interfaces/IDcaExecution.md) \| `undefined`\>

A promise resolving to the execution, or `undefined` if not found.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`getExecution`](../interfaces/IDcaManagerClient.md#getexecution)

***

### getExecutions()

```ts
getExecutions(params): Promise<IDcaExecution[]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:55](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L55)

Lists the executions (individual trades) performed by a DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategyId

`string`

The id of the strategy whose executions to list.

#### Returns

`Promise`\<[`IDcaExecution`](../interfaces/IDcaExecution.md)[]\>

A promise resolving to the strategy's executions.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`getExecutions`](../interfaces/IDcaManagerClient.md#getexecutions)

***

### getStrategies()

```ts
getStrategies(params): Promise<IDcaStrategy[]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L43)

Lists DCA strategies on a chain, optionally filtered by user and status.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain to query.

###### status?

[`DcaStrategyStatusEnum`](../enumerations/DcaStrategyStatusEnum.md)

Optional strategy status to filter by.

###### userAddress?

`` `0x${string}` ``

Optional owner address to filter by.

#### Returns

`Promise`\<[`IDcaStrategy`](../interfaces/IDcaStrategy.md)[]\>

A promise resolving to the matching strategies.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`getStrategies`](../interfaces/IDcaManagerClient.md#getstrategies)

***

### getStrategy()

```ts
getStrategy(params): Promise<IDcaStrategy | undefined>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L49)

Fetches a single DCA strategy by its id.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategyId

`string`

The id of the strategy to fetch.

#### Returns

`Promise`\<[`IDcaStrategy`](../interfaces/IDcaStrategy.md) \| `undefined`\>

A promise resolving to the strategy, or `undefined` if not found.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`getStrategy`](../interfaces/IDcaManagerClient.md#getstrategy)

***

### pauseStrategyTx()

```ts
pauseStrategyTx(params): Promise<[PauseDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L25)

Builds the transaction that pauses an active DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](../interfaces/IDcaStrategy.md)

The strategy to pause.

#### Returns

`Promise`\<\[[`PauseDcaStrategyTransactionInfo`](../type-aliases/PauseDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the pause-strategy transaction info.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`pauseStrategyTx`](../interfaces/IDcaManagerClient.md#pausestrategytx)

***

### resumeStrategyTx()

```ts
resumeStrategyTx(params): Promise<[ResumeDcaStrategyTransactionInfo]>;
```

Defined in: [src/implementation/ArmadaManager/DcaManagerClient.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/DcaManagerClient.ts#L31)

Builds the transaction that resumes a previously paused DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](../interfaces/IDcaStrategy.md)

The strategy to resume.

#### Returns

`Promise`\<\[[`ResumeDcaStrategyTransactionInfo`](../type-aliases/ResumeDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the resume-strategy transaction info.

#### Implementation of

[`IDcaManagerClient`](../interfaces/IDcaManagerClient.md).[`resumeStrategyTx`](../interfaces/IDcaManagerClient.md#resumestrategytx)
