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

Defined in: [src/common/interfaces/IAddress.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IAddress.ts#L41)

## Description

Zod schema for IAddress
