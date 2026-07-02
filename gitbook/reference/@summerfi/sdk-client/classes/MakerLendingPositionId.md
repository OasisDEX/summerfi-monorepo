# Class: MakerLendingPositionId

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPositionId.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPositionId.ts#L17)

## See

IMakerLendingPositionIdData

## Extends

- [`LendingPositionId`](LendingPositionId.md)

## Implements

- `IMakerLendingPositionId`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPositionId.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPositionId.ts#L19)

SIGNATURE

#### Implementation of

```ts
IMakerLendingPositionId.[___signature__]
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
IMakerLendingPositionId.[___signature__]
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
IMakerLendingPositionId.[___signature__]
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
IMakerLendingPositionId.id
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
IMakerLendingPositionId.type
```

#### Inherited from

[`LendingPositionId`](LendingPositionId.md).[`type`](LendingPositionId.md#type)

***

### vaultId

```ts
readonly vaultId: string;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPositionId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPositionId.ts#L22)

ATTRIBUTES

#### Implementation of

```ts
IMakerLendingPositionId.vaultId
```

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
static createFrom(params): MakerLendingPositionId;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPositionId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPositionId.ts#L25)

FACTORY

#### Parameters

##### params

[`MakerLendingPositionIdParameters`](../type-aliases/MakerLendingPositionIdParameters.md)

#### Returns

`MakerLendingPositionId`
