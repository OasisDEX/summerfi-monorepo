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

Defined in: [sdk/sdk-common/src/common/interfaces/IPoolId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IPoolId.ts#L29)

## Description

Zod schema for IPoolId
