# Function: isSDKError()

```ts
function isSDKError(maybeErrorData): maybeErrorData is Readonly<{ message: string; reason: string; type: SDKErrorType }>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/ISDKError.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/ISDKError.ts#L44)

## Parameters

### maybeErrorData

`unknown`

## Returns

`maybeErrorData is Readonly<{ message: string; reason: string; type: SDKErrorType }>`

true if the object is an ISDKError

## Description

Type guard for ISDKError
