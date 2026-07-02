# Variable: ArmadaProtocolDataSchema

```ts
const ArmadaProtocolDataSchema: ZodObject<{
  chainInfo: ZodType<IChainInfo, ZodTypeDef, IChainInfo>;
  name: ZodLiteral<Armada>;
}, "strip", ZodTypeAny, {
  chainInfo: IChainInfo;
  name: Armada;
}, {
  chainInfo: IChainInfo;
  name: Armada;
}>;
```

Defined in: [src/common/interfaces/IArmadaProtocol.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaProtocol.ts#L24)

Zod schema for IArmadaProtocol
