# Interface: IArmadaPositionId

Defined in: [src/common/interfaces/IArmadaPositionId.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L15)

IArmadaPositionId

## Description

Interface for an ID of an Armada Protocol position

## Extends

- [`IPositionId`](IPositionId.md).[`IArmadaPositionIdData`](../type-aliases/IArmadaPositionIdData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IArmadaPositionId.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L17)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IPositionId`](IPositionId.md).[`[___signature__]`](IPositionId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPositionId.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L15)

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

Defined in: [src/common/interfaces/IPositionId.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L17)

#### Inherited from

[`IPositionId`](IPositionId.md).[`id`](IPositionId.md#id)

***

### type

```ts
readonly type: Armada;
```

Defined in: [src/common/interfaces/IArmadaPositionId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L22)

Type of the position

#### Overrides

[`IPositionId`](IPositionId.md).[`type`](IPositionId.md#type)

***

### user

```ts
readonly user: IUser;
```

Defined in: [src/common/interfaces/IArmadaPositionId.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaPositionId.ts#L19)

User that opened the position, used to identify the position in a Fleet Commander

#### Overrides

```ts
IArmadaPositionIdData.user
```
