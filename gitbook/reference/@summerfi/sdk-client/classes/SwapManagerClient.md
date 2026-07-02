# Class: SwapManagerClient

Defined in: [src/implementation/SwapManagerClient.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/SwapManagerClient.ts#L9)

Implementation of the ISwapManagerClient interface for the SDK Client

## Extends

- `IRPCClient`

## Implements

- [`ISwapManagerClient`](../interfaces/ISwapManagerClient.md)

## Constructors

### Constructor

```ts
new SwapManagerClient(params): SwapManagerClient;
```

Defined in: [src/implementation/SwapManagerClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/SwapManagerClient.ts#L10)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`SwapManagerClient`

#### Overrides

```ts
IRPCClient.constructor
```

## Accessors

### rpcClient

#### Get Signature

```ts
get protected rpcClient(): TRPCClient;
```

Defined in: [src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IRPCClient.ts#L10)

##### Returns

`TRPCClient`

#### Inherited from

```ts
IRPCClient.rpcClient
```

## Methods

### getSwapQuoteExactInput()

```ts
getSwapQuoteExactInput(params): Promise<QuoteDataStanalone>;
```

Defined in: [src/implementation/SwapManagerClient.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/SwapManagerClient.ts#L15)

#### Parameters

##### params

###### fromAmount

[`TokenAmount`](TokenAmount.md)

###### slippage

[`Percentage`](Percentage.md)

###### toToken

[`Token`](Token.md)

#### Returns

`Promise`\<[`QuoteDataStanalone`](../type-aliases/QuoteDataStanalone.md)\>

#### See

ISwapManagerClient.getSwapQuoteExactInput

#### Implementation of

[`ISwapManagerClient`](../interfaces/ISwapManagerClient.md).[`getSwapQuoteExactInput`](../interfaces/ISwapManagerClient.md#getswapquoteexactinput)
