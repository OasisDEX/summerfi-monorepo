# Variable: LendingPoolIdDataSchema

```ts
const LendingPoolIdDataSchema: ZodObject<{
  protocol: ZodType<IProtocol, ZodTypeDef, IProtocol>;
  type: ZodLiteral<Lending>;
}, "strip", ZodTypeAny, {
  protocol: IProtocol;
  type: Lending;
}, {
  protocol: IProtocol;
  type: Lending;
}>;
```

Defined in: [src/lending-protocols/interfaces/ILendingPoolId.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L33)

Zod schema for ILendingPoolId
