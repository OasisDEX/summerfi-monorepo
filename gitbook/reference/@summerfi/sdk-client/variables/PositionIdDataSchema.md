# Variable: PositionIdDataSchema

```ts
const PositionIdDataSchema: ZodObject<{
  id: ZodString;
  type: ZodNativeEnum<typeof PositionType>;
}, "strip", ZodTypeAny, {
  id: string;
  type: PositionType;
}, {
  id: string;
  type: PositionType;
}>;
```

Defined in: [../sdk-common/src/common/interfaces/IPositionId.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L24)

Zod schema for IPositionId
