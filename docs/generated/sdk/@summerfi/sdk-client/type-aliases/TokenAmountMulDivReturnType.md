# Type Alias: TokenAmountMulDivReturnType\<T\>

```ts
type TokenAmountMulDivReturnType<T> = T extends IPrice ? 
  | ITokenAmount
  | IFiatCurrencyAmount : T extends IPercentage | string | number ? ITokenAmount : never;
```

Defined in: [sdk/sdk-common/src/common/interfaces/ITokenAmount.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/ITokenAmount.ts#L21)

Infers the result type of multiplying/dividing a token amount by an operand of type `T`.

## Type Parameters

### T

`T`
