# Class: OracleManagerClient

Defined in: [src/implementation/OracleManagerClient.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/OracleManagerClient.ts#L8)

Implementation of the IOracleManagerClient interface for the SDK Client

## Extends

- `IRPCClient`

## Implements

- [`IOracleManagerClient`](../interfaces/IOracleManagerClient.md)

## Constructors

### Constructor

```ts
new OracleManagerClient(params): OracleManagerClient;
```

Defined in: [src/implementation/OracleManagerClient.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/OracleManagerClient.ts#L9)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`OracleManagerClient`

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

Defined in: [src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IRPCClient.ts#L10)

##### Returns

`TRPCClient`

#### Inherited from

```ts
IRPCClient.rpcClient
```

## Methods

### getSpotPrice()

```ts
getSpotPrice(params): Promise<ISpotPriceInfo>;
```

Defined in: [src/implementation/OracleManagerClient.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/OracleManagerClient.ts#L14)

#### Parameters

##### params

###### baseToken

[`ITokenStanalone`](../interfaces/ITokenStanalone.md)

###### denomination?

[`Denomination`](../type-aliases/Denomination.md)

#### Returns

`Promise`\<[`ISpotPriceInfo`](../type-aliases/ISpotPriceInfo.md)\>

#### See

IOracleManagerClient.getSpotPrice

#### Implementation of

[`IOracleManagerClient`](../interfaces/IOracleManagerClient.md).[`getSpotPrice`](../interfaces/IOracleManagerClient.md#getspotprice)

***

### getSpotPrices()

```ts
getSpotPrices(params): Promise<SpotPricesInfo>;
```

Defined in: [src/implementation/OracleManagerClient.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/OracleManagerClient.ts#L21)

#### Parameters

##### params

###### baseTokens

[`ITokenStanalone`](../interfaces/ITokenStanalone.md)[]

###### chainInfo

[`IChainInfo`](../interfaces/IChainInfo.md)

###### quoteCurrency?

[`FiatCurrency`](../enumerations/FiatCurrency.md)

#### Returns

`Promise`\<[`SpotPricesInfo`](../type-aliases/SpotPricesInfo.md)\>

#### See

IOracleManagerClient.getSpotPrices

#### Implementation of

[`IOracleManagerClient`](../interfaces/IOracleManagerClient.md).[`getSpotPrices`](../interfaces/IOracleManagerClient.md#getspotprices)
