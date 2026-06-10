# Variable: ExternalLendingPositionIdDataSchema

```ts
const ExternalLendingPositionIdDataSchema: ZodObject<{
  address: ZodType<IAddress, ZodTypeDef, IAddress>;
  externalType: ZodNativeEnum<typeof ExternalLendingPositionType>;
  id: ZodString;
  protocolId: ZodType<ILendingPositionId, ZodTypeDef, ILendingPositionId>;
  type: ZodLiteral<Lending>;
}, "strip", ZodTypeAny, {
  address: IAddress;
  externalType: ExternalLendingPositionType;
  id: string;
  protocolId: ILendingPositionId;
  type: Lending;
}, {
  address: IAddress;
  externalType: ExternalLendingPositionType;
  id: string;
  protocolId: ILendingPositionId;
  type: Lending;
}>;
```

Defined in: [sdk/sdk-common/src/orders/importing/interfaces/IExternalLendingPositionId.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/importing/interfaces/IExternalLendingPositionId.ts#L38)

## Description

Zod schema for IExternalPositionId
