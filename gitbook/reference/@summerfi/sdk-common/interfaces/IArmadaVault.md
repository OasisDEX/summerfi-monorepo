# Interface: IArmadaVault

Defined in: [src/common/interfaces/IArmadaVault.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVault.ts#L14)

Interface for an ID of an Armada Protocol vault (fleet)

## Extends

- [`IPool`](IPool.md).[`IArmadaVaultData`](../type-aliases/IArmadaVaultData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IArmadaVault.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVault.ts#L16)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IPool`](IPool.md).[`[___signature__]`](IPool.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPool.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPool.ts#L19)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
IPool.[___signature__]
```

***

### id

```ts
readonly id: IArmadaVaultId;
```

Defined in: [src/common/interfaces/IArmadaVault.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVault.ts#L18)

ID of the vault

#### Overrides

[`IPool`](IPool.md).[`id`](IPool.md#id)

***

### type

```ts
readonly type: Armada;
```

Defined in: [src/common/interfaces/IArmadaVault.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVault.ts#L21)

Type of the pool

#### Overrides

[`IPool`](IPool.md).[`type`](IPool.md#type)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPool`](IPool.md).[`toString`](IPool.md#tostring)
