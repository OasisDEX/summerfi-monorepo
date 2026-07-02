# Interface: IArmadaVaultInfo

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L20)

Interface for an the extended info of an Armada Protocol vault (fleet)

## Extends

- [`IPoolInfo`](IPoolInfo.md).[`IArmadaVaultInfoData`](../type-aliases/IArmadaVaultInfoData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L22)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IPoolInfo`](IPoolInfo.md).[`[___signature__]`](IPoolInfo.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPoolInfo.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolInfo.ts#L17)

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

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L38)

Vault apy

#### Overrides

```ts
IArmadaVaultInfoData.apy
```

***

### apys

```ts
readonly apys: VaultApys;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:40](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L40)

Vault apys for different time periods

#### Overrides

```ts
IArmadaVaultInfoData.apys
```

***

### assetToken

```ts
readonly assetToken: ITokenStanalone;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L28)

Underlying asset token that can be deposited into the vault

#### Overrides

```ts
IArmadaVaultInfoData.assetToken
```

***

### depositCap

```ts
readonly depositCap: ITokenAmount;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L30)

Maximum amount that can be deposited into the vault at this moment

#### Overrides

```ts
IArmadaVaultInfoData.depositCap
```

***

### id

```ts
readonly id: IArmadaVaultId;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L24)

ID of the vault

#### Overrides

[`IPoolInfo`](IPoolInfo.md).[`id`](IPoolInfo.md#id)

***

### merklRewards

```ts
readonly merklRewards: object[] | undefined;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L49)

Vault Merkl rewards apy

#### Overrides

```ts
IArmadaVaultInfoData.merklRewards
```

***

### rewardsApys

```ts
readonly rewardsApys: object[] | undefined;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L42)

Vault SUMR rewards apy

#### Overrides

```ts
IArmadaVaultInfoData.rewardsApys
```

***

### sharePrice

```ts
readonly sharePrice: IPrice;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L36)

Current price per share of the vault

#### Overrides

```ts
IArmadaVaultInfoData.sharePrice
```

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L26)

Token of the vault

#### Overrides

```ts
IArmadaVaultInfoData.token
```

***

### totalDeposits

```ts
readonly totalDeposits: ITokenAmount;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L32)

Total amount of assets currently deposited in the vault

#### Overrides

```ts
IArmadaVaultInfoData.totalDeposits
```

***

### totalShares

```ts
readonly totalShares: ITokenAmount;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L34)

Total amount of shares currently minted in the vault

#### Overrides

```ts
IArmadaVaultInfoData.totalShares
```

***

### tvlUsd

```ts
readonly tvlUsd: IFiatCurrencyAmount;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:56](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L56)

Total value locked in USD

#### Overrides

```ts
IArmadaVaultInfoData.tvlUsd
```

***

### type

```ts
readonly type: Armada;
```

Defined in: [src/common/interfaces/IArmadaVaultInfo.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultInfo.ts#L59)

Type of the pool

#### Overrides

[`IPoolInfo`](IPoolInfo.md).[`type`](IPoolInfo.md#type)
