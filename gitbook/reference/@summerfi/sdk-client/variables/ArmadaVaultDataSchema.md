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

Defined in: [../sdk-common/src/common/interfaces/IArmadaVault.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVault.ts#L27)

Zod schema for IArmadaVault
