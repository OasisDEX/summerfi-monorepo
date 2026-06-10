# Class: UsersManager

Defined in: [sdk/sdk-client/src/implementation/UsersManager.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/UsersManager.ts#L12)

Client-side implementation of [IUsersManager](../interfaces/IUsersManager.md) that creates per-wallet [UserClient](UserClient.md)
instances scoped to a chain.

## Extends

- `IRPCClient`

## Implements

- [`IUsersManager`](../interfaces/IUsersManager.md)

## Constructors

### Constructor

```ts
new UsersManager(params): UsersManager;
```

Defined in: [sdk/sdk-client/src/implementation/UsersManager.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/UsersManager.ts#L13)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`UsersManager`

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

### getUserClient()

```ts
getUserClient(params): Promise<UserClient>;
```

Defined in: [sdk/sdk-client/src/implementation/UsersManager.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/UsersManager.ts#L25)

Creates a [UserClient](UserClient.md) for a wallet on a specific chain.

#### Parameters

##### params

Parameters object.

###### chainInfo

[`ChainInfo`](ChainInfo.md)

The chain the user client should operate on.

###### walletAddress

[`Address`](Address.md)

The wallet address to scope the client to.

#### Returns

`Promise`\<[`UserClient`](UserClient.md)\>

A promise resolving to the wallet-scoped [UserClient](UserClient.md).

#### Implementation of

[`IUsersManager`](../interfaces/IUsersManager.md).[`getUserClient`](../interfaces/IUsersManager.md#getuserclient)
