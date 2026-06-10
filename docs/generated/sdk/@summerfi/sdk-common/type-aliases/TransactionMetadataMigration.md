# Type Alias: TransactionMetadataMigration

```ts
type TransactionMetadataMigration = object;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:113](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L113)

Metadata for a migration transaction: per-position swap amounts and price impacts.

## Properties

### priceImpactByPositionId

```ts
priceImpactByPositionId: Record<string, TransactionPriceImpact>;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:115](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L115)

***

### swapAmountByPositionId

```ts
swapAmountByPositionId: Record<string, ITokenAmount>;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:114](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L114)
