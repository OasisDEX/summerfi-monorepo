# Class: ArmadaVaultId

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultId.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L23)

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

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L25)

SIGNATURE

#### Implementation of

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md).[`[___signature__]`](../interfaces/IArmadaVaultId.md#___signature__-1)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/PoolId.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolId.ts#L17)

SIGNATURE

#### Implementation of

```ts
IArmadaVaultId.[___signature__]
```

#### Inherited from

```ts
PoolId.[___signature__]
```

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L29)

Chain where the fleet is deployed

#### Implementation of

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md).[`chainInfo`](../interfaces/IArmadaVaultId.md#chaininfo)

***

### fleetAddress

```ts
readonly fleetAddress: IAddress;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultId.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L30)

Address of the fleet commander that gives access to the pool

#### Implementation of

[`IArmadaVaultId`](../interfaces/IArmadaVaultId.md).[`fleetAddress`](../interfaces/IArmadaVaultId.md#fleetaddress)

***

### protocol

```ts
readonly protocol: IArmadaProtocol;
```

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultId.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L31)

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

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultId.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L28)

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

Defined in: [../sdk-common/src/common/implementation/PoolId.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolId.ts#L31)

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

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultId.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L34)

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

Defined in: [../sdk-common/src/common/implementation/ArmadaVaultId.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaVaultId.ts#L38)

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### fleetAddressValue

`` `0x${string}` ``

#### Returns

`ArmadaVaultId`
