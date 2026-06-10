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

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaProtocol.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IArmadaProtocol.ts#L25)

## Description

Zod schema for IArmadaProtocol
