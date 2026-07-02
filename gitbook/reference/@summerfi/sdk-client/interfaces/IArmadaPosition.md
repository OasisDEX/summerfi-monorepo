# Interface: IArmadaPosition

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L17)

Interface for an Armada Protocol position

## Extends

- [`IPosition`](IPosition.md).[`IArmadaPositionData`](../type-aliases/IArmadaPositionData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L19)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IPosition`](IPosition.md).[`[___signature__]`](IPosition.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPosition.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L16)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
IPosition.[___signature__]
```

***

### ~~amount~~

```ts
readonly amount: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:64](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L64)

#### Deprecated

Use assets instead

#### Overrides

```ts
IArmadaPositionData.amount
```

***

### assetPriceUSD

```ts
readonly assetPriceUSD: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L27)

Asset price in USD

#### Overrides

```ts
IArmadaPositionData.assetPriceUSD
```

***

### assets

```ts
readonly assets: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L25)

Assets balance

#### Overrides

```ts
IArmadaPositionData.assets
```

***

### assetsUSD

```ts
readonly assetsUSD: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L29)

Assets value in USD

#### Overrides

```ts
IArmadaPositionData.assetsUSD
```

***

### claimableSummerToken

```ts
readonly claimableSummerToken: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:54](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L54)

Claimable SUMR rewards

#### Overrides

```ts
IArmadaPositionData.claimableSummerToken
```

***

### claimedSummerToken

```ts
readonly claimedSummerToken: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L52)

Claimed SUMR rewards

#### Overrides

```ts
IArmadaPositionData.claimedSummerToken
```

***

### deposits

```ts
readonly deposits: object[];
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:100](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L100)

#### amount

```ts
amount: ITokenAmount;
```

#### timestamp

```ts
timestamp: number;
```

#### Inherited from

```ts
IArmadaPositionData.deposits
```

***

### depositsAmount

```ts
readonly depositsAmount: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L34)

Total assets deposited in the Fleet

#### Overrides

```ts
IArmadaPositionData.depositsAmount
```

***

### depositsAmountUSD

```ts
readonly depositsAmountUSD: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L36)

Total assets deposited in the Fleet in USD

#### Overrides

```ts
IArmadaPositionData.depositsAmountUSD
```

***

### earnings

```ts
readonly earnings: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:47](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L47)

Earnings (amount - netDeposits)

#### Overrides

```ts
IArmadaPositionData.earnings
```

***

### earningsUSD

```ts
readonly earningsUSD: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L49)

Earnings in USD

#### Overrides

```ts
IArmadaPositionData.earningsUSD
```

***

### id

```ts
readonly id: IArmadaPositionId;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L21)

ID of the position

#### Overrides

[`IPosition`](IPosition.md).[`id`](IPosition.md#id)

***

### netDeposits

```ts
readonly netDeposits: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L43)

Net deposits (deposits - withdrawals)

#### Overrides

```ts
IArmadaPositionData.netDeposits
```

***

### netDepositsUSD

```ts
readonly netDepositsUSD: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:45](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L45)

Net deposits in USD

#### Overrides

```ts
IArmadaPositionData.netDepositsUSD
```

***

### pool

```ts
readonly pool: IArmadaVault;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L23)

Pool where the position is opened

#### Overrides

[`IPosition`](IPosition.md).[`pool`](IPosition.md#pool)

***

### rewards

```ts
readonly rewards: object[];
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:56](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L56)

Reward assets for this position

#### claimable

```ts
claimable: ITokenAmount;
```

#### claimed

```ts
claimed: ITokenAmount;
```

#### Overrides

```ts
IArmadaPositionData.rewards
```

***

### shares

```ts
readonly shares: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L31)

Number of shares allocated to this position

#### Overrides

```ts
IArmadaPositionData.shares
```

***

### type

```ts
readonly type: Armada;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:61](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L61)

Type of the position in the Summer.fi system

#### Overrides

[`IPosition`](IPosition.md).[`type`](IPosition.md#type)

***

### withdrawals

```ts
readonly withdrawals: object[];
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:104](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L104)

#### amount

```ts
amount: ITokenAmount;
```

#### timestamp

```ts
timestamp: number;
```

#### Inherited from

```ts
IArmadaPositionData.withdrawals
```

***

### withdrawalsAmount

```ts
readonly withdrawalsAmount: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L38)

Total assets withdrawn from the Fleet

#### Overrides

```ts
IArmadaPositionData.withdrawalsAmount
```

***

### withdrawalsAmountUSD

```ts
readonly withdrawalsAmountUSD: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPosition.ts:40](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPosition.ts#L40)

Total assets withdrawn from the Fleet in USD

#### Overrides

```ts
IArmadaPositionData.withdrawalsAmountUSD
```
