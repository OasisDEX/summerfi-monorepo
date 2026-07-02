# Interface: ILendingPositionId

Defined in: [src/lending-protocols/interfaces/ILendingPositionId.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPositionId.ts#L13)

Represents a position ID for a lending position

## Extends

- [`IPositionId`](IPositionId.md)

## Extended by

- [`IExternalLendingPositionId`](IExternalLendingPositionId.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/lending-protocols/interfaces/ILendingPositionId.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPositionId.ts#L15)

Signature to differentiate from similar interfaces

#### Inherited from

[`IPositionId`](IPositionId.md).[`[___signature__]`](IPositionId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPositionId.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L14)

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

Defined in: [src/common/interfaces/IPositionId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L16)

#### Inherited from

[`IPositionId`](IPositionId.md).[`id`](IPositionId.md#id)

***

### type

```ts
readonly type: Lending;
```

Defined in: [src/lending-protocols/interfaces/ILendingPositionId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPositionId.ts#L18)

Type of the position

#### Overrides

[`IPositionId`](IPositionId.md).[`type`](IPositionId.md#type)
