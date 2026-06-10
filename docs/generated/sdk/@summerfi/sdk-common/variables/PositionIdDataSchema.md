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

Defined in: [src/common/interfaces/IPositionId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L25)

## Description

Zod schema for IPositionId
