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

Defined in: [src/common/interfaces/IPoolId.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L28)

Zod schema for IPoolId
