# Type Alias: TransactionMetadataDeposit

```ts
type TransactionMetadataDeposit = object;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:71](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L71)

Metadata for a deposit transaction: amounts, optional price impact and slippage.

## Properties

### fromAmount

```ts
fromAmount: ITokenAmount;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:72](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L72)

***

### priceImpact?

```ts
optional priceImpact: TransactionPriceImpact;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:74](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L74)

***

### slippage

```ts
slippage: IPercentage;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:75](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L75)

***

### toAmount?

```ts
optional toAmount: ITokenAmount;
```

Defined in: [../sdk-common/src/orders/common/types/TransactionInfo.ts:73](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L73)
