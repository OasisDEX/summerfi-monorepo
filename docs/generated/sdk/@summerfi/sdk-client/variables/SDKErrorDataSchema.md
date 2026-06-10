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

Defined in: [sdk/sdk-common/src/common/interfaces/ISDKError.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/ISDKError.ts#L28)

## Description

Zod schema for ISDKError
