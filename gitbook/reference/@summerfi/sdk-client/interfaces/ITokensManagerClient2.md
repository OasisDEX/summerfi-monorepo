# Interface: ITokensManagerClient2

Defined in: [src/interfaces/ITokensManagerClient2.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ITokensManagerClient2.ts#L10)

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

Defined in: [src/interfaces/ITokensManagerClient2.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ITokensManagerClient2.ts#L27)

Retrieves a token by its address

#### Parameters

##### params

###### addressValue

`` `0x${string}` ``

The address of the token to retrieve

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

#### Returns

`Promise`\<[`Token`](../classes/Token.md)\>

The token with the given address

***

### getTokenBySymbol()

```ts
getTokenBySymbol(params): Promise<Token>;
```

Defined in: [src/interfaces/ITokensManagerClient2.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ITokensManagerClient2.ts#L18)

Retrieves a token by its symbol

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### symbol

`string`

The symbol of the token to retrieve

#### Returns

`Promise`\<[`Token`](../classes/Token.md)\>

The token with the given symbol
