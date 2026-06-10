# Variable: ArmadaVaultDataSchema

```ts
const ArmadaVaultDataSchema: ZodObject<{
  id: ZodType<IArmadaVaultId, ZodTypeDef, IArmadaVaultId>;
  type: ZodLiteral<Armada>;
}, "strip", ZodTypeAny, {
  id: IArmadaVaultId;
  type: Armada;
}, {
  id: IArmadaVaultId;
  type: Armada;
}>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaVault.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IArmadaVault.ts#L28)

## Description

Zod schema for IArmadaVault
