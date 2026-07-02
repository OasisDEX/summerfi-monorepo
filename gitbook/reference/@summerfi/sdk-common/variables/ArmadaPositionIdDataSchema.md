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

Defined in: [src/common/interfaces/IArmadaPositionId.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L27)

Zod schema for IArmadaPositionId
