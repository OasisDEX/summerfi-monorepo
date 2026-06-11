# Type Alias: TransactionMetadataMigration

```ts
type TransactionMetadataMigration = object;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:113](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L113)

Metadata for a migration transaction: per-position swap amounts and price impacts.

## Properties

### priceImpactByPositionId

```ts
priceImpactByPositionId: Record<string, TransactionPriceImpact>;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:115](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L115)

***

### swapAmountByPositionId

```ts
swapAmountByPositionId: Record<string, ITokenAmount>;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:114](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L114)
