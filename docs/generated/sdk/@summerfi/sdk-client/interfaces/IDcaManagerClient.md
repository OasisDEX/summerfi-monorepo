# Interface: IDcaManagerClient

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L18)

## Name

IDcaManagerClient

## Description

Client interface for DCA order management

## Methods

### cancelStrategyTx()

```ts
cancelStrategyTx(params): Promise<[CancelDcaStrategyTransactionInfo]>;
```

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:91](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L91)

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
createStrategyTx(params): Promise<[CreateDcaStrategyTransactionInfo]>;
```

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L26)

Builds the transaction that creates a new DCA (dollar-cost-averaging) strategy.

#### Parameters

##### params

Strategy configuration (chain, user, source/target vaults and assets, price
  feeds, share amount, slippage, interval, trade count, optional price guards and deadline).

###### amountShares

`string`

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### deadlineUnixTimestamp

`number`

###### fromVault

`` `0x${string}` ``

###### inAsset

`` `0x${string}` ``

###### inAssetFeed

`` `0x${string}` ``

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

`` `0x${string}` ``

###### slippagePercentage

`string`

###### toVault

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the create-strategy transaction info.

***

### editStrategyTx()

```ts
editStrategyTx(params): Promise<[EditDcaStrategyTransactionInfo]>;
```

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L52)

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

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:140](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L140)

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

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:129](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L129)

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

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:105](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L105)

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

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:119](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L119)

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

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:65](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L65)

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

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts:78](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L78)

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
