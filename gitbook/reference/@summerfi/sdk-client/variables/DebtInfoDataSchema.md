# Variable: DebtInfoDataSchema

```ts
const DebtInfoDataSchema: ZodObject<{
  debtAvailable: ZodType<ITokenAmount, ZodTypeDef, ITokenAmount>;
  debtCeiling: ZodType<ITokenAmount, ZodTypeDef, ITokenAmount>;
  dustLimit: ZodType<ITokenAmount, ZodTypeDef, ITokenAmount>;
  interestRate: ZodType<IPercentage, ZodTypeDef, IPercentage>;
  originationFee: ZodType<IPercentage, ZodTypeDef, IPercentage>;
  price: ZodType<IPrice, ZodTypeDef, IPrice>;
  priceUSD: ZodType<IPrice, ZodTypeDef, IPrice>;
  token: ZodType<ITokenStanalone, ZodTypeDef, ITokenStanalone>;
  totalBorrowed: ZodType<ITokenAmount, ZodTypeDef, ITokenAmount>;
}, "strip", ZodTypeAny, {
  debtAvailable: ITokenAmount;
  debtCeiling: ITokenAmount;
  dustLimit: ITokenAmount;
  interestRate: IPercentage;
  originationFee: IPercentage;
  price: IPrice;
  priceUSD: IPrice;
  token: ITokenStanalone;
  totalBorrowed: ITokenAmount;
}, {
  debtAvailable: ITokenAmount;
  debtCeiling: ITokenAmount;
  dustLimit: ITokenAmount;
  interestRate: IPercentage;
  originationFee: IPercentage;
  price: IPrice;
  priceUSD: IPrice;
  token: ITokenStanalone;
  totalBorrowed: ITokenAmount;
}>;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L44)

Zod schema for IDebtInfo
