# Interface: IPositionId

Defined in: [../sdk-common/src/common/interfaces/IPositionId.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L12)

Represents a unique identifier for a position in the Summer system

## Extends

- [`IPositionIdData`](../type-aliases/IPositionIdData.md)

## Extended by

- [`IArmadaPositionId`](IArmadaPositionId.md)
- [`ILendingPositionId`](ILendingPositionId.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPositionId.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L14)

Signature to differentiate from similar interfaces

***

### id

```ts
readonly id: string;
```

Defined in: [../sdk-common/src/common/interfaces/IPositionId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L16)

#### Overrides

```ts
IPositionIdData.id
```

***

### type

```ts
readonly type: PositionType;
```

Defined in: [../sdk-common/src/common/interfaces/IPositionId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPositionId.ts#L18)

Type of the position

#### Overrides

```ts
IPositionIdData.type
```
