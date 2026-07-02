# Type Alias: TransactionMetadataVaultSwitch

```ts
type TransactionMetadataVaultSwitch = object;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:96](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L96)

Metadata for a vault-switch transaction: source/target vaults, amounts, price impact and slippage.

## Properties

### fromAmount

```ts
fromAmount: ITokenAmount;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:99](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L99)

***

### fromVault

```ts
fromVault: IArmadaVaultId;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:97](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L97)

***

### priceImpact?

```ts
optional priceImpact: TransactionPriceImpact;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:101](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L101)

***

### slippage

```ts
slippage: IPercentage;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:102](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L102)

***

### toAmount?

```ts
optional toAmount: ITokenAmount;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:100](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L100)

***

### toVault

```ts
toVault: IArmadaVaultId;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:98](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L98)
