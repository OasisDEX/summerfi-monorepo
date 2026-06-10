# Class: UserClient

Defined in: [sdk/sdk-client/src/implementation/UserClient.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/UserClient.ts#L22)

UserClient

## See

IUserClient

## Extends

- `IRPCClient`

## Implements

- [`IUserClient`](../interfaces/IUserClient.md)

## Constructors

### Constructor

```ts
new UserClient(params): UserClient;
```

Defined in: [sdk/sdk-client/src/implementation/UserClient.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/UserClient.ts#L26)

Constructor

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](../interfaces/IChainInfo.md)

###### rpcClient

`TRPCClient`

###### wallet

[`IWallet`](../interfaces/IWallet.md)

#### Returns

`UserClient`

#### Overrides

```ts
IRPCClient.constructor
```

## Properties

### user

```ts
user: IUser;
```

Defined in: [sdk/sdk-client/src/implementation/UserClient.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/UserClient.ts#L23)

#### Implementation of

[`IUserClient`](../interfaces/IUserClient.md).[`user`](../interfaces/IUserClient.md#user)

## Accessors

### rpcClient

#### Get Signature

```ts
get protected rpcClient(): TRPCClient;
```

Defined in: [sdk/sdk-client/src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/interfaces/IRPCClient.ts#L10)

##### Returns

`TRPCClient`

#### Inherited from

```ts
IRPCClient.rpcClient
```

## Methods

### getPosition()

```ts
getPosition(params): Promise<Maybe<Position>>;
```

Defined in: [sdk/sdk-client/src/implementation/UserClient.ts:73](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/UserClient.ts#L73)

Returns a single position owned by the user, by its id.

#### Parameters

##### params

Parameters object.

###### id

[`PositionId`](PositionId.md)

The id of the position to return.

#### Returns

`Promise`\<[`Maybe`](../type-aliases/Maybe.md)\<[`Position`](Position.md)\>\>

A promise resolving to the position, or a nullish [Maybe](../type-aliases/Maybe.md) if not found.

#### Remarks

Not yet implemented — currently returns a placeholder value.

#### Implementation of

[`IUserClient`](../interfaces/IUserClient.md).[`getPosition`](../interfaces/IUserClient.md#getposition)

***

### getPositionsByIds()

```ts
getPositionsByIds(_params): Promise<Position[]>;
```

Defined in: [sdk/sdk-client/src/implementation/UserClient.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/UserClient.ts#L59)

Returns the user's positions matching the given position ids.

#### Parameters

##### \_params

###### positionIds

[`PositionId`](PositionId.md)[]

#### Returns

`Promise`\<[`Position`](Position.md)[]\>

A promise resolving to the matching positions.

#### Remarks

Not yet implemented — currently returns an empty array.

#### Implementation of

[`IUserClient`](../interfaces/IUserClient.md).[`getPositionsByIds`](../interfaces/IUserClient.md#getpositionsbyids)

***

### getPositionsByProtocol()

```ts
getPositionsByProtocol(_params): Promise<Position[]>;
```

Defined in: [sdk/sdk-client/src/implementation/UserClient.ts:45](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/UserClient.ts#L45)

Returns the user's positions for a given protocol.

#### Parameters

##### \_params

###### protocol

[`IProtocol`](../interfaces/IProtocol.md)

#### Returns

`Promise`\<[`Position`](Position.md)[]\>

A promise resolving to the user's positions in that protocol.

#### Remarks

Not yet implemented — currently returns an empty array.

#### Implementation of

[`IUserClient`](../interfaces/IUserClient.md).[`getPositionsByProtocol`](../interfaces/IUserClient.md#getpositionsbyprotocol)

***

### newOrder()

```ts
newOrder(params): Promise<Maybe<Order>>;
```

Defined in: [sdk/sdk-client/src/implementation/UserClient.ts:88](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/UserClient.ts#L88)

Builds an executable order for this user from a simulation.

#### Parameters

##### params

Parameters object.

###### positionsManager?

[`IPositionsManager`](../interfaces/IPositionsManager.md)

Optional positions manager, required only for DMA orders.

###### simulation

[`ISimulation`](../interfaces/ISimulation.md)

The simulation describing the desired position change.

#### Returns

`Promise`\<[`Maybe`](../type-aliases/Maybe.md)\<[`Order`](../interfaces/Order.md)\>\>

A promise resolving to the built order, or a nullish [Maybe](../type-aliases/Maybe.md) if none could be built.

#### Implementation of

[`IUserClient`](../interfaces/IUserClient.md).[`newOrder`](../interfaces/IUserClient.md#neworder)
