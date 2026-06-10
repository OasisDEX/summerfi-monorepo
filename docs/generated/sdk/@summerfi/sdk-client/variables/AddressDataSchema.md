# Variable: AddressDataSchema

```ts
const AddressDataSchema: ZodObject<{
  type: ZodNativeEnum<typeof AddressType>;
  value: ZodType<`0x${string}`, ZodTypeDef, `0x${string}`>;
}, "strip", ZodTypeAny, {
  type: AddressType;
  value: `0x${string}`;
}, {
  type: AddressType;
  value: `0x${string}`;
}>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IAddress.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IAddress.ts#L41)

## Description

Zod schema for IAddress
