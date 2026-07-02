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

Defined in: [../sdk-common/src/common/interfaces/IPosition.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L28)

Zod schema for IPosition
