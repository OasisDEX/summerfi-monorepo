# Type Alias: TransactionMetadataMigration

```ts
type TransactionMetadataMigration = object;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:111](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L111)

Metadata for a migration transaction: per-position swap amounts and price impacts.

## Properties

### priceImpactByPositionId

```ts
priceImpactByPositionId: Record<string, TransactionPriceImpact>;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:113](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L113)

***

### swapAmountByPositionId

```ts
swapAmountByPositionId: Record<string, ITokenAmount>;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:112](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L112)
