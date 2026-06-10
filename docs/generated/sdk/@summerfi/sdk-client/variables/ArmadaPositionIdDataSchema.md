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

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaPositionId.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IArmadaPositionId.ts#L28)

## Description

Zod schema for IArmadaPositionId
