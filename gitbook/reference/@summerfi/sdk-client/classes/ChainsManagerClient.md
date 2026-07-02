# Class: ChainsManagerClient

Defined in: [src/implementation/ChainsManager.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ChainsManager.ts#L18)

Implementation of the IChainsManager interface for the SDK Client

## Extends

- `IRPCClient`

## Implements

- [`IChainsManagerClient`](../interfaces/IChainsManagerClient.md)

## Constructors

### Constructor

```ts
new ChainsManagerClient(params): ChainsManagerClient;
```

Defined in: [src/implementation/ChainsManager.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ChainsManager.ts#L19)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`ChainsManagerClient`

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

### getChain()

```ts
getChain(params): Promise<Chain>;
```

Defined in: [src/implementation/ChainsManager.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ChainsManager.ts#L30)

Builds a [Chain](Chain.md) instance (with its tokens and protocols managers) from chain info.

#### Parameters

##### params

Parameters object.

###### chainInfo

[`IChainInfoData`](../type-aliases/IChainInfoData.md)

Identifying information of the chain to build.

#### Returns

`Promise`\<[`Chain`](Chain.md)\>

A promise resolving to the configured [Chain](Chain.md).

#### Implementation of

[`IChainsManagerClient`](../interfaces/IChainsManagerClient.md).[`getChain`](../interfaces/IChainsManagerClient.md#getchain)

***

### getChainById()

```ts
getChainById(params): Promise<Chain>;
```

Defined in: [src/implementation/ChainsManager.ts:50](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ChainsManager.ts#L50)

Builds a [Chain](Chain.md) instance by resolving chain info from a numeric chain id.

#### Parameters

##### params

Parameters object.

###### chainId

`number`

The numeric id of the chain to build.

#### Returns

`Promise`\<[`Chain`](Chain.md)\>

A promise resolving to the configured [Chain](Chain.md).

#### Implementation of

[`IChainsManagerClient`](../interfaces/IChainsManagerClient.md).[`getChainById`](../interfaces/IChainsManagerClient.md#getchainbyid)
