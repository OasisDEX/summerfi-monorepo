# Type Alias: ResumeDcaStrategyTransactionInfo

```ts
type ResumeDcaStrategyTransactionInfo = TransactionInfo & object;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:209](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L209)

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
