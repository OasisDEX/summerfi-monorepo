# Variable: PositionDataSchema

```ts
const PositionDataSchema: ZodObject<{
  id: ZodType<IPositionId, ZodTypeDef, IPositionId>;
  pool: ZodType<IPool, ZodTypeDef, IPool>;
  type: ZodNativeEnum<typeof PositionType>;
}, "strip", ZodTypeAny, {
  id: IPositionId;
  pool: IPool;
  type: PositionType;
}, {
  id: IPositionId;
  pool: IPool;
  type: PositionType;
}>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IPosition.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IPosition.ts#L29)

## Description

Zod schema for IPosition
