# Interface: PullTokenStep

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L39)

## Extends

- [`Step`](Step.md)\<[`PullToken`](../../../enumerations/SimulationSteps.md#pulltoken), \{
  `amount`: [`ReferenceableField`](../../../type-aliases/ReferenceableField.md)\<[`ITokenAmount`](../../../interfaces/ITokenAmount.md)\>;
\}\>

## Properties

### inputs

```ts
inputs: object;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L26)

#### amount

```ts
amount: ReferenceableField<ITokenAmount>;
```

#### Inherited from

[`Step`](Step.md).[`inputs`](Step.md#inputs)

***

### name

```ts
name: string;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L25)

#### Inherited from

[`Step`](Step.md).[`name`](Step.md#name)

***

### outputs

```ts
outputs: undefined;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L27)

#### Inherited from

[`Step`](Step.md).[`outputs`](Step.md#outputs)

***

### skip?

```ts
optional skip: boolean;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L28)

#### Inherited from

[`Step`](Step.md).[`skip`](Step.md#skip)

***

### type

```ts
type: PullToken;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L24)

#### Inherited from

[`Step`](Step.md).[`type`](Step.md#type)
