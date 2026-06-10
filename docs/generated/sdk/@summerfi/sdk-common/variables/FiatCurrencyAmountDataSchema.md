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

Defined in: [sdk/sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts#L85)

## Description

Zod schema for IFiatCurrencyAmount
