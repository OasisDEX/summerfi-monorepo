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

Defined in: [src/orders/importing/interfaces/IExternalLendingPositionId.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPositionId.ts#L37)

Zod schema for IExternalPositionId
