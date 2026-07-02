# Interface: IPortfolioManager

Defined in: [src/interfaces/IPortfolioManager.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IPortfolioManager.ts#L7)

Allows to retrieve a wallet's positions by their wallet and network. This is meant to be used in isolation
without having to retrieve a User or a Network

## Methods

### getPositions()

```ts
getPositions(params): Promise<Position[]>;
```

Defined in: [src/interfaces/IPortfolioManager.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IPortfolioManager.ts#L17)

Retrieves all positions of the given wallet for the given networks. The positions can be filtered by
their IDs

#### Parameters

##### params

###### networks

[`ChainInfo`](../classes/ChainInfo.md)[]

###### wallet

[`Wallet`](../classes/Wallet.md)

#### Returns

`Promise`\<[`Position`](../classes/Position.md)[]\>

The list of positions for the given wallet and networks
