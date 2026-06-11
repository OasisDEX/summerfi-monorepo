# Function: isSDKError()

```ts
function isSDKError(maybeErrorData): maybeErrorData is Readonly<{ message: string; reason: string; type: SDKErrorType }>;
```

Defined in: [src/common/interfaces/ISDKError.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L44)

## Parameters

### maybeErrorData

`unknown`

## Returns

`maybeErrorData is Readonly<{ message: string; reason: string; type: SDKErrorType }>`

true if the object is an ISDKError

## Description

Type guard for ISDKError
