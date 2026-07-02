# Interface: IChain

Defined in: [src/interfaces/IChain.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IChain.ts#L8)

Represents a blockchain network and allows to access the tokens and protocols of the chain

## Properties

### chainInfo

```ts
chainInfo: IChainInfo;
```

Defined in: [src/interfaces/IChain.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IChain.ts#L10)

The information of the chain

***

### protocols

```ts
protocols: IProtocolsManagerClient;
```

Defined in: [src/interfaces/IChain.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IChain.ts#L14)

The protocols manager client for the chain, allows to retrieve protocols on the chain

***

### tokens

```ts
tokens: ITokensManagerClient;
```

Defined in: [src/interfaces/IChain.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IChain.ts#L12)

The tokens manager client for the chain, allows to retrieve tokens on the chain
