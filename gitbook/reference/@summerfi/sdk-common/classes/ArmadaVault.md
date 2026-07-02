# Class: ArmadaVault

Defined in: [src/common/implementation/ArmadaVault.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVault.ts#L16)

## See

IArmadaVault

## Extends

- `Pool`

## Implements

- [`IArmadaVault`](../interfaces/IArmadaVault.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/ArmadaVault.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVault.ts#L18)

SIGNATURE

#### Implementation of

[`IArmadaVault`](../interfaces/IArmadaVault.md).[`[___signature__]`](../interfaces/IArmadaVault.md#___signature__-1)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/Pool.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Pool.ts#L17)

SIGNATURE

#### Implementation of

```ts
IArmadaVault.[___signature__]
```

#### Inherited from

[`LendingPool`](LendingPool.md).[`[___signature__]`](LendingPool.md#___signature__-1)

***

### id

```ts
readonly id: IArmadaVaultId;
```

Defined in: [src/common/implementation/ArmadaVault.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVault.ts#L22)

ID of the vault

#### Implementation of

[`IArmadaVault`](../interfaces/IArmadaVault.md).[`id`](../interfaces/IArmadaVault.md#id)

#### Overrides

```ts
Pool.id
```

***

### type

```ts
readonly type: Armada = PoolType.Armada;
```

Defined in: [src/common/implementation/ArmadaVault.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVault.ts#L21)

ATTRIBUTES

#### Implementation of

[`IArmadaVault`](../interfaces/IArmadaVault.md).[`type`](../interfaces/IArmadaVault.md#type)

#### Overrides

```ts
Pool.type
```

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/Pool.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Pool.ts#L31)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`IArmadaVault`](../interfaces/IArmadaVault.md).[`toString`](../interfaces/IArmadaVault.md#tostring)

#### Inherited from

```ts
Pool.toString
```

***

### createFrom()

```ts
static createFrom(params): ArmadaVault;
```

Defined in: [src/common/implementation/ArmadaVault.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVault.ts#L25)

FACTORY

#### Parameters

##### params

[`ArmadaVaultParameters`](../type-aliases/ArmadaVaultParameters.md)

#### Returns

`ArmadaVault`
