# Variable: SwapErrorDataSchema

```ts
const SwapErrorDataSchema: ZodObject<{
  apiQuery: ZodString;
  message: ZodString;
  reason: ZodString;
  statusCode: ZodNumber;
  subtype: ZodNativeEnum<typeof SwapErrorType>;
  type: ZodLiteral<SwapError>;
}, "strip", ZodTypeAny, {
  apiQuery: string;
  message: string;
  reason: string;
  statusCode: number;
  subtype: SwapErrorType;
  type: SwapError;
}, {
  apiQuery: string;
  message: string;
  reason: string;
  statusCode: number;
  subtype: SwapErrorType;
  type: SwapError;
}>;
```

Defined in: [../sdk-common/src/swap/interfaces/ISwapError.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/interfaces/ISwapError.ts#L29)

Zod schema for ISwapError
