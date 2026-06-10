# Class: ProtocolsManagerClient

Defined in: [sdk/sdk-client/src/implementation/ProtocolsManagerClient.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/ProtocolsManagerClient.ts#L11)

ProtocolsManagerClient

## See

IProtocolsManagerClient

## Extends

- `IRPCClient`

## Implements

- [`IProtocolsManagerClient`](../interfaces/IProtocolsManagerClient.md)

## Constructors

### Constructor

```ts
new ProtocolsManagerClient(params): ProtocolsManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/ProtocolsManagerClient.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/ProtocolsManagerClient.ts#L14)

#### Parameters

##### params

###### chainInfo

[`ChainInfo`](ChainInfo.md)

###### rpcClient

`TRPCClient`

#### Returns

`ProtocolsManagerClient`

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

Defined in: [sdk/sdk-client/src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/IRPCClient.ts#L10)

##### Returns

`TRPCClient`

#### Inherited from

```ts
IRPCClient.rpcClient
```

## Methods

### getLendingPool()

```ts
getLendingPool(params): Promise<Maybe<ILendingPool>>;
```

Defined in: [sdk/sdk-client/src/implementation/ProtocolsManagerClient.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/ProtocolsManagerClient.ts#L27)

Fetches a lending pool by its identifier.

#### Parameters

##### params

Parameters object.

###### poolId

[`ILendingPoolIdData`](../type-aliases/ILendingPoolIdData.md)

Identifying data of the lending pool to fetch.

#### Returns

`Promise`\<[`Maybe`](../type-aliases/Maybe.md)\<[`ILendingPool`](../interfaces/ILendingPool.md)\>\>

A promise resolving to the lending pool, or a nullish [Maybe](../type-aliases/Maybe.md) if not found.

#### Implementation of

[`IProtocolsManagerClient`](../interfaces/IProtocolsManagerClient.md).[`getLendingPool`](../interfaces/IProtocolsManagerClient.md#getlendingpool)

***

### getLendingPoolInfo()

```ts
getLendingPoolInfo(params): Promise<Maybe<ILendingPoolInfo>>;
```

Defined in: [sdk/sdk-client/src/implementation/ProtocolsManagerClient.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/ProtocolsManagerClient.ts#L38)

Fetches extended information (rates, caps, etc.) for a lending pool by its identifier.

#### Parameters

##### params

Parameters object.

###### poolId

[`ILendingPoolIdData`](../type-aliases/ILendingPoolIdData.md)

Identifying data of the lending pool to fetch info for.

#### Returns

`Promise`\<[`Maybe`](../type-aliases/Maybe.md)\<[`ILendingPoolInfo`](../interfaces/ILendingPoolInfo.md)\>\>

A promise resolving to the lending pool info, or a nullish [Maybe](../type-aliases/Maybe.md) if not found.

#### Implementation of

[`IProtocolsManagerClient`](../interfaces/IProtocolsManagerClient.md).[`getLendingPoolInfo`](../interfaces/IProtocolsManagerClient.md#getlendingpoolinfo)
