# Interface: IPosition

Defined in: [../sdk-common/src/common/interfaces/IPosition.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L15)

## Name

IPosition

## Description

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

Defined in: [../sdk-common/src/common/interfaces/IPosition.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L17)

Signature to differentiate from similar interfaces

***

### id

```ts
readonly id: IPositionId;
```

Defined in: [../sdk-common/src/common/interfaces/IPosition.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L21)

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

Defined in: [../sdk-common/src/common/interfaces/IPosition.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L23)

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

Defined in: [../sdk-common/src/common/interfaces/IPosition.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L19)

Type of the position in the Summer.fi system

#### Overrides

```ts
IPositionData.type
```
