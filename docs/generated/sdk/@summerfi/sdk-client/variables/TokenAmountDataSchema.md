# Variable: TokenAmountDataSchema

```ts
const TokenAmountDataSchema: ZodObject<{
  amount: ZodString;
  token: ZodType<ITokenStanalone, ZodTypeDef, ITokenStanalone>;
}, "strip", ZodTypeAny, {
  amount: string;
  token: ITokenStanalone;
}, {
  amount: string;
  token: ITokenStanalone;
}>;
```

Defined in: [../sdk-common/src/common/interfaces/ITokenAmount.ts:130](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L130)

## Description

Zod schema for ITokenAmount
