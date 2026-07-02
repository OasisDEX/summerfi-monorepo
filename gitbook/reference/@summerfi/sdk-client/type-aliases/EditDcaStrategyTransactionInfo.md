# Type Alias: EditDcaStrategyTransactionInfo

```ts
type EditDcaStrategyTransactionInfo = TransactionInfo & object;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:188](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L188)

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
