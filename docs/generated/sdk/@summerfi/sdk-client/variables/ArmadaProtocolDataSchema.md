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

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaProtocol.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IArmadaProtocol.ts#L25)

## Description

Zod schema for IArmadaProtocol
