# Class: PortfolioManager

Defined in: [sdk/sdk-client/src/implementation/PortfolioManager.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/PortfolioManager.ts#L10)

Client-side implementation of [IPortfolioManager](../interfaces/IPortfolioManager.md) that aggregates a wallet's positions
across the requested networks.

## Extends

- `IRPCClient`

## Implements

- [`IPortfolioManager`](../interfaces/IPortfolioManager.md)

## Constructors

### Constructor

```ts
new PortfolioManager(params): PortfolioManager;
```

Defined in: [sdk/sdk-client/src/implementation/PortfolioManager.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/PortfolioManager.ts#L11)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`PortfolioManager`

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

Defined in: [sdk/sdk-client/src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/interfaces/IRPCClient.ts#L10)

##### Returns

`TRPCClient`

#### Inherited from

```ts
IRPCClient.rpcClient
```

## Methods

### getPositions()

```ts
getPositions(_params): Promise<Position[]>;
```

Defined in: [sdk/sdk-client/src/implementation/PortfolioManager.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/PortfolioManager.ts#L25)

Returns the wallet's positions across the requested networks.

#### Parameters

##### \_params

###### networks

[`ChainInfo`](ChainInfo.md)[]

###### wallet

[`Wallet`](Wallet.md)

#### Returns

`Promise`\<[`Position`](Position.md)[]\>

A promise resolving to the wallet's positions across the given networks.

#### Remarks

Not yet implemented — currently returns an empty array.

#### Implementation of

[`IPortfolioManager`](../interfaces/IPortfolioManager.md).[`getPositions`](../interfaces/IPortfolioManager.md#getpositions)
