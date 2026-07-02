# Type Alias: SpotPricesInfo

```ts
type SpotPricesInfo = object;
```

Defined in: [src/oracle/ISpotPriceInfo.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/oracle/ISpotPriceInfo.ts#L30)

Gives the current market price for a specific list of assets

## Properties

### priceByAddress

```ts
priceByAddress: Record<string, IPrice>;
```

Defined in: [src/oracle/ISpotPriceInfo.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/oracle/ISpotPriceInfo.ts#L34)

Price by addresses

***

### provider

```ts
provider: OracleProviderType;
```

Defined in: [src/oracle/ISpotPriceInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/oracle/ISpotPriceInfo.ts#L32)

The oracle provider type
