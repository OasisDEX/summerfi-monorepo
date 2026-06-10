# Function: isSwapError()

```ts
function isSwapError(maybeSwapErrorData): maybeSwapErrorData is Readonly<{ apiQuery: string; message: string; reason: string; statusCode: number; subtype: SwapErrorType; type: SwapError }>;
```

Defined in: [sdk/sdk-common/src/swap/interfaces/ISwapError.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/swap/interfaces/ISwapError.ts#L48)

## Parameters

### maybeSwapErrorData

`unknown`

## Returns

`maybeSwapErrorData is Readonly<{ apiQuery: string; message: string; reason: string; statusCode: number; subtype: SwapErrorType; type: SwapError }>`

true if the object is an ISwapError

## Description

Type guard for ISwapError
