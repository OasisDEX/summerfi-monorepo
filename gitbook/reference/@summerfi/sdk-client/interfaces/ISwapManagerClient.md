# Interface: ISwapManagerClient

Defined in: [src/interfaces/ISwapManagerClient.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISwapManagerClient.ts#L8)

Interface for the SwapManager client implementation.

## See

ISwapManager

## Methods

### getSwapQuoteExactInput()

```ts
getSwapQuoteExactInput(params): Promise<QuoteDataStanalone>;
```

Defined in: [src/interfaces/ISwapManagerClient.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISwapManagerClient.ts#L18)

Retrieves a swap quote for a given input amount and token

#### Parameters

##### params

###### fromAmount

[`ITokenAmount`](ITokenAmount.md)

The amount to swap

###### slippage

[`IPercentage`](IPercentage.md)

The slippage for the swap

###### toToken

[`ITokenStanalone`](ITokenStanalone.md)

The token to swap to

#### Returns

`Promise`\<[`QuoteDataStanalone`](../type-aliases/QuoteDataStanalone.md)\>

The swap quote for the given input amount and token
