# Variable: ChainInfoDataSchema

```ts
const ChainInfoDataSchema: ZodObject<{
  chainId: ZodUnion<[ZodUnion<[ZodLiteral<1 | 146 | 999 | 8453 | 42161>, ZodLiteral<1 | 146 | 999 | 8453 | 42161>, ...ZodLiteral<1 | 146 | 999 | 8453 | 42161>[]]>, ZodUnion<[ZodLiteral<1 | 10 | 146 | 8453 | 42161>, ZodLiteral<1 | 10 | 146 | 8453 | 42161>, ...ZodLiteral<1 | 10 | 146 | 8453 | 42161>[]]>]>;
  name: ZodString;
}, "strip", ZodTypeAny, {
  chainId: 1 | 10 | 146 | 999 | 8453 | 42161;
  name: string;
}, {
  chainId: 1 | 10 | 146 | 999 | 8453 | 42161;
  name: string;
}>;
```

Defined in: [../sdk-common/src/common/interfaces/IChainInfo.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainInfo.ts#L35)

Zod schema for IChainInfo
