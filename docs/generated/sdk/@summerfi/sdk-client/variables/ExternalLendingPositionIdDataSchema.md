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

Defined in: [sdk/sdk-common/src/orders/importing/interfaces/IExternalLendingPositionId.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/orders/importing/interfaces/IExternalLendingPositionId.ts#L38)

## Description

Zod schema for IExternalPositionId
