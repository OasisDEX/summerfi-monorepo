# Variable: PoolDataSchema

```ts
const PoolDataSchema: ZodObject<{
  id: ZodType<IPoolId, ZodTypeDef, IPoolId>;
  type: ZodNativeEnum<typeof PoolType>;
}, "strip", ZodTypeAny, {
  id: IPoolId;
  type: PoolType;
}, {
  id: IPoolId;
  type: PoolType;
}>;
```

Defined in: [../sdk-common/src/common/interfaces/IPool.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPool.ts#L29)

Zod schema for IPool
