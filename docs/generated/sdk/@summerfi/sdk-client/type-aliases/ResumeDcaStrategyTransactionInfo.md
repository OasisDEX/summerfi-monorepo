# Type Alias: ResumeDcaStrategyTransactionInfo

```ts
type ResumeDcaStrategyTransactionInfo = TransactionInfo & object;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:201](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L201)

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
