# Variable: ProtocolDataSchema

```ts
const ProtocolDataSchema: ZodObject<{
  chainInfo: ZodType<IChainInfo, ZodTypeDef, IChainInfo>;
  name: ZodNativeEnum<typeof ProtocolName>;
}, "strip", ZodTypeAny, {
  chainInfo: IChainInfo;
  name: ProtocolName;
}, {
  chainInfo: IChainInfo;
  name: ProtocolName;
}>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IProtocol.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IProtocol.ts#L37)

## Description

Zod schema for IProtocol
