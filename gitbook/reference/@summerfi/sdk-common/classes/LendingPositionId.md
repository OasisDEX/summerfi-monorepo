# Abstract Class: LendingPositionId

Defined in: [src/lending-protocols/implementation/LendingPositionId.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPositionId.ts#L14)

## See

ILendingPositionId

## Extends

- [`PositionId`](PositionId.md)

## Extended by

- [`ExternalLendingPositionId`](ExternalLendingPositionId.md)

## Implements

- [`ILendingPositionIdData`](../type-aliases/ILendingPositionIdData.md)

## Constructors

### Constructor

```ts
protected new LendingPositionId(params): LendingPositionId;
```

Defined in: [src/lending-protocols/implementation/LendingPositionId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPositionId.ts#L22)

SEALED CONSTRUCTOR

#### Parameters

##### params

[`LendingPositionIdParameters`](../type-aliases/LendingPositionIdParameters.md)

#### Returns

`LendingPositionId`

#### Overrides

[`PositionId`](PositionId.md).[`constructor`](PositionId.md#constructor)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/lending-protocols/implementation/LendingPositionId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPositionId.ts#L16)

SIGNATURE

#### Inherited from

[`PositionId`](PositionId.md).[`[___signature__]`](PositionId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/PositionId.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L15)

SIGNATURE

#### Inherited from

```ts
PositionId.[___signature__]
```

***

### id

```ts
readonly id: string;
```

Defined in: [src/common/implementation/PositionId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L18)

ATTRIBUTES

#### Implementation of

```ts
ILendingPositionIdData.id
```

#### Inherited from

[`PositionId`](PositionId.md).[`id`](PositionId.md#id)

***

### type

```ts
readonly type: Lending = PositionType.Lending;
```

Defined in: [src/lending-protocols/implementation/LendingPositionId.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPositionId.ts#L19)

ATTRIBUTES

#### Implementation of

```ts
ILendingPositionIdData.type
```

#### Overrides

[`PositionId`](PositionId.md).[`type`](PositionId.md#type)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/lending-protocols/implementation/LendingPositionId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPositionId.ts#L29)

#### Returns

`string`

#### See

IPrintable.toString

#### Overrides

[`PositionId`](PositionId.md).[`toString`](PositionId.md#tostring)
