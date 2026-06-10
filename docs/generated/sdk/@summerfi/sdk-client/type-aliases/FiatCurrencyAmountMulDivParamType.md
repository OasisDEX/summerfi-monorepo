# Type Alias: FiatCurrencyAmountMulDivParamType

```ts
type FiatCurrencyAmountMulDivParamType = 
  | string
  | number
  | IPrice
  | IPercentage;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts#L19)

Return Type narrowing for multiply and divide methods, so the return type can be properly inferred

This helps callers to know what to expect from the result of the operation
