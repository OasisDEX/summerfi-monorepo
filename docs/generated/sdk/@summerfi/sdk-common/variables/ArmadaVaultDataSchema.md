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

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaVault.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IArmadaVault.ts#L28)

## Description

Zod schema for IArmadaVault
