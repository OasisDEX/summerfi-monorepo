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

Defined in: [sdk/sdk-common/src/common/interfaces/IPositionId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IPositionId.ts#L25)

## Description

Zod schema for IPositionId
