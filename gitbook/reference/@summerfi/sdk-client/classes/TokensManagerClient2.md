# Class: TokensManagerClient2

Defined in: [src/implementation/TokensManagerClient2.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient2.ts#L9)

Implementation of the ITokensManagerClient2 interface for the SDK Client

## Extends

- `IRPCClient`

## Implements

- [`ITokensManagerClient2`](../interfaces/ITokensManagerClient2.md)

## Constructors

### Constructor

```ts
new TokensManagerClient2(params): TokensManagerClient2;
```

Defined in: [src/implementation/TokensManagerClient2.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient2.ts#L10)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`TokensManagerClient2`

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

### getTokenByAddress()

```ts
getTokenByAddress(params): Promise<Token>;
```

Defined in: [src/implementation/TokensManagerClient2.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient2.ts#L25)

#### Parameters

##### params

###### addressValue

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

#### Returns

`Promise`\<[`Token`](Token.md)\>

#### See

ITokensManagerClient2.getTokenByAddress

#### Implementation of

[`ITokensManagerClient2`](../interfaces/ITokensManagerClient2.md).[`getTokenByAddress`](../interfaces/ITokensManagerClient2.md#gettokenbyaddress)

***

### getTokenBySymbol()

```ts
getTokenBySymbol(params): Promise<Token>;
```

Defined in: [src/implementation/TokensManagerClient2.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient2.ts#L15)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### symbol

`string`

#### Returns

`Promise`\<[`Token`](Token.md)\>

#### See

ITokensManagerClient2.getTokenBySymbol

#### Implementation of

[`ITokensManagerClient2`](../interfaces/ITokensManagerClient2.md).[`getTokenBySymbol`](../interfaces/ITokensManagerClient2.md#gettokenbysymbol)
