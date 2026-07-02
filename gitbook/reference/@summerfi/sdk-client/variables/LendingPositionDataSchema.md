# Variable: LendingPositionDataSchema

```ts
const LendingPositionDataSchema: ZodObject<{
  collateralAmount: ZodType<ITokenAmount, ZodTypeDef, ITokenAmount>;
  debtAmount: ZodType<ITokenAmount, ZodTypeDef, ITokenAmount>;
  id: ZodType<ILendingPositionId, ZodTypeDef, ILendingPositionId>;
  pool: ZodType<ILendingPool, ZodTypeDef, ILendingPool>;
  subtype: ZodNativeEnum<typeof LendingPositionType>;
  type: ZodLiteral<Lending>;
}, "strip", ZodTypeAny, {
  collateralAmount: ITokenAmount;
  debtAmount: ITokenAmount;
  id: ILendingPositionId;
  pool: ILendingPool;
  subtype: LendingPositionType;
  type: Lending;
}, {
  collateralAmount: ITokenAmount;
  debtAmount: ITokenAmount;
  id: ILendingPositionId;
  pool: ILendingPool;
  subtype: LendingPositionType;
  type: Lending;
}>;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPosition.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L38)

Zod schema for ILendingPosition
