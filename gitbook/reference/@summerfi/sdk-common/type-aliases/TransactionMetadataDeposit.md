# Type Alias: TransactionMetadataDeposit

```ts
type TransactionMetadataDeposit = object;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:70](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L70)

Metadata for a deposit transaction: amounts, optional price impact and slippage.

## Properties

### fromAmount

```ts
fromAmount: ITokenAmount;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:71](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L71)

***

### priceImpact?

```ts
optional priceImpact: TransactionPriceImpact;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:73](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L73)

***

### slippage

```ts
slippage: IPercentage;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:74](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L74)

***

### toAmount?

```ts
optional toAmount: ITokenAmount;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:72](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L72)
