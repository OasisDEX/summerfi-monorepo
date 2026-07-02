# Interface: IWallet

Defined in: [src/common/interfaces/IWallet.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IWallet.ts#L15)

Interface for the implementors of the wallet

This is present in the system in case it is needed to add extra information to the
wallet type

## Extends

- [`IWalletData`](../type-aliases/IWalletData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IWallet.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IWallet.ts#L17)

Signature to differentiate from similar interfaces

***

### address

```ts
readonly address: IAddress;
```

Defined in: [src/common/interfaces/IWallet.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IWallet.ts#L19)

Address of the wallet, valid for the different chains

#### Overrides

```ts
IWalletData.address
```

## Methods

### equals()

```ts
equals(token): boolean;
```

Defined in: [src/common/interfaces/IWallet.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IWallet.ts#L29)

Checks if two wallets are equal

#### Parameters

##### token

`IWallet`

#### Returns

`boolean`

true if the wallets are equal

Equality is determined by the address
