# Class: ArmadaVaultId

Defined in: [src/common/implementation/ArmadaVaultId.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L24)

ArmadaVaultId

## See

IArmadaVaultId

## Extends

- `PoolId`

## Implements

- [`IArmadaVaultId`](../interfaces/IArmadaVaultId.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/ArmadaVaultId.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L26)

SIGNATURE

#### Implementation of

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md).[`[___signature__]`](../interfaces/IArmadaVaultId.md#___signature__-1)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/PoolId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolId.ts#L18)

SIGNATURE

#### Implementation of

```ts
IArmadaVaultId.[___signature__]
```

#### Inherited from

[`LendingPoolId`](LendingPoolId.md).[`[___signature__]`](LendingPoolId.md#___signature__-1)

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [src/common/implementation/ArmadaVaultId.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L30)

Chain where the fleet is deployed

#### Implementation of

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md).[`chainInfo`](../interfaces/IArmadaVaultId.md#chaininfo)

***

### fleetAddress

```ts
readonly fleetAddress: IAddress;
```

Defined in: [src/common/implementation/ArmadaVaultId.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L31)

Address of the fleet commander that gives access to the pool

#### Implementation of

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md).[`fleetAddress`](../interfaces/IArmadaVaultId.md#fleetaddress)

***

### protocol

```ts
readonly protocol: IArmadaProtocol;
```

Defined in: [src/common/implementation/ArmadaVaultId.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L32)

Protocol where the pool is

#### Implementation of

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md).[`protocol`](../interfaces/IArmadaVaultId.md#protocol)

#### Overrides

```ts
PoolId.protocol
```

***

### type

```ts
readonly type: Armada = PoolType.Armada;
```

Defined in: [src/common/implementation/ArmadaVaultId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L29)

ATTRIBUTES

#### Implementation of

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md).[`type`](../interfaces/IArmadaVaultId.md#type)

#### Overrides

```ts
PoolId.type
```

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/PoolId.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolId.ts#L32)

#### Returns

`string`

#### See

IPrintable.toString

#### Inherited from

```ts
PoolId.toString
```

***

### createFrom()

```ts
static createFrom(params): ArmadaVaultId;
```

Defined in: [src/common/implementation/ArmadaVaultId.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L35)

FACTORY

#### Parameters

##### params

[`ArmadaVaultIdParameters`](../type-aliases/ArmadaVaultIdParameters.md)

#### Returns

`ArmadaVaultId`

***

### createFromEthereum()

```ts
static createFromEthereum(params): ArmadaVaultId;
```

Defined in: [src/common/implementation/ArmadaVaultId.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L39)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddressValue

`` `0x${string}` ``

#### Returns

`ArmadaVaultId`
