# Class: ImportPositionParameters

Defined in: [../sdk-common/src/orders/importing/implementation/ImportPositionParameters.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ImportPositionParameters.ts#L18)

## See

IImportPositionParameters

## Implements

- [`IImportPositionParameters`](../interfaces/IImportPositionParameters.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ImportPositionParameters.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ImportPositionParameters.ts#L20)

SIGNATURE

#### Implementation of

[`IImportPositionParameters`](../interfaces/IImportPositionParameters.md).[`[___signature__]`](../interfaces/IImportPositionParameters.md#___signature__)

***

### externalPosition

```ts
readonly externalPosition: IExternalLendingPosition;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ImportPositionParameters.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ImportPositionParameters.ts#L23)

ATTRIBUTES

#### Implementation of

[`IImportPositionParameters`](../interfaces/IImportPositionParameters.md).[`externalPosition`](../interfaces/IImportPositionParameters.md#externalposition)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ImportPositionParameters.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ImportPositionParameters.ts#L38)

#### Returns

`string`

#### See

IPrintable.toString

***

### createFrom()

```ts
static createFrom(params): ImportPositionParameters;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ImportPositionParameters.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ImportPositionParameters.ts#L26)

FACTORY

#### Parameters

##### params

[`ImportPositionParametersParameters`](../type-aliases/ImportPositionParametersParameters.md)

#### Returns

`ImportPositionParameters`
