# Interface: ICollateralInfo

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L16)

Contains extended information about a collateral token of a lending pool

## Extends

- [`ICollateralInfoData`](../type-aliases/ICollateralInfoData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L18)

Signature to differentiate from similar interfaces

***

### liquidationPenalty

```ts
readonly liquidationPenalty: IPercentage;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L32)

The penalty that is charged for liquidating a position

#### Overrides

```ts
ICollateralInfoData.liquidationPenalty
```

***

### liquidationThreshold

```ts
readonly liquidationThreshold: IRiskRatio;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L26)

The ratio between the collateral and the debt at which the position could be liquidated

#### Overrides

```ts
ICollateralInfoData.liquidationThreshold
```

***

### maxSupply

```ts
readonly maxSupply: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L28)

The maximum amount of the token that can be supplied

#### Overrides

```ts
ICollateralInfoData.maxSupply
```

***

### price

```ts
readonly price: IPrice;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L22)

The price of the token in the protocol's default denomination

#### Overrides

```ts
ICollateralInfoData.price
```

***

### priceUSD

```ts
readonly priceUSD: IPrice;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L24)

The price of the token in USD

#### Overrides

```ts
ICollateralInfoData.priceUSD
```

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L20)

The token that represents the collateral

#### Overrides

```ts
ICollateralInfoData.token
```

***

### tokensLocked

```ts
readonly tokensLocked: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L30)

The amount of the token that is currently locked in the pool

#### Overrides

```ts
ICollateralInfoData.tokensLocked
```
