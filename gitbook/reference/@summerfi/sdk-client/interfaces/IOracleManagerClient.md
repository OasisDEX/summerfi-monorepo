# Interface: IOracleManagerClient

Defined in: [src/interfaces/IOracleManagerClient.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IOracleManagerClient.ts#L15)

Interface for the Oracle Manager client implementation.

## See

IOracleManager

## Methods

### getSpotPrice()

```ts
getSpotPrice(params): Promise<ISpotPriceInfo>;
```

Defined in: [src/interfaces/IOracleManagerClient.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IOracleManagerClient.ts#L22)

Returns the prevailing market price for a single token

#### Parameters

##### params

###### baseToken

[`ITokenStanalone`](ITokenStanalone.md)

requested base token

###### denomination?

[`Denomination`](../type-aliases/Denomination.md)

optional denomination either fiat or token, defaults to USD

#### Returns

`Promise`\<[`ISpotPriceInfo`](../type-aliases/ISpotPriceInfo.md)\>

***

### getSpotPrices()

```ts
getSpotPrices(params): Promise<SpotPricesInfo>;
```

Defined in: [src/interfaces/IOracleManagerClient.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IOracleManagerClient.ts#L31)

Returns the prevailing market prices for multiple tokens

#### Parameters

##### params

###### baseTokens

[`ITokenStanalone`](ITokenStanalone.md)[]

An array of requested base tokens

###### chainInfo

[`IChainInfo`](IChainInfo.md)

The chain info for specific chain

###### quoteCurrency?

[`FiatCurrency`](../enumerations/FiatCurrency.md)

A quote currency, defaults to USD

#### Returns

`Promise`\<[`SpotPricesInfo`](../type-aliases/SpotPricesInfo.md)\>
