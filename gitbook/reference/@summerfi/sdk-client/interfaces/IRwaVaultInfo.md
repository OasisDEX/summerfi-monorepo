# Interface: IRwaVaultInfo

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L22)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L24)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IPoolInfo`](IPoolInfo.md).[`[___signature__]`](IPoolInfo.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPoolInfo.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolInfo.ts#L17)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:40](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L40)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L42)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L30)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L32)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L26)

ID of the vault

#### Overrides

[`IPoolInfo`](IPoolInfo.md).[`id`](IPoolInfo.md#id)

***

### merklRewards

```ts
readonly merklRewards: object[] | undefined;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:51](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L51)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L44)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L38)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L28)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L34)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L36)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:58](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L58)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultInfo.ts:61](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultInfo.ts#L61)

Type of the pool

#### Overrides

[`IPoolInfo`](IPoolInfo.md).[`type`](IPoolInfo.md#type)
