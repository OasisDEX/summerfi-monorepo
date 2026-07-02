# Interface: IDcaManagerClient

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L20)

## Name

IDcaManagerClient

## Description

Client interface for DCA order management

## Methods

### cancelStrategyTx()

```ts
cancelStrategyTx(params): Promise<[CancelDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:98](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L98)

Builds the transaction that permanently cancels a DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](IDcaStrategy.md)

The strategy to cancel.

#### Returns

`Promise`\<\[[`CancelDcaStrategyTransactionInfo`](../type-aliases/CancelDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the cancel-strategy transaction info.

***

### createStrategyTx()

```ts
createStrategyTx(params): Promise<
  | [CreateDcaStrategyTransactionInfo]
| [ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L28)

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

[`IChainlinkFeed`](IChainlinkFeed.md)

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

[`IChainlinkFeed`](IChainlinkFeed.md)

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

***

### editStrategyTx()

```ts
editStrategyTx(params): Promise<[EditDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L59)

Builds the transaction that updates the parameters of an existing DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](IDcaStrategy.md)

The strategy (with its updated fields) to apply.

#### Returns

`Promise`\<\[[`EditDcaStrategyTransactionInfo`](../type-aliases/EditDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the edit-strategy transaction info.

***

### getExecution()

```ts
getExecution(params): Promise<IDcaExecution | undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:147](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L147)

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

`Promise`\<[`IDcaExecution`](IDcaExecution.md) \| `undefined`\>

A promise resolving to the execution, or `undefined` if not found.

***

### getExecutions()

```ts
getExecutions(params): Promise<IDcaExecution[]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:136](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L136)

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

`Promise`\<[`IDcaExecution`](IDcaExecution.md)[]\>

A promise resolving to the strategy's executions.

***

### getStrategies()

```ts
getStrategies(params): Promise<IDcaStrategy[]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:112](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L112)

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

`Promise`\<[`IDcaStrategy`](IDcaStrategy.md)[]\>

A promise resolving to the matching strategies.

***

### getStrategy()

```ts
getStrategy(params): Promise<IDcaStrategy | undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:126](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L126)

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

`Promise`\<[`IDcaStrategy`](IDcaStrategy.md) \| `undefined`\>

A promise resolving to the strategy, or `undefined` if not found.

***

### pauseStrategyTx()

```ts
pauseStrategyTx(params): Promise<[PauseDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:72](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L72)

Builds the transaction that pauses an active DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](IDcaStrategy.md)

The strategy to pause.

#### Returns

`Promise`\<\[[`PauseDcaStrategyTransactionInfo`](../type-aliases/PauseDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the pause-strategy transaction info.

***

### resumeStrategyTx()

```ts
resumeStrategyTx(params): Promise<[ResumeDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L85)

Builds the transaction that resumes a previously paused DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](IDcaStrategy.md)

The strategy to resume.

#### Returns

`Promise`\<\[[`ResumeDcaStrategyTransactionInfo`](../type-aliases/ResumeDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the resume-strategy transaction info.
