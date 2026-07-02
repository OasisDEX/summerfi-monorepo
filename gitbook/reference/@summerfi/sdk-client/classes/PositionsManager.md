# Class: PositionsManager

Defined in: [../sdk-common/src/orders/common/implementation/PositionsManager.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/implementation/PositionsManager.ts#L9)

## See

IPositionsManager

## Implements

- [`IPositionsManager`](../interfaces/IPositionsManager.md)
- [`IPrintable`](../interfaces/IPrintable.md)

## Properties

### address

```ts
address: IAddress;
```

Defined in: [../sdk-common/src/orders/common/implementation/PositionsManager.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/implementation/PositionsManager.ts#L10)

Address of the Positions Manager

#### Implementation of

[`IPositionsManager`](../interfaces/IPositionsManager.md).[`address`](../interfaces/IPositionsManager.md#address)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/orders/common/implementation/PositionsManager.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/implementation/PositionsManager.ts#L22)

Returns a string representation of an object.

#### Returns

`string`

#### Implementation of

[`IPrintable`](../interfaces/IPrintable.md).[`toString`](../interfaces/IPrintable.md#tostring)

***

### createFrom()

```ts
static createFrom(params): PositionsManager;
```

Defined in: [../sdk-common/src/orders/common/implementation/PositionsManager.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/implementation/PositionsManager.ts#L13)

Factory method

#### Parameters

##### params

[`IPositionsManagerData`](../type-aliases/IPositionsManagerData.md)

#### Returns

`PositionsManager`
