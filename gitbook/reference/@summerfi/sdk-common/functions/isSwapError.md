# Function: isSwapError()

```ts
function isSwapError(maybeSwapErrorData): maybeSwapErrorData is Readonly<{ apiQuery: string; message: string; reason: string; statusCode: number; subtype: SwapErrorType; type: SwapError }>;
```

Defined in: [src/swap/interfaces/ISwapError.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/interfaces/ISwapError.ts#L48)

## Parameters

### maybeSwapErrorData

`unknown`

## Returns

`maybeSwapErrorData is Readonly<{ apiQuery: string; message: string; reason: string; statusCode: number; subtype: SwapErrorType; type: SwapError }>`

true if the object is an ISwapError

## Description

Type guard for ISwapError
