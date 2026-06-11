# Variable: PoolIdDataSchema

```ts
const PoolIdDataSchema: ZodObject<{
  protocol: ZodType<IProtocol, ZodTypeDef, IProtocol>;
  type: ZodNativeEnum<typeof PoolType>;
}, "strip", ZodTypeAny, {
  protocol: IProtocol;
  type: PoolType;
}, {
  protocol: IProtocol;
  type: PoolType;
}>;
```

Defined in: [src/common/interfaces/IPoolId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L29)

## Description

Zod schema for IPoolId
