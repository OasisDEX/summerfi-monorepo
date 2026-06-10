# Variable: ArmadaPositionIdDataSchema

```ts
const ArmadaPositionIdDataSchema: ZodObject<{
  id: ZodString;
  type: ZodLiteral<Armada>;
  user: ZodType<IUser, ZodTypeDef, IUser>;
}, "strip", ZodTypeAny, {
  id: string;
  type: Armada;
  user: IUser;
}, {
  id: string;
  type: Armada;
  user: IUser;
}>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaPositionId.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IArmadaPositionId.ts#L28)

## Description

Zod schema for IArmadaPositionId
