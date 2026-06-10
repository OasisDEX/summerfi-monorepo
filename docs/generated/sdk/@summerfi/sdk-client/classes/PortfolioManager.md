# Class: PortfolioManager

Defined in: [sdk/sdk-client/src/implementation/PortfolioManager.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/PortfolioManager.ts#L10)

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

Defined in: [sdk/sdk-client/src/implementation/PortfolioManager.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/PortfolioManager.ts#L11)

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

Defined in: [sdk/sdk-client/src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/IRPCClient.ts#L10)

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

Defined in: [sdk/sdk-client/src/implementation/PortfolioManager.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/PortfolioManager.ts#L24)

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

#### Implementation of

[`IPortfolioManager`](../interfaces/IPortfolioManager.md).[`getPositions`](../interfaces/IPortfolioManager.md#getpositions)
