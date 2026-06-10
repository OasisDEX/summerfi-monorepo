# Type Alias: PriceMulReturnType\<T\>

```ts
type PriceMulReturnType<T> = T extends ITokenAmount ? 
  | ITokenAmount
  | IFiatCurrencyAmount : T extends IFiatCurrencyAmount ? 
  | IFiatCurrencyAmount
  | ITokenAmount : IPrice;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IPrice.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IPrice.ts#L27)

Infers the result type of multiplying a price by an operand of type `T`.

## Type Parameters

### T

`T`
