# Class: Chain

Defined in: [src/implementation/Chain.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/Chain.ts#L11)

Implementation of the IChain interface for the SDK Client

## Implements

- [`IChain`](../interfaces/IChain.md)

## Constructors

### Constructor

```ts
new Chain(params): Chain;
```

Defined in: [src/implementation/Chain.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/Chain.ts#L16)

#### Parameters

##### params

###### chainInfo

[`ChainInfo`](ChainInfo.md)

###### protocolsManager

[`ProtocolsManagerClient`](ProtocolsManagerClient.md)

###### tokensManager

[`TokensManagerClient`](TokensManagerClient.md)

#### Returns

`Chain`

## Properties

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [src/implementation/Chain.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/Chain.ts#L12)

The information of the chain

#### Implementation of

[`IChain`](../interfaces/IChain.md).[`chainInfo`](../interfaces/IChain.md#chaininfo)

***

### protocols

```ts
readonly protocols: IProtocolsManagerClient;
```

Defined in: [src/implementation/Chain.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/Chain.ts#L14)

The protocols manager client for the chain, allows to retrieve protocols on the chain

#### Implementation of

[`IChain`](../interfaces/IChain.md).[`protocols`](../interfaces/IChain.md#protocols)

***

### tokens

```ts
readonly tokens: ITokensManagerClient;
```

Defined in: [src/implementation/Chain.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/Chain.ts#L13)

The tokens manager client for the chain, allows to retrieve tokens on the chain

#### Implementation of

[`IChain`](../interfaces/IChain.md).[`tokens`](../interfaces/IChain.md#tokens)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/implementation/Chain.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/Chain.ts#L26)

Returns a string representation of an object.

#### Returns

`string`
