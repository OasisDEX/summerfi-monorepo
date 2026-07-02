# Variable: RefinanceParametersDataSchema

```ts
const RefinanceParametersDataSchema: ZodObject<{
  slippage: ZodType<IPercentage, ZodTypeDef, IPercentage>;
  sourcePosition: ZodType<ILendingPosition, ZodTypeDef, ILendingPosition>;
  targetPool: ZodType<ILendingPool, ZodTypeDef, ILendingPool>;
}, "strip", ZodTypeAny, {
  slippage: IPercentage;
  sourcePosition: ILendingPosition;
  targetPool: ILendingPool;
}, {
  slippage: IPercentage;
  sourcePosition: ILendingPosition;
  targetPool: ILendingPool;
}>;
```

Defined in: [src/orders/refinance/interfaces/IRefinanceParameters.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/refinance/interfaces/IRefinanceParameters.ts#L31)

Zod schema for the refinance parameters
