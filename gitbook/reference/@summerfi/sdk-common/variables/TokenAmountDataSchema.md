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

Defined in: [src/common/interfaces/ITokenAmount.ts:125](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L125)

Zod schema for ITokenAmount
