# Variable: PositionsManagerDataSchema

```ts
const PositionsManagerDataSchema: ZodObject<{
  address: ZodObject<{
     type: ZodNativeEnum<typeof AddressType>;
     value: ZodType<`0x${string}`, ZodTypeDef, `0x${string}`>;
   }, "strip", ZodTypeAny, {
     type: AddressType;
     value: `0x${string}`;
   }, {
     type: AddressType;
     value: `0x${string}`;
  }>;
}, "strip", ZodTypeAny, {
  address: {
     type: AddressType;
     value: `0x${string}`;
  };
}, {
  address: {
     type: AddressType;
     value: `0x${string}`;
  };
}>;
```

Defined in: [../sdk-common/src/orders/common/interfaces/IPositionsManager.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/interfaces/IPositionsManager.ts#L18)

## Description

Zod schema for IPositionsManager
