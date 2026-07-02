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

Defined in: [../sdk-common/src/common/interfaces/IAddress.ts:40](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IAddress.ts#L40)

Zod schema for IAddress
