# Class: Wallet

Defined in: [../sdk-common/src/common/implementation/Wallet.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Wallet.ts#L13)

## See

IWalletData

## Implements

- [`IWallet`](../interfaces/IWallet.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/Wallet.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Wallet.ts#L15)

SIGNATURE

#### Implementation of

[`IWallet`](../interfaces/IWallet.md).[`[___signature__]`](../interfaces/IWallet.md#___signature__)

***

### address

```ts
readonly address: IAddress;
```

Defined in: [../sdk-common/src/common/implementation/Wallet.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Wallet.ts#L18)

ATTRIBUTES

#### Implementation of

[`IWallet`](../interfaces/IWallet.md).[`address`](../interfaces/IWallet.md#address)

## Methods

### equals()

```ts
equals(wallet): boolean;
```

Defined in: [../sdk-common/src/common/implementation/Wallet.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Wallet.ts#L33)

#### Parameters

##### wallet

`Wallet`

#### Returns

`boolean`

#### See

IWallet.equals

#### Implementation of

[`IWallet`](../interfaces/IWallet.md).[`equals`](../interfaces/IWallet.md#equals)

***

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/implementation/Wallet.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Wallet.ts#L38)

#### Returns

`string`

#### See

IPrintable.toString

***

### createFrom()

```ts
static createFrom(params): Wallet;
```

Defined in: [../sdk-common/src/common/implementation/Wallet.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Wallet.ts#L21)

FACTORY

#### Parameters

##### params

[`WalletParameters`](../type-aliases/WalletParameters.md)

#### Returns

`Wallet`
