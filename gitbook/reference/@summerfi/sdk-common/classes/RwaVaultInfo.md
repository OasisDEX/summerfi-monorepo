# Class: RwaVaultInfo

Defined in: [src/common/implementation/RwaVaultInfo.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L23)

RwaVaultInfo

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

Defined in: [src/common/implementation/RwaVaultInfo.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L25)

SIGNATURE

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`[___signature__]`](../interfaces/IRwaVaultInfo.md#___signature__-1)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/PoolInfo.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolInfo.ts#L18)

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

Defined in: [src/common/implementation/RwaVaultInfo.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L36)

Vault apy

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`apy`](../interfaces/IRwaVaultInfo.md#apy)

***

### apys

```ts
readonly apys: VaultApys;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L37)

Vault apys for different time periods

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`apys`](../interfaces/IRwaVaultInfo.md#apys)

***

### assetToken

```ts
readonly assetToken: ITokenStanalone;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L31)

Underlying asset token that can be deposited into the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`assetToken`](../interfaces/IRwaVaultInfo.md#assettoken)

***

### depositCap

```ts
readonly depositCap: ITokenAmount;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L32)

Maximum amount that can be deposited into the vault at this moment

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`depositCap`](../interfaces/IRwaVaultInfo.md#depositcap)

***

### id

```ts
readonly id: IArmadaVaultId;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L29)

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

Defined in: [src/common/implementation/RwaVaultInfo.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L44)

Vault Merkl rewards apy

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`merklRewards`](../interfaces/IRwaVaultInfo.md#merklrewards)

***

### rewardsApys

```ts
readonly rewardsApys: object[] | undefined;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L38)

Vault SUMR rewards apy

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`rewardsApys`](../interfaces/IRwaVaultInfo.md#rewardsapys)

***

### sharePrice

```ts
readonly sharePrice: IPrice;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L35)

Current price per share of the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`sharePrice`](../interfaces/IRwaVaultInfo.md#shareprice)

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L30)

Token of the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`token`](../interfaces/IRwaVaultInfo.md#token)

***

### totalDeposits

```ts
readonly totalDeposits: ITokenAmount;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L33)

Total amount of assets currently deposited in the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`totalDeposits`](../interfaces/IRwaVaultInfo.md#totaldeposits)

***

### totalShares

```ts
readonly totalShares: ITokenAmount;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L34)

Total amount of shares currently minted in the vault

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`totalShares`](../interfaces/IRwaVaultInfo.md#totalshares)

***

### tvlUsd

```ts
readonly tvlUsd: IFiatCurrencyAmount;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:50](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L50)

Total value locked in USD

#### Implementation of

[`IRwaVaultInfo`](../interfaces/IRwaVaultInfo.md).[`tvlUsd`](../interfaces/IRwaVaultInfo.md#tvlusd)

***

### type

```ts
readonly type: Rwa = PoolType.Rwa;
```

Defined in: [src/common/implementation/RwaVaultInfo.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L28)

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

Defined in: [src/common/implementation/PoolInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolInfo.ts#L32)

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

Defined in: [src/common/implementation/RwaVaultInfo.ts:53](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RwaVaultInfo.ts#L53)

FACTORY

#### Parameters

##### params

[`RwaVaultInfoParameters`](../type-aliases/RwaVaultInfoParameters.md)

#### Returns

`RwaVaultInfo`
