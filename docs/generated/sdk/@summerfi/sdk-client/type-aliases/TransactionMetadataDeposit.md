# Type Alias: TransactionMetadataDeposit

```ts
type TransactionMetadataDeposit = object;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:72](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L72)

Metadata for a deposit transaction: amounts, optional price impact and slippage.

## Properties

### fromAmount

```ts
fromAmount: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:73](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L73)

***

### priceImpact?

```ts
optional priceImpact: TransactionPriceImpact;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:75](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L75)

***

### slippage

```ts
slippage: IPercentage;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:76](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L76)

***

### toAmount?

```ts
optional toAmount: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:74](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L74)
