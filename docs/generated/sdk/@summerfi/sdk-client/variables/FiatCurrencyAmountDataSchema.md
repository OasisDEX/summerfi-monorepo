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

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L85)

## Description

Zod schema for IFiatCurrencyAmount
