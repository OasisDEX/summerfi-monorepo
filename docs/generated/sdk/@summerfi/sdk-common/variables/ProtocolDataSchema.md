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

Defined in: [sdk/sdk-common/src/common/interfaces/IProtocol.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IProtocol.ts#L37)

## Description

Zod schema for IProtocol
