# Abstract Class: Simulation

Defined in: [../sdk-common/src/simulation/implementation/Simulation.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/Simulation.ts#L13)

## See

ISimulation

## Extended by

- [`ImportSimulation`](ImportSimulation.md)
- [`RefinanceSimulation`](RefinanceSimulation.md)

## Implements

- [`ISimulation`](../interfaces/ISimulation.md)

## Constructors

### Constructor

```ts
protected new Simulation(_): Simulation;
```

Defined in: [../sdk-common/src/simulation/implementation/Simulation.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/Simulation.ts#L21)

SEALED CONSTRUCTOR

#### Parameters

##### \_

[`SimulationParams`](../type-aliases/SimulationParams.md)

#### Returns

`Simulation`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/simulation/implementation/Simulation.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/Simulation.ts#L15)

SIGNATURE

#### Implementation of

[`ISimulation`](../interfaces/ISimulation.md).[`[___signature__]`](../interfaces/ISimulation.md#___signature__)

***

### type

```ts
abstract readonly type: SimulationType;
```

Defined in: [../sdk-common/src/simulation/implementation/Simulation.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/implementation/Simulation.ts#L18)

ATTRIBUTES

#### Implementation of

[`ISimulation`](../interfaces/ISimulation.md).[`type`](../interfaces/ISimulation.md#type)
