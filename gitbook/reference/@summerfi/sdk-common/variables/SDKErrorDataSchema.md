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

Defined in: [src/common/interfaces/ISDKError.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L28)

## Description

Zod schema for ISDKError
