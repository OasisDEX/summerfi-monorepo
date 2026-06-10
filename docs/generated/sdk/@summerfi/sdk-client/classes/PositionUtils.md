# Class: PositionUtils

Defined in: [sdk/sdk-client/src/utils/PositionUtils.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/utils/PositionUtils.ts#L11)

Stateless helpers for deriving lending-position metrics such as loan-to-value and liquidation
price from token amounts and USD prices.

## Constructors

### Constructor

```ts
new PositionUtils(): PositionUtils;
```

#### Returns

`PositionUtils`

## Methods

### getLiquidationPriceInDebtTokens()

```ts
static getLiquidationPriceInDebtTokens(__namedParameters): string;
```

Defined in: [sdk/sdk-client/src/utils/PositionUtils.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/utils/PositionUtils.ts#L39)

This code calculates the value of one collateral token expressed in debt tokens at which the loan-to-value (LTV) ratio will be at liquidationThreshold

#### Parameters

##### \_\_namedParameters

###### debtPriceInUsd

`string`

###### liquidationThreshold

[`Percentage`](Percentage.md)

###### position

[`ILendingPosition`](../interfaces/ILendingPosition.md)

#### Returns

`string`

***

### getLTV()

```ts
static getLTV(__namedParameters): IPercentage;
```

Defined in: [sdk/sdk-client/src/utils/PositionUtils.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/utils/PositionUtils.ts#L12)

#### Parameters

##### \_\_namedParameters

###### collateralPriceInUsd

`string`

###### collateralTokenAmount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

###### debtPriceInUsd

`string`

###### debtTokenAmount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### Returns

[`IPercentage`](../interfaces/IPercentage.md)
