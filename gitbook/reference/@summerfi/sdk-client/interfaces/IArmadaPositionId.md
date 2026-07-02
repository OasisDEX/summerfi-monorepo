# Interface: IArmadaPositionId

Defined in: [../sdk-common/src/common/interfaces/IArmadaPositionId.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L14)

Interface for an ID of an Armada Protocol position

## Extends

- [`IPositionId`](IPositionId.md).[`IArmadaPositionIdData`](../type-aliases/IArmadaPositionIdData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPositionId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L16)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IPositionId`](IPositionId.md).[`[___signature__]`](IPositionId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPositionId.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L14)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
IPositionId.[___signature__]
```

***

### id

```ts
readonly id: string;
```

Defined in: [../sdk-common/src/common/interfaces/IPositionId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L16)

#### Inherited from

[`IPositionId`](IPositionId.md).[`id`](IPositionId.md#id)

***

### type

```ts
readonly type: Armada;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPositionId.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L21)

Type of the position

#### Overrides

[`IPositionId`](IPositionId.md).[`type`](IPositionId.md#type)

***

### user

```ts
readonly user: IUser;
```

Defined in: [../sdk-common/src/common/interfaces/IArmadaPositionId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L18)

User that opened the position, used to identify the position in a Fleet Commander

#### Overrides

```ts
IArmadaPositionIdData.user
```
