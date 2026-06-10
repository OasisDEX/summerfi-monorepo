# Type Alias: EditDcaStrategyTransactionInfo

```ts
type EditDcaStrategyTransactionInfo = TransactionInfo & object;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:188](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L188)

Transaction info for editing a DCA strategy, carrying the updated strategy.

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
type: EditStrategy;
```
