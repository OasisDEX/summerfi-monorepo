# Class: ArmadaVaultInfo

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L22)

## See

IArmadaVaultInfo

## Extends

- `PoolInfo`

## Implements

- [`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L24)

SIGNATURE

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`[___signature__]`](../interfaces/IArmadaVaultInfo.md#___signature__-1)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/PoolInfo.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolInfo.ts#L17)

SIGNATURE

#### Implementation of

```ts
IArmadaVaultInfo.[___signature__]
```

#### Inherited from

[`RwaVaultInfo`](RwaVaultInfo.md).[`[___signature__]`](RwaVaultInfo.md#___signature__-1)

***

### apy

```ts
readonly apy: IPercentage | null;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L35)

Vault apy

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`apy`](../interfaces/IArmadaVaultInfo.md#apy)

***

### apys

```ts
readonly apys: VaultApys;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L36)

Vault apys for different time periods

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`apys`](../interfaces/IArmadaVaultInfo.md#apys)

***

### assetToken

```ts
readonly assetToken: ITokenStanalone;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L30)

Underlying asset token that can be deposited into the vault

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`assetToken`](../interfaces/IArmadaVaultInfo.md#assettoken)

***

### depositCap

```ts
readonly depositCap: ITokenAmount;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L31)

Maximum amount that can be deposited into the vault at this moment

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`depositCap`](../interfaces/IArmadaVaultInfo.md#depositcap)

***

### id

```ts
readonly id: IArmadaVaultId;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L28)

ID of the vault

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`id`](../interfaces/IArmadaVaultInfo.md#id)

#### Overrides

```ts
PoolInfo.id
```

***

### merklRewards

```ts
readonly merklRewards: object[] | undefined;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L43)

Vault Merkl rewards apy

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`merklRewards`](../interfaces/IArmadaVaultInfo.md#merklrewards)

***

### rewardsApys

```ts
readonly rewardsApys: object[] | undefined;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L37)

Vault SUMR rewards apy

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`rewardsApys`](../interfaces/IArmadaVaultInfo.md#rewardsapys)

***

### sharePrice

```ts
readonly sharePrice: IPrice;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L34)

Current price per share of the vault

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`sharePrice`](../interfaces/IArmadaVaultInfo.md#shareprice)

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L29)

Token of the vault

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`token`](../interfaces/IArmadaVaultInfo.md#token)

***

### totalDeposits

```ts
readonly totalDeposits: ITokenAmount;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L32)

Total amount of assets currently deposited in the vault

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`totalDeposits`](../interfaces/IArmadaVaultInfo.md#totaldeposits)

***

### totalShares

```ts
readonly totalShares: ITokenAmount;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L33)

Total amount of shares currently minted in the vault

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`totalShares`](../interfaces/IArmadaVaultInfo.md#totalshares)

***

### tvlUsd

```ts
readonly tvlUsd: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L49)

Total value locked in USD

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`tvlUsd`](../interfaces/IArmadaVaultInfo.md#tvlusd)

***

### type

```ts
readonly type: Armada = PoolType.Armada;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L27)

ATTRIBUTES

#### Implementation of

[`IArmadaVaultInfo`](../interfaces/IArmadaVaultInfo.md).[`type`](../interfaces/IArmadaVaultInfo.md#type)

#### Overrides

```ts
PoolInfo.type
```

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/implementation/PoolInfo.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolInfo.ts#L31)

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
static createFrom(params): ArmadaVaultInfo;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultInfo.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultInfo.ts#L52)

FACTORY

#### Parameters

##### params

[`ArmadaVaultInfoParameters`](../type-aliases/ArmadaVaultInfoParameters.md)

#### Returns

`ArmadaVaultInfo`
