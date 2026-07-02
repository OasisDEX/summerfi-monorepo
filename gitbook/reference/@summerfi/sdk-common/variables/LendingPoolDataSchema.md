# Variable: LendingPoolDataSchema

```ts
const LendingPoolDataSchema: ZodObject<{
  collateralToken: ZodType<ITokenStanalone, ZodTypeDef, ITokenStanalone>;
  debtToken: ZodType<ITokenStanalone, ZodTypeDef, ITokenStanalone>;
  id: ZodType<ILendingPoolId, ZodTypeDef, ILendingPoolId>;
  type: ZodLiteral<Lending>;
}, "strip", ZodTypeAny, {
  collateralToken: ITokenStanalone;
  debtToken: ITokenStanalone;
  id: ILendingPoolId;
  type: Lending;
}, {
  collateralToken: ITokenStanalone;
  debtToken: ITokenStanalone;
  id: ILendingPoolId;
  type: Lending;
}>;
```

Defined in: [src/lending-protocols/interfaces/ILendingPool.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPool.ts#L38)

Zod schema for ILendingPool
