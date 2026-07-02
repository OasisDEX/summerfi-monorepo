# Variable: LendingPoolInfoDataSchema

```ts
const LendingPoolInfoDataSchema: ZodObject<{
  collateral: ZodType<ICollateralInfo, ZodTypeDef, ICollateralInfo>;
  debt: ZodType<IDebtInfo, ZodTypeDef, IDebtInfo>;
  id: ZodType<ILendingPoolId, ZodTypeDef, ILendingPoolId>;
  type: ZodLiteral<Lending>;
}, "strip", ZodTypeAny, {
  collateral: ICollateralInfo;
  debt: IDebtInfo;
  id: ILendingPoolId;
  type: Lending;
}, {
  collateral: ICollateralInfo;
  debt: IDebtInfo;
  id: ILendingPoolId;
  type: Lending;
}>;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolInfo.ts:40](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolInfo.ts#L40)

Zod schema for ILendingPoolInfo
