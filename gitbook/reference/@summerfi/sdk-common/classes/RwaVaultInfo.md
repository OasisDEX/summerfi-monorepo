# Class: RwaVaultInfo

Defined in: [src/common/implementation/RwaVaultInfo.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L22)

## See

IRwaVaultInfo

## Extends

- `PoolInfo`

## Implements

- [`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L24)

SIGNATURE

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`[___signature__]`](../interfaces/IRwaVaultInfo.md#___signature__-1)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/PoolInfo.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolInfo.ts#L17)

SIGNATURE

#### Implementation of

```ts
IRwaVaultInfo.[___signature__]
```

#### Inherited from

```ts
PoolInfo.[___signature__]
```

***

### apy

```ts
readonly apy: IPercentage | null;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L35)

Vault apy

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`apy`](../interfaces/IRwaVaultInfo.md#apy)

***

### apys

```ts
readonly apys: VaultApys;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L36)

Vault apys for different time periods

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`apys`](../interfaces/IRwaVaultInfo.md#apys)

***

### assetToken

```ts
readonly assetToken: ITokenStanalone;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L30)

Underlying asset token that can be deposited into the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`assetToken`](../interfaces/IRwaVaultInfo.md#assettoken)

***

### depositCap

```ts
readonly depositCap: ITokenAmount;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L31)

Maximum amount that can be deposited into the vault at this moment

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`depositCap`](../interfaces/IRwaVaultInfo.md#depositcap)

***

### id

```ts
readonly id: IArmadaVaultId;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L28)

ID of the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`id`](../interfaces/IRwaVaultInfo.md#id)

#### Overrides

```ts
PoolInfo.id
```

***

### merklRewards

```ts
readonly merklRewards: object[] | undefined;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L43)

Vault Merkl rewards apy

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`merklRewards`](../interfaces/IRwaVaultInfo.md#merklrewards)

***

### rewardsApys

```ts
readonly rewardsApys: object[] | undefined;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L37)

Vault SUMR rewards apy

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`rewardsApys`](../interfaces/IRwaVaultInfo.md#rewardsapys)

***

### sharePrice

```ts
readonly sharePrice: IPrice;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L34)

Current price per share of the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`sharePrice`](../interfaces/IRwaVaultInfo.md#shareprice)

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L29)

Token of the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`token`](../interfaces/IRwaVaultInfo.md#token)

***

### totalDeposits

```ts
readonly totalDeposits: ITokenAmount;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L32)

Total amount of assets currently deposited in the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`totalDeposits`](../interfaces/IRwaVaultInfo.md#totaldeposits)

***

### totalShares

```ts
readonly totalShares: ITokenAmount;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L33)

Total amount of shares currently minted in the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`totalShares`](../interfaces/IRwaVaultInfo.md#totalshares)

***

### tvlUsd

```ts
readonly tvlUsd: IFiatCurrencyAmount;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L49)

Total value locked in USD

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`tvlUsd`](../interfaces/IRwaVaultInfo.md#tvlusd)

***

### type

```ts
readonly type: Rwa = PoolType.Rwa;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L27)

ATTRIBUTES

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`type`](../interfaces/IRwaVaultInfo.md#type)

#### Overrides

```ts
PoolInfo.type
```

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/PoolInfo.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolInfo.ts#L31)

#### Returns

`string`

#### See

IPrintable.toString

#### Inherited from

```ts
PoolInfo.toString
```

***

### createFrom()

```ts
static createFrom(params): RwaVaultInfo;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L52)

FACTORY

#### Parameters

##### params

[`RwaVaultInfoParameters`](../type-aliases/RwaVaultInfoParameters.md)

#### Returns

`RwaVaultInfo`
