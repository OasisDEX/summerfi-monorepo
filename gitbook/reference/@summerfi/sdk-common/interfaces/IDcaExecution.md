# Interface: IDcaExecution

Defined in: [src/common/interfaces/IDcaExecution.ts:4](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaExecution.ts#L4)

Represents a single execution of a DCA strategy

## Properties

### amountIn

```ts
amountIn: string;
```

Defined in: [src/common/interfaces/IDcaExecution.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaExecution.ts#L12)

Amount of input tokens used in this execution (in token units, as string)

***

### amountOut

```ts
amountOut: string;
```

Defined in: [src/common/interfaces/IDcaExecution.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaExecution.ts#L14)

Amount of output tokens received in this execution (in token units, as string)

***

### executionTimestamp

```ts
executionTimestamp: number;
```

Defined in: [src/common/interfaces/IDcaExecution.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaExecution.ts#L10)

Unix timestamp of when the execution occurred

***

### id

```ts
id: string;
```

Defined in: [src/common/interfaces/IDcaExecution.ts:6](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaExecution.ts#L6)

Unique identifier of this execution

***

### tradesExecutedAfter

```ts
tradesExecutedAfter: number;
```

Defined in: [src/common/interfaces/IDcaExecution.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaExecution.ts#L16)

Total number of trades executed after this execution

***

### txHash

```ts
txHash: string;
```

Defined in: [src/common/interfaces/IDcaExecution.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaExecution.ts#L8)

Transaction hash of this execution
