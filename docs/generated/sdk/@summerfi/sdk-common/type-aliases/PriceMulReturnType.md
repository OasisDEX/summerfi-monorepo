# Type Alias: PriceMulReturnType\<T\>

```ts
type PriceMulReturnType<T> = T extends ITokenAmount ? 
  | ITokenAmount
  | IFiatCurrencyAmount : T extends IFiatCurrencyAmount ? 
  | IFiatCurrencyAmount
  | ITokenAmount : IPrice;
```

Defined in: [src/common/interfaces/IPrice.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrice.ts#L27)

Infers the result type of multiplying a price by an operand of type `T`.

## Type Parameters

### T

`T`
