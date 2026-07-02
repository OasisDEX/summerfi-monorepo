# Interface: IUserClient

Defined in: [src/interfaces/IUserClient.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IUserClient.ts#L17)

Represents a user and allows to access their positions and to create new orders

## Remarks

This interface must be used to get positions for a user that will be used to create orders. To retrieve
positions for portfolio please

## See

PortfolioManager

## Properties

### user

```ts
user: IUser;
```

Defined in: [src/interfaces/IUserClient.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IUserClient.ts#L18)

## Methods

### getPosition()

```ts
getPosition(params): Promise<Maybe<Position>>;
```

Defined in: [src/interfaces/IUserClient.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IUserClient.ts#L33)

Retrieves a position of the user by its ID

#### Parameters

##### params

###### id

[`PositionId`](../classes/PositionId.md)

#### Returns

`Promise`\<[`Maybe`](../type-aliases/Maybe.md)\<[`Position`](../classes/Position.md)\>\>

***

### getPositionsByIds()

```ts
getPositionsByIds(params): Promise<Position[]>;
```

Defined in: [src/interfaces/IUserClient.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IUserClient.ts#L28)

Retrieves the list of positions of the user for the given IDs

#### Parameters

##### params

###### positionIds

[`PositionId`](../classes/PositionId.md)[]

#### Returns

`Promise`\<[`Position`](../classes/Position.md)[]\>

***

### getPositionsByProtocol()

```ts
getPositionsByProtocol(params): Promise<Position[]>;
```

Defined in: [src/interfaces/IUserClient.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IUserClient.ts#L23)

Retrieves the list of positions of the user for a given protocol

#### Parameters

##### params

###### protocol

[`IProtocol`](IProtocol.md)

#### Returns

`Promise`\<[`Position`](../classes/Position.md)[]\>

***

### newOrder()

```ts
newOrder(params): Promise<Maybe<Order>>;
```

Defined in: [src/interfaces/IUserClient.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IUserClient.ts#L42)

Creates a new order for the user based on the given simulation

#### Parameters

##### params

###### simulation

[`ISimulation`](ISimulation.md)

The simulation to create the order for

#### Returns

`Promise`\<[`Maybe`](../type-aliases/Maybe.md)\<[`Order`](Order.md)\>\>

The new order created for the user
