# Interface: IDcaManagerClient

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L22)

Client interface for DCA order management

## Methods

### cancelStrategyTx()

```ts
cancelStrategyTx(params): Promise<[CancelDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:213](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L213)

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
  | [Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]
| [Permit2AuthorizationTransactionInfo, Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:95](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L95)

Builds the transactions that create a new DCA strategy WITHOUT an initial deposit
(`createStrategy`). The user is expected to already hold the source-vault shares the keeper will
pull.

Ordered: `[permit2 authorization?, permit2 sub-allowance, create]` — no inAsset approval, since
nothing is deposited. Send the transactions in array order — the `CreateStrategy` transaction is
always last. Same params as [depositAndCreateStrategyTx](#depositandcreatestrategytx) minus `assetAmount`.

#### Parameters

##### params

Strategy configuration (no deposit).

###### amountShares

`string`

Per-trade amount (source-vault share base units).

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
  \| \[[`Permit2SubAllowanceTransactionInfo`](../type-aliases/Permit2SubAllowanceTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../type-aliases/Permit2AuthorizationTransactionInfo.md), [`Permit2SubAllowanceTransactionInfo`](../type-aliases/Permit2SubAllowanceTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the ordered array of transactions to send.

#### Throws

If the DCA module is not deployed on `params.chainId`.

#### Example

```ts
const txs = await dcaManager.createStrategyTx({ chainId: ChainIds.Base, userAddress, ...config })
```

***

### depositAndCreateStrategyTx()

```ts
depositAndCreateStrategyTx(params): Promise<
  | [Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]
  | [Permit2AuthorizationTransactionInfo, Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]
  | [Permit2SubAllowanceTransactionInfo, ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]
| [Permit2AuthorizationTransactionInfo, Permit2SubAllowanceTransactionInfo, ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L41)

Builds the transactions that create a new DCA strategy AND make the initial deposit
(`depositAndCreate`).

Ordered: `[permit2 authorization?, permit2 sub-allowance, inAsset approval?, create]`. The
Permit2 steps set up the keeper's recurring pull of source-vault shares (authorization is
included only when the ERC20 allowance to Permit2 is insufficient); the inAsset approval is
included only when the allowance to the manager is insufficient. Send the transactions in array
order — the `CreateStrategy` transaction is always last.

#### Parameters

##### params

Strategy configuration plus the `assetAmount` to deposit at creation.

###### amountShares

`string`

Per-trade amount (source asset base units).

###### assetAmount

`string`

Initial principal deposited at creation (in-asset base units). Must be non-zero.

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
  \| \[[`Permit2SubAllowanceTransactionInfo`](../type-aliases/Permit2SubAllowanceTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../type-aliases/Permit2AuthorizationTransactionInfo.md), [`Permit2SubAllowanceTransactionInfo`](../type-aliases/Permit2SubAllowanceTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2SubAllowanceTransactionInfo`](../type-aliases/Permit2SubAllowanceTransactionInfo.md), [`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../type-aliases/Permit2AuthorizationTransactionInfo.md), [`Permit2SubAllowanceTransactionInfo`](../type-aliases/Permit2SubAllowanceTransactionInfo.md), [`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../type-aliases/CreateDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the ordered array of transactions to send.

#### Throws

If the DCA module is not deployed on `params.chainId`.

#### Example

```ts
const txs = await dcaManager.depositAndCreateStrategyTx({ chainId: ChainIds.Base, userAddress, ...config })
```

***

### editStrategyTx()

```ts
editStrategyTx(params): Promise<
  | [EditDcaStrategyTransactionInfo]
  | [Permit2SubAllowanceTransactionInfo, EditDcaStrategyTransactionInfo]
  | [Permit2AuthorizationTransactionInfo, EditDcaStrategyTransactionInfo]
| [Permit2AuthorizationTransactionInfo, Permit2SubAllowanceTransactionInfo, EditDcaStrategyTransactionInfo]>;
```

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:146](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L146)

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

`Promise`\<
  \| \[[`EditDcaStrategyTransactionInfo`](../type-aliases/EditDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2SubAllowanceTransactionInfo`](../type-aliases/Permit2SubAllowanceTransactionInfo.md), [`EditDcaStrategyTransactionInfo`](../type-aliases/EditDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../type-aliases/Permit2AuthorizationTransactionInfo.md), [`EditDcaStrategyTransactionInfo`](../type-aliases/EditDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../type-aliases/Permit2AuthorizationTransactionInfo.md), [`Permit2SubAllowanceTransactionInfo`](../type-aliases/Permit2SubAllowanceTransactionInfo.md), [`EditDcaStrategyTransactionInfo`](../type-aliases/EditDcaStrategyTransactionInfo.md)\]\>

A promise resolving to the ordered transactions to send. When the edit changes the
  keeper's pull requirement (`tradeAmount`/`maxTrades`) or the pulled token (`sourceVault`), the
  edit is prefixed with the Permit2 setup the new config needs (authorization only when the ERC20
  allowance to Permit2 is insufficient; a sub-allowance only when the current one is short or
  expired). The `EditStrategy` transaction is always last.

#### Throws

If the strategy is not active or paused.

#### Example

```ts
const txs = await dcaManager.editStrategyTx({
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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:262](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L262)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:251](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L251)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:227](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L227)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:241](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L241)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:176](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L176)

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

Defined in: [src/interfaces/ArmadaManager/IDcaManagerClient.ts:194](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IDcaManagerClient.ts#L194)

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
