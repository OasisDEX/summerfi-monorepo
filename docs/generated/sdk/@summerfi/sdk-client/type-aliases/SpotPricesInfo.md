# Type Alias: SpotPricesInfo

```ts
type SpotPricesInfo = object;
```

Defined in: [sdk/sdk-common/src/oracle/ISpotPriceInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/oracle/ISpotPriceInfo.ts#L32)

## Name

SpotPricesInfo

## Description

Gives the current market price for a specific list of assets

## Properties

### priceByAddress

```ts
priceByAddress: Record<string, IPrice>;
```

Defined in: [sdk/sdk-common/src/oracle/ISpotPriceInfo.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/oracle/ISpotPriceInfo.ts#L36)

Price by addresses

***

### provider

```ts
provider: OracleProviderType;
```

Defined in: [sdk/sdk-common/src/oracle/ISpotPriceInfo.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/oracle/ISpotPriceInfo.ts#L34)

The oracle provider type
