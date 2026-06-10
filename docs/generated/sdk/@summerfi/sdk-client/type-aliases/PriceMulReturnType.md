# Type Alias: PriceMulReturnType\<T\>

```ts
type PriceMulReturnType<T> = T extends ITokenAmount ? 
  | ITokenAmount
  | IFiatCurrencyAmount : T extends IFiatCurrencyAmount ? 
  | IFiatCurrencyAmount
  | ITokenAmount : IPrice;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IPrice.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IPrice.ts#L27)

Infers the result type of multiplying a price by an operand of type `T`.

## Type Parameters

### T

`T`
