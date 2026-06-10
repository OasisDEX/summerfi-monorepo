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

Defined in: [sdk/sdk-common/src/common/interfaces/IPool.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IPool.ts#L30)

## Description

Zod schema for IPool
