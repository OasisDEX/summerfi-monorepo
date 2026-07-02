# Class: RefinanceSimulation

Defined in: [src/simulation/implementation/RefinanceSimulation.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/RefinanceSimulation.ts#L21)

## See

IRefinanceSimulation

## Extends

- [`Simulation`](Simulation.md)

## Implements

- [`IRefinanceSimulation`](../interfaces/IRefinanceSimulation.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/simulation/implementation/RefinanceSimulation.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/RefinanceSimulation.ts#L23)

SIGNATURE

#### Implementation of

[`IRefinanceSimulation`](../interfaces/IRefinanceSimulation.md).[`[___signature__]`](../interfaces/IRefinanceSimulation.md#___signature__-1)

#### Inherited from

[`Simulation`](Simulation.md).[`[___signature__]`](Simulation.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/simulation/implementation/Simulation.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/Simulation.ts#L15)

SIGNATURE

#### Implementation of

```ts
IRefinanceSimulation.[___signature__]
```

#### Inherited from

```ts
Simulation.[___signature__]
```

***

### sourcePosition

```ts
readonly sourcePosition: ILendingPosition;
```

Defined in: [src/simulation/implementation/RefinanceSimulation.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/RefinanceSimulation.ts#L26)

ATTRIBUTES

#### Implementation of

[`IRefinanceSimulation`](../interfaces/IRefinanceSimulation.md).[`sourcePosition`](../interfaces/IRefinanceSimulation.md#sourceposition)

***

### steps

```ts
readonly steps: Steps[];
```

Defined in: [src/simulation/implementation/RefinanceSimulation.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/RefinanceSimulation.ts#L29)

Steps needed to perform the refinance

#### Implementation of

[`IRefinanceSimulation`](../interfaces/IRefinanceSimulation.md).[`steps`](../interfaces/IRefinanceSimulation.md#steps)

***

### swaps

```ts
readonly swaps: SimulatedSwapData[];
```

Defined in: [src/simulation/implementation/RefinanceSimulation.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/RefinanceSimulation.ts#L28)

The details of any swaps required as part of the simulation

#### Implementation of

[`IRefinanceSimulation`](../interfaces/IRefinanceSimulation.md).[`swaps`](../interfaces/IRefinanceSimulation.md#swaps)

***

### targetPosition

```ts
readonly targetPosition: ILendingPosition;
```

Defined in: [src/simulation/implementation/RefinanceSimulation.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/RefinanceSimulation.ts#L27)

Simulated target position

#### Implementation of

[`IRefinanceSimulation`](../interfaces/IRefinanceSimulation.md).[`targetPosition`](../interfaces/IRefinanceSimulation.md#targetposition)

***

### type

```ts
readonly type: Refinance = SimulationType.Refinance;
```

Defined in: [src/simulation/implementation/RefinanceSimulation.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/RefinanceSimulation.ts#L30)

ATTRIBUTES

#### Implementation of

[`IRefinanceSimulation`](../interfaces/IRefinanceSimulation.md).[`type`](../interfaces/IRefinanceSimulation.md#type)

#### Overrides

[`Simulation`](Simulation.md).[`type`](Simulation.md#type)

## Methods

### createFrom()

```ts
static createFrom(params): RefinanceSimulation;
```

Defined in: [src/simulation/implementation/RefinanceSimulation.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/RefinanceSimulation.ts#L33)

FACTORY

#### Parameters

##### params

[`RefinanceSimulationParameters`](../type-aliases/RefinanceSimulationParameters.md)

#### Returns

`RefinanceSimulation`
