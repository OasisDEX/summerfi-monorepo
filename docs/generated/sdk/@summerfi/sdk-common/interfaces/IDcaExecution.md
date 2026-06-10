# Interface: IDcaExecution

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaExecution.ts:5](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaExecution.ts#L5)

## Name

IDcaExecution

## Description

Represents a single execution of a DCA strategy

## Properties

### amountIn

```ts
amountIn: string;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaExecution.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaExecution.ts#L13)

Amount of input tokens used in this execution (in token units, as string)

***

### amountOut

```ts
amountOut: string;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaExecution.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaExecution.ts#L15)

Amount of output tokens received in this execution (in token units, as string)

***

### executionTimestamp

```ts
executionTimestamp: number;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaExecution.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaExecution.ts#L11)

Unix timestamp of when the execution occurred

***

### id

```ts
id: string;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaExecution.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaExecution.ts#L7)

Unique identifier of this execution

***

### tradesExecutedAfter

```ts
tradesExecutedAfter: number;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaExecution.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaExecution.ts#L17)

Total number of trades executed after this execution

***

### txHash

```ts
txHash: string;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaExecution.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaExecution.ts#L9)

Transaction hash of this execution
