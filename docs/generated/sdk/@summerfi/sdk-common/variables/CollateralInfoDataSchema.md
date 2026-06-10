# Variable: CollateralInfoDataSchema

```ts
const CollateralInfoDataSchema: ZodObject<{
  liquidationPenalty: ZodType<IPercentage, ZodTypeDef, IPercentage>;
  liquidationThreshold: ZodType<IRiskRatio, ZodTypeDef, IRiskRatio>;
  maxSupply: ZodType<ITokenAmount, ZodTypeDef, ITokenAmount>;
  price: ZodType<IPrice, ZodTypeDef, IPrice>;
  priceUSD: ZodType<IPrice, ZodTypeDef, IPrice>;
  token: ZodType<ITokenStanalone, ZodTypeDef, ITokenStanalone>;
  tokensLocked: ZodType<ITokenAmount, ZodTypeDef, ITokenAmount>;
}, "strip", ZodTypeAny, {
  liquidationPenalty: IPercentage;
  liquidationThreshold: IRiskRatio;
  maxSupply: ITokenAmount;
  price: IPrice;
  priceUSD: IPrice;
  token: ITokenStanalone;
  tokensLocked: ITokenAmount;
}, {
  liquidationPenalty: IPercentage;
  liquidationThreshold: IRiskRatio;
  maxSupply: ITokenAmount;
  price: IPrice;
  priceUSD: IPrice;
  token: ITokenStanalone;
  tokensLocked: ITokenAmount;
}>;
```

Defined in: [sdk/sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts#L39)

## Description

Zod schema for ICollateralInfo
