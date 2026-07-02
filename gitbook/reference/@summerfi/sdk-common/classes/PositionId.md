# Abstract Class: PositionId

Defined in: [src/common/implementation/PositionId.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L13)

## See

IPositionIdData

## Extended by

- [`ArmadaPositionId`](ArmadaPositionId.md)
- [`LendingPositionId`](LendingPositionId.md)

## Implements

- [`IPositionId`](../interfaces/IPositionId.md)

## Constructors

### Constructor

```ts
protected new PositionId(params): PositionId;
```

Defined in: [src/common/implementation/PositionId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L22)

SEALED CONSTRUCTOR

#### Parameters

##### params

[`PositionIdParameters`](../type-aliases/PositionIdParameters.md)

#### Returns

`PositionId`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/PositionId.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L15)

SIGNATURE

#### Implementation of

[`IPositionId`](../interfaces/IPositionId.md).[`[___signature__]`](../interfaces/IPositionId.md#___signature__)

***

### id

```ts
readonly id: string;
```

Defined in: [src/common/implementation/PositionId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L18)

ATTRIBUTES

#### Implementation of

[`IPositionId`](../interfaces/IPositionId.md).[`id`](../interfaces/IPositionId.md#id)

***

### type

```ts
abstract readonly type: PositionType;
```

Defined in: [src/common/implementation/PositionId.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L19)

Type of the position

#### Implementation of

[`IPositionId`](../interfaces/IPositionId.md).[`type`](../interfaces/IPositionId.md#type)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/PositionId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L29)

#### Returns

`string`

#### See

IPrintable.toString
