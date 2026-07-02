# Variable: SDKErrorDataSchema

```ts
const SDKErrorDataSchema: ZodObject<{
  message: ZodString;
  reason: ZodString;
  type: ZodNativeEnum<typeof SDKErrorType>;
}, "strip", ZodTypeAny, {
  message: string;
  reason: string;
  type: SDKErrorType;
}, {
  message: string;
  reason: string;
  type: SDKErrorType;
}>;
```

Defined in: [../sdk-common/src/common/interfaces/ISDKError.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L27)

Zod schema for ISDKError
