# Type Alias: TransactionMetadataVaultSwitch

```ts
type TransactionMetadataVaultSwitch = object;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:98](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L98)

Metadata for a vault-switch transaction: source/target vaults, amounts, price impact and slippage.

## Properties

### fromAmount

```ts
fromAmount: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:101](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L101)

***

### fromVault

```ts
fromVault: IArmadaVaultId;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:99](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L99)

***

### priceImpact?

```ts
optional priceImpact: TransactionPriceImpact;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:103](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L103)

***

### slippage

```ts
slippage: IPercentage;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:104](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L104)

***

### toAmount?

```ts
optional toAmount: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:102](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L102)

***

### toVault

```ts
toVault: IArmadaVaultId;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:100](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L100)
