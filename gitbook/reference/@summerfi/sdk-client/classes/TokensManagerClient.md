# Class: TokensManagerClient

Defined in: [src/implementation/TokensManagerClient.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient.ts#L9)

Implementation of the ITokensManager interface for the SDK Client

## Extends

- `IRPCClient`

## Implements

- [`ITokensManagerClient`](../interfaces/ITokensManagerClient.md)

## Constructors

### Constructor

```ts
new TokensManagerClient(params): TokensManagerClient;
```

Defined in: [src/implementation/TokensManagerClient.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient.ts#L12)

#### Parameters

##### params

###### chainInfo

[`ChainInfo`](ChainInfo.md)

###### rpcClient

`TRPCClient`

#### Returns

`TokensManagerClient`

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
getTokenByAddress(params): Promise<ITokenStanalone>;
```

Defined in: [src/implementation/TokensManagerClient.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient.ts#L27)

#### Parameters

##### params

###### address

[`Address`](Address.md)

#### Returns

`Promise`\<[`ITokenStanalone`](../interfaces/ITokenStanalone.md)\>

#### See

ITokensManagerClient.getTokenByAddress

#### Implementation of

[`ITokensManagerClient`](../interfaces/ITokensManagerClient.md).[`getTokenByAddress`](../interfaces/ITokensManagerClient.md#gettokenbyaddress)

***

### getTokenByName()

```ts
getTokenByName(_params): Promise<ITokenStanalone>;
```

Defined in: [src/implementation/TokensManagerClient.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient.ts#L35)

#### Parameters

##### \_params

###### name

`string`

#### Returns

`Promise`\<[`ITokenStanalone`](../interfaces/ITokenStanalone.md)\>

#### See

ITokensManagerClient.getTokenByName

#### Implementation of

[`ITokensManagerClient`](../interfaces/ITokensManagerClient.md).[`getTokenByName`](../interfaces/ITokensManagerClient.md#gettokenbyname)

***

### getTokenBySymbol()

```ts
getTokenBySymbol(params): Promise<ITokenStanalone>;
```

Defined in: [src/implementation/TokensManagerClient.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/TokensManagerClient.ts#L19)

#### Parameters

##### params

###### symbol

`string`

#### Returns

`Promise`\<[`ITokenStanalone`](../interfaces/ITokenStanalone.md)\>

#### See

ITokensManagerClient.getTokenBySymbol

#### Implementation of

[`ITokensManagerClient`](../interfaces/ITokensManagerClient.md).[`getTokenBySymbol`](../interfaces/ITokensManagerClient.md#gettokenbysymbol)
