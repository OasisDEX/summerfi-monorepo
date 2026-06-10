# Variable: FiatCurrencyAmountDataSchema

```ts
const FiatCurrencyAmountDataSchema: ZodObject<{
  amount: ZodString;
  fiat: ZodNativeEnum<typeof FiatCurrency>;
}, "strip", ZodTypeAny, {
  amount: string;
  fiat: FiatCurrency;
}, {
  amount: string;
  fiat: FiatCurrency;
}>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts#L85)

## Description

Zod schema for IFiatCurrencyAmount
