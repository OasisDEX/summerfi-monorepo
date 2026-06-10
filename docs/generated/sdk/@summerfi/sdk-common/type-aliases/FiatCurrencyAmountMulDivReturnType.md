# Type Alias: FiatCurrencyAmountMulDivReturnType\<T\>

```ts
type FiatCurrencyAmountMulDivReturnType<T> = T extends IPrice ? 
  | ITokenAmount
  | IFiatCurrencyAmount : T extends IPercentage | string | number ? ITokenAmount : never;
```

Defined in: [src/common/interfaces/IFiatCurrencyAmount.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L21)

Infers the result type of multiplying/dividing a fiat currency amount by an operand of type `T`.

## Type Parameters

### T

`T`
