# Interface: ITokensManagerClient

Defined in: [src/interfaces/ITokensManagerClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ITokensManagerClient.ts#L10)

Interface for the TokensManager client implementation. Allows to retrieve information for
a Token given its Chain, and its Address or symbol. The difference with the server side
is that it stores the chain info internally and passes it as a parameter to the RPC calls

## See

ITokensManager

## Methods

### getTokenByAddress()

```ts
getTokenByAddress(params): Promise<Token>;
```

Defined in: [src/interfaces/ITokensManagerClient.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ITokensManagerClient.ts#L27)

Retrieves a token by its address

#### Parameters

##### params

###### address

[`Address`](../classes/Address.md)

The address of the token to retrieve

#### Returns

`Promise`\<[`Token`](../classes/Token.md)\>

The token with the given address

***

### getTokenByName()

```ts
getTokenByName(params): Promise<Token>;
```

Defined in: [src/interfaces/ITokensManagerClient.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ITokensManagerClient.ts#L36)

Retrieves a token by its name

#### Parameters

##### params

###### name

`string`

The name of the token to retrieve

#### Returns

`Promise`\<[`Token`](../classes/Token.md)\>

The token with the given name

***

### getTokenBySymbol()

```ts
getTokenBySymbol(params): Promise<Token>;
```

Defined in: [src/interfaces/ITokensManagerClient.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ITokensManagerClient.ts#L18)

Retrieves a token by its symbol

#### Parameters

##### params

###### symbol

`string`

The symbol of the token to retrieve

#### Returns

`Promise`\<[`Token`](../classes/Token.md)\>

The token with the given symbol
