# Interface: IPosition

Defined in: [src/common/interfaces/IPosition.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L14)

Represents a Summer position in a pool/protocol

## Extends

- [`IPositionData`](../type-aliases/IPositionData.md)

## Extended by

- [`IArmadaPosition`](IArmadaPosition.md)
- [`ILendingPosition`](ILendingPosition.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPosition.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L16)

Signature to differentiate from similar interfaces

***

### id

```ts
readonly id: IPositionId;
```

Defined in: [src/common/interfaces/IPosition.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L20)

Unique identifier for the position inside the Summer.fi system

#### Overrides

```ts
IPositionData.id
```

***

### pool

```ts
readonly pool: IPool;
```

Defined in: [src/common/interfaces/IPosition.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L22)

Pool where the position is opened

#### Overrides

```ts
IPositionData.pool
```

***

### type

```ts
readonly type: PositionType;
```

Defined in: [src/common/interfaces/IPosition.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L18)

Type of the position in the Summer.fi system

#### Overrides

```ts
IPositionData.type
```
