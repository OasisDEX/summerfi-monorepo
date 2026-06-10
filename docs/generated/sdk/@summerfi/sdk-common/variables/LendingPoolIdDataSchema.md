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

Defined in: [sdk/sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts#L34)

## Description

Zod schema for ILendingPoolId
