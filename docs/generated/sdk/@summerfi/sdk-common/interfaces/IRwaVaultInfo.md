# Interface: IRwaVaultInfo

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L23)

IRwaVaultInfo

## Description

Extended info of a Real-World Asset (RWA) vault.
             Cloned from IArmadaVaultInfo and intended to diverge as RWA-specific
             fields are added.

## Extends

- [`IPoolInfo`](IPoolInfo.md).[`IRwaVaultInfoData`](../type-aliases/IRwaVaultInfoData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L25)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IPoolInfo`](IPoolInfo.md).[`[___signature__]`](IPoolInfo.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IPoolInfo.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IPoolInfo.ts#L18)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
IPoolInfo.[___signature__]
```

***

### apy

```ts
readonly apy: IPercentage | null;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L41)

Vault apy

#### Overrides

```ts
IRwaVaultInfoData.apy
```

***

### apys

```ts
readonly apys: VaultApys;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L43)

Vault apys for different time periods

#### Overrides

```ts
IRwaVaultInfoData.apys
```

***

### assetToken

```ts
readonly assetToken: ITokenStanalone;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L31)

Underlying asset token that can be deposited into the vault

#### Overrides

```ts
IRwaVaultInfoData.assetToken
```

***

### depositCap

```ts
readonly depositCap: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L33)

Maximum amount that can be deposited into the vault at this moment

#### Overrides

```ts
IRwaVaultInfoData.depositCap
```

***

### id

```ts
readonly id: IArmadaVaultId;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L27)

ID of the vault

#### Overrides

[`IPoolInfo`](IPoolInfo.md).[`id`](IPoolInfo.md#id)

***

### merklRewards

```ts
readonly merklRewards: object[] | undefined;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L52)

Vault Merkl rewards apy

#### Overrides

```ts
IRwaVaultInfoData.merklRewards
```

***

### rewardsApys

```ts
readonly rewardsApys: object[] | undefined;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:45](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L45)

Vault SUMR rewards apy

#### Overrides

```ts
IRwaVaultInfoData.rewardsApys
```

***

### sharePrice

```ts
readonly sharePrice: IPrice;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L39)

Current price per share of the vault

#### Overrides

```ts
IRwaVaultInfoData.sharePrice
```

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L29)

Token of the vault

#### Overrides

```ts
IRwaVaultInfoData.token
```

***

### totalDeposits

```ts
readonly totalDeposits: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L35)

Total amount of assets currently deposited in the vault

#### Overrides

```ts
IRwaVaultInfoData.totalDeposits
```

***

### totalShares

```ts
readonly totalShares: ITokenAmount;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L37)

Total amount of shares currently minted in the vault

#### Overrides

```ts
IRwaVaultInfoData.totalShares
```

***

### tvlUsd

```ts
readonly tvlUsd: IFiatCurrencyAmount;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L59)

Total value locked in USD

#### Overrides

```ts
IRwaVaultInfoData.tvlUsd
```

***

### type

```ts
readonly type: Rwa;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts:62](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IRwaVaultInfo.ts#L62)

Type of the pool

#### Overrides

[`IPoolInfo`](IPoolInfo.md).[`type`](IPoolInfo.md#type)
