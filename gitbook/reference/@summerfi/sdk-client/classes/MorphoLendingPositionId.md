# Class: MorphoLendingPositionId

Defined in: [../protocol-plugins/src/plugins/morphoblue/implementation/MorphoLendingPositionId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/morphoblue/implementation/MorphoLendingPositionId.ts#L16)

## See

IMorphoLendingPositionId

## Extends

- [`LendingPositionId`](LendingPositionId.md)

## Implements

- `IMorphoLendingPositionId`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/morphoblue/implementation/MorphoLendingPositionId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/morphoblue/implementation/MorphoLendingPositionId.ts#L18)

SIGNATURE

#### Implementation of

```ts
IMorphoLendingPositionId.[___signature__]
```

#### Inherited from

[`LendingPositionId`](LendingPositionId.md).[`[___signature__]`](LendingPositionId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPositionId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPositionId.ts#L16)

SIGNATURE

#### Implementation of

```ts
IMorphoLendingPositionId.[___signature__]
```

#### Inherited from

```ts
LendingPositionId.[___signature__]
```

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/PositionId.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L15)

SIGNATURE

#### Implementation of

```ts
IMorphoLendingPositionId.[___signature__]
```

#### Inherited from

```ts
LendingPositionId.[___signature__]
```

***

### id

```ts
readonly id: string;
```

Defined in: [../sdk-common/src/common/implementation/PositionId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PositionId.ts#L18)

ATTRIBUTES

#### Implementation of

```ts
IMorphoLendingPositionId.id
```

#### Inherited from

[`LendingPositionId`](LendingPositionId.md).[`id`](LendingPositionId.md#id)

***

### type

```ts
readonly type: Lending = PositionType.Lending;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPositionId.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPositionId.ts#L19)

ATTRIBUTES

#### Implementation of

```ts
IMorphoLendingPositionId.type
```

#### Inherited from

[`LendingPositionId`](LendingPositionId.md).[`type`](LendingPositionId.md#type)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPositionId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPositionId.ts#L29)

#### Returns

`string`

#### See

IPrintable.toString

#### Inherited from

[`LendingPositionId`](LendingPositionId.md).[`toString`](LendingPositionId.md#tostring)

***

### createFrom()

```ts
static createFrom(params): MorphoLendingPositionId;
```

Defined in: [../protocol-plugins/src/plugins/morphoblue/implementation/MorphoLendingPositionId.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/morphoblue/implementation/MorphoLendingPositionId.ts#L21)

FACTORY

#### Parameters

##### params

`MorphoLendingPositionIdParameters`

#### Returns

`MorphoLendingPositionId`
