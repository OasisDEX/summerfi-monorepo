# Type Alias: ResumeDcaStrategyTransactionInfo

```ts
type ResumeDcaStrategyTransactionInfo = TransactionInfo & object;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:201](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L201)

Transaction info for resuming a DCA strategy, carrying the affected strategy.

## Type Declaration

### metadata

```ts
metadata: object;
```

#### metadata.strategy

```ts
strategy: IDcaStrategy;
```

### type

```ts
type: ResumeStrategy;
```
