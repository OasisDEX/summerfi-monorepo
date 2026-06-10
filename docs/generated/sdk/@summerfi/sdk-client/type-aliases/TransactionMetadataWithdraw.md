# Type Alias: TransactionMetadataWithdraw

```ts
type TransactionMetadataWithdraw = object;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L85)

Metadata for a withdrawal transaction: amounts, optional price impact and slippage.

## Properties

### fromAmount

```ts
fromAmount: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:86](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L86)

***

### priceImpact?

```ts
optional priceImpact: TransactionPriceImpact;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:88](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L88)

***

### slippage

```ts
slippage: IPercentage;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:89](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L89)

***

### toAmount?

```ts
optional toAmount: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:87](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L87)
