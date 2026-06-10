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

Defined in: [sdk/sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts#L34)

## Description

Zod schema for ILendingPoolId
