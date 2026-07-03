# Interface: IDcaManagerClient

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L20)

Client interface for DCA order management

## Methods

### cancelStrategyTx()

```ts
cancelStrategyTx(params): Promise<[CancelDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:135](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L135)

Builds the transaction that permanently cancels a DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](IDcaStrategy.md)

The current on-chain strategy to cancel.

#### Returns

`Promise`\<\[[`CancelDcaStrategyTransactionInfo`](../type-aliases/CancelDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the cancel-strategy transaction info.

#### Throws

If the DCA module is not deployed on `params.chainId`, or the strategy is not active or
  paused.

#### Example

```ts
const [cancelTx] = await dcaManager.cancelStrategyTx({ chainId: ChainIds.Base, strategy })
```

***

### createStrategyTx()

```ts
createStrategyTx(params): Promise<
  | [CreateDcaStrategyTransactionInfo]
| [ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L37)

Builds the transaction(s) that create a new DCA (dollar-cost-averaging) strategy.

The strategy creation pulls the initial `assetAmount` from the user, so the result is prefixed
with an ERC20 approval transaction when the current allowance is insufficient; otherwise it is a
single-element tuple. Send the transactions in order, mining the approval before the create.

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

A promise resolving to `[createTx]`, or `[approveTx, createTx]` when an approval is needed.

#### Throws

If the DCA module is not deployed on `params.chainId`.

#### Example

```ts
const txs = await dcaManager.createStrategyTx({ chainId: ChainIds.Base, userAddress, ...config })
```

***

### editStrategyTx()

```ts
editStrategyTx(params): Promise<[EditDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:79](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L79)

Builds the transaction that updates the parameters of an existing DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](IDcaStrategy.md)

The current on-chain strategy (as returned by `getStrategy`); used as
  the `oldConfig` whose hash must match the stored commitment.

###### update

[`IDcaStrategyUpdate`](../type-aliases/IDcaStrategyUpdate.md)

The fields to change, merged over `strategy` to form the `newConfig`.

#### Returns

`Promise`\<\[[`EditDcaStrategyTransactionInfo`](../type-aliases/EditDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the edit-strategy transaction info.

#### Throws

If the strategy is not active or paused.

#### Example

```ts
const [editTx] = await dcaManager.editStrategyTx({
  chainId: ChainIds.Base,
  strategy: existingStrategy,
  update: { slippagePercentage: 1 },
})
```

***

### getExecution()

```ts
getExecution(params): Promise<IDcaExecution | undefined>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:184](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L184)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:173](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L173)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:149](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L149)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:163](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L163)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:98](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L98)

Builds the transaction that pauses an active DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](IDcaStrategy.md)

The current on-chain strategy to pause.

#### Returns

`Promise`\<\[[`PauseDcaStrategyTransactionInfo`](../type-aliases/PauseDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the pause-strategy transaction info.

#### Throws

If the DCA module is not deployed on `params.chainId`, or the strategy is not active.

#### Example

```ts
const [pauseTx] = await dcaManager.pauseStrategyTx({ chainId: ChainIds.Base, strategy })
```

***

### resumeStrategyTx()

```ts
resumeStrategyTx(params): Promise<[ResumeDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:116](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L116)

Builds the transaction that resumes a previously paused DCA strategy.

#### Parameters

##### params

Parameters object.

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain the strategy lives on.

###### strategy

[`IDcaStrategy`](IDcaStrategy.md)

The current on-chain strategy to resume.

#### Returns

`Promise`\<\[[`ResumeDcaStrategyTransactionInfo`](../type-aliases/ResumeDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the resume-strategy transaction info.

#### Throws

If the DCA module is not deployed on `params.chainId`, or the strategy is not paused.

#### Example

```ts
const [resumeTx] = await dcaManager.resumeStrategyTx({ chainId: ChainIds.Base, strategy })
```
