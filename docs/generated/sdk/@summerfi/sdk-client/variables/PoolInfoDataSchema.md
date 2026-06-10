# Variable: PoolInfoDataSchema

```ts
const PoolInfoDataSchema: ZodObject<{
  id: ZodObject<{
     protocol: ZodType<IProtocol, ZodTypeDef, IProtocol>;
     type: ZodNativeEnum<typeof PoolType>;
   }, "strip", ZodTypeAny, {
     protocol: IProtocol;
     type: PoolType;
   }, {
     protocol: IProtocol;
     type: PoolType;
  }>;
  type: ZodNativeEnum<typeof PoolType>;
}, "strip", ZodTypeAny, {
  id: {
     protocol: IProtocol;
     type: PoolType;
  };
  type: PoolType;
}, {
  id: {
     protocol: IProtocol;
     type: PoolType;
  };
  type: PoolType;
}>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IPoolInfo.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IPoolInfo.ts#L28)

## Description

Zod schema for IPoolInfo
