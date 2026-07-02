# Class: ProtocolsManagerClient

Defined in: [src/implementation/ProtocolsManagerClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ProtocolsManagerClient.ts#L10)

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

Defined in: [src/implementation/ProtocolsManagerClient.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ProtocolsManagerClient.ts#L13)

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

Defined in: [src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IRPCClient.ts#L10)

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

Defined in: [src/implementation/ProtocolsManagerClient.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ProtocolsManagerClient.ts#L26)

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

Defined in: [src/implementation/ProtocolsManagerClient.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ProtocolsManagerClient.ts#L37)

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
