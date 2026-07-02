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

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L36)

Zod schema for IProtocol
