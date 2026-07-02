# Interface: IArmadaVaultId

Defined in: [../sdk-common/src/common/interfaces/IArmadaVaultId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultId.ts#L16)

Interface for an ID of an Armada Protocol pool (fleet)

## Extends

- [`IPoolId`](IPoolId.md).[`IArmadaVaultIdData`](../type-aliases/IArmadaVaultIdData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaVaultId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultId.ts#L18)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IPoolId`](IPoolId.md).[`[___signature__]`](IPoolId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPoolId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L18)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
IPoolId.[___signature__]
```

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaVaultId.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultId.ts#L20)

Chain where the fleet is deployed

#### Overrides

```ts
IArmadaVaultIdData.chainInfo
```

***

### fleetAddress

```ts
readonly fleetAddress: IAddress;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaVaultId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultId.ts#L22)

Address of the fleet commander that gives access to the pool

#### Overrides

```ts
IArmadaVaultIdData.fleetAddress
```

***

### protocol

```ts
readonly protocol: IArmadaProtocol;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaVaultId.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultId.ts#L26)

Protocol where the pool is

#### Overrides

[`IPoolId`](IPoolId.md).[`protocol`](IPoolId.md#protocol)

***

### type

```ts
readonly type: Armada;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaVaultId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultId.ts#L25)

Pool type

#### Overrides

[`IPoolId`](IPoolId.md).[`type`](IPoolId.md#type)
