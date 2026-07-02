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

Defined in: [../sdk-common/src/common/interfaces/IPoolInfo.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolInfo.ts#L27)

Zod schema for IPoolInfo
