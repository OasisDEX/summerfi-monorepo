# Type Alias: TransactionMetadataWithdraw

```ts
type TransactionMetadataWithdraw = object;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:83](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L83)

Metadata for a withdrawal transaction: amounts, optional price impact and slippage.

## Properties

### fromAmount

```ts
fromAmount: ITokenAmount;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:84](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L84)

***

### priceImpact?

```ts
optional priceImpact: TransactionPriceImpact;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:86](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L86)

***

### slippage

```ts
slippage: IPercentage;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:87](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L87)

***

### toAmount?

```ts
optional toAmount: ITokenAmount;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L85)
