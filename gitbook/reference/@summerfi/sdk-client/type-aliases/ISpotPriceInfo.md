# Type Alias: ISpotPriceInfo

```ts
type ISpotPriceInfo = object;
```

Defined in: [../sdk-common/src/oracle/ISpotPriceInfo.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/oracle/ISpotPriceInfo.ts#L9)

Gives the current market price for a specific asset

## Properties

### price

```ts
price: IPrice;
```

Defined in: [../sdk-common/src/oracle/ISpotPriceInfo.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/oracle/ISpotPriceInfo.ts#L15)

The price of the asset

***

### provider

```ts
provider: OracleProviderType;
```

Defined in: [../sdk-common/src/oracle/ISpotPriceInfo.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/oracle/ISpotPriceInfo.ts#L11)

The oracle provider type

***

### token

```ts
token: ITokenStanalone;
```

Defined in: [../sdk-common/src/oracle/ISpotPriceInfo.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/oracle/ISpotPriceInfo.ts#L13)

The token for which the price is being requested. Also included in price, but added here for convenience
