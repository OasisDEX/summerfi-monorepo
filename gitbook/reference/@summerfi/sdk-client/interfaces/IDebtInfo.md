# Interface: IDebtInfo

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L18)

Contains information about a debt token of a lending pool

Initially this is used for single pair lending pools, but it can be re-used in multi-token
lending pools

## Extends

- [`IDebtInfoData`](../type-aliases/IDebtInfoData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L20)

Signature to differentiate from similar interfaces

***

### debtAvailable

```ts
readonly debtAvailable: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L34)

The amount of the token that can still be borrowed

#### Overrides

```ts
IDebtInfoData.debtAvailable
```

***

### debtCeiling

```ts
readonly debtCeiling: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L32)

The maximum amount of the token that can be borrowed

#### Overrides

```ts
IDebtInfoData.debtCeiling
```

***

### dustLimit

```ts
readonly dustLimit: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L36)

The minimum amount of the token that can be borrowed

#### Overrides

```ts
IDebtInfoData.dustLimit
```

***

### interestRate

```ts
readonly interestRate: IPercentage;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L28)

The interest rate of the debt. TODO: which units??

#### Overrides

```ts
IDebtInfoData.interestRate
```

***

### originationFee

```ts
readonly originationFee: IPercentage;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L38)

The fee that is charged for creating a new debt

#### Overrides

```ts
IDebtInfoData.originationFee
```

***

### price

```ts
readonly price: IPrice;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L24)

The price of the token in the protocol's default denomination

#### Overrides

```ts
IDebtInfoData.price
```

***

### priceUSD

```ts
readonly priceUSD: IPrice;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L26)

The price of the token in USD

#### Overrides

```ts
IDebtInfoData.priceUSD
```

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L22)

The token that represents the debt

#### Overrides

```ts
IDebtInfoData.token
```

***

### totalBorrowed

```ts
readonly totalBorrowed: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L30)

The total amount of the token borrowed

#### Overrides

```ts
IDebtInfoData.totalBorrowed
```
