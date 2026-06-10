# Interface: OpenPosition

Defined in: [src/simulation/interfaces/Steps.ts:130](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L130)

## Extends

- [`Step`](Step.md)\<[`OpenPosition`](../../../enumerations/SimulationSteps.md#openposition), \{
  `pool`: [`ILendingPool`](../../../interfaces/ILendingPool.md);
\}, \{
  `position`: [`ILendingPosition`](../../../interfaces/ILendingPosition.md);
\}\>

## Properties

### inputs

```ts
inputs: object;
```

Defined in: [src/simulation/interfaces/Steps.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L26)

#### pool

```ts
pool: ILendingPool;
```

#### Inherited from

[`Step`](Step.md).[`inputs`](Step.md#inputs)

***

### name

```ts
name: string;
```

Defined in: [src/simulation/interfaces/Steps.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L25)

#### Inherited from

[`Step`](Step.md).[`name`](Step.md#name)

***

### outputs

```ts
outputs: object;
```

Defined in: [src/simulation/interfaces/Steps.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L27)

#### position

```ts
position: ILendingPosition;
```

#### Inherited from

[`Step`](Step.md).[`outputs`](Step.md#outputs)

***

### skip?

```ts
optional skip: boolean;
```

Defined in: [src/simulation/interfaces/Steps.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L28)

#### Inherited from

[`Step`](Step.md).[`skip`](Step.md#skip)

***

### type

```ts
type: OpenPosition;
```

Defined in: [src/simulation/interfaces/Steps.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L24)

#### Inherited from

[`Step`](Step.md).[`type`](Step.md#type)
