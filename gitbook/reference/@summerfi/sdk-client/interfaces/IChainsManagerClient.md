# Interface: IChainsManagerClient

Defined in: [src/interfaces/IChainsManager.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IChainsManager.ts#L8)

Interface for the ChainsManager client implementation. Allows to retrieve information for
a Chain given its ChainInfo. It also supports to lookup a chain by its name or chain ID

## Methods

### getChain()

```ts
getChain(params): Promise<Chain>;
```

Defined in: [src/interfaces/IChainsManager.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IChainsManager.ts#L16)

Retrieves a chain by its chain info

#### Parameters

##### params

###### chainInfo

[`ChainInfo`](../classes/ChainInfo.md)

#### Returns

`Promise`\<[`Chain`](../classes/Chain.md)\>

The chain for the given chain info

***

### getChainById()

```ts
getChainById(params): Promise<Maybe<Chain>>;
```

Defined in: [src/interfaces/IChainsManager.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IChainsManager.ts#L25)

Retrieves a network by its chain ID

#### Parameters

##### params

###### chainId

`number`

#### Returns

`Promise`\<[`Maybe`](../type-aliases/Maybe.md)\<[`Chain`](../classes/Chain.md)\>\>

The network with the given chain ID
