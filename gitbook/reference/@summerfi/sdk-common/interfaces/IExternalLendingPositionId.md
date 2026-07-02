# Interface: IExternalLendingPositionId

Defined in: [src/orders/importing/interfaces/IExternalLendingPositionId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPositionId.ts#L22)

Identifier for an external position to the Summer system

## Extends

- [`IExternalLendingPositionIdData`](../type-aliases/IExternalLendingPositionIdData.md).[`ILendingPositionId`](ILendingPositionId.md).[`IPrintable`](IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/orders/importing/interfaces/IExternalLendingPositionId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPositionId.ts#L25)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`ILendingPositionId`](ILendingPositionId.md).[`[___signature__]`](ILendingPositionId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/lending-protocols/interfaces/ILendingPositionId.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPositionId.ts#L15)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
ILendingPositionId.[___signature__]
```

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPositionId.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L14)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
ILendingPositionId.[___signature__]
```

***

### address

```ts
readonly address: IAddress;
```

Defined in: [src/orders/importing/interfaces/IExternalLendingPositionId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPositionId.ts#L29)

Address of the owner of the position

#### Overrides

```ts
IExternalLendingPositionIdData.address
```

***

### externalType

```ts
readonly externalType: ExternalLendingPositionType;
```

Defined in: [src/orders/importing/interfaces/IExternalLendingPositionId.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPositionId.ts#L27)

Type of the position

#### Overrides

```ts
IExternalLendingPositionIdData.externalType
```

***

### id

```ts
readonly id: string;
```

Defined in: [src/common/interfaces/IPositionId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L25)

#### Inherited from

[`ILendingPositionId`](ILendingPositionId.md).[`id`](ILendingPositionId.md#id)

***

### protocolId

```ts
readonly protocolId: ILendingPositionId;
```

Defined in: [src/orders/importing/interfaces/IExternalLendingPositionId.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPositionId.ts#L31)

ID of the lending protocol

#### Overrides

```ts
IExternalLendingPositionIdData.protocolId
```

***

### type

```ts
readonly type: Lending;
```

Defined in: [src/lending-protocols/interfaces/ILendingPositionId.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPositionId.ts#L26)

Type of the position

#### Inherited from

[`ILendingPositionId`](ILendingPositionId.md).[`type`](ILendingPositionId.md#type)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)
