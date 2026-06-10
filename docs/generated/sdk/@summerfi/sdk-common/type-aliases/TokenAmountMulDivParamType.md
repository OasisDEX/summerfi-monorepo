# Type Alias: TokenAmountMulDivParamType

```ts
type TokenAmountMulDivParamType = 
  | string
  | number
  | IPrice
  | IPercentage;
```

Defined in: [sdk/sdk-common/src/common/interfaces/ITokenAmount.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/ITokenAmount.ts#L19)

Return Type narrowing for multiply and divide methods, so the return type can be properly inferred

This helps callers to know what to expect from the result of the operation
