# Interface: IRefinanceSimulation

Defined in: [src/simulation/interfaces/IRefinanceSimulation.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IRefinanceSimulation.ts#L19)

Simulation result of a refinance operation

## Extends

- [`ISimulation`](ISimulation.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/simulation/interfaces/IRefinanceSimulation.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IRefinanceSimulation.ts#L21)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`ISimulation`](ISimulation.md).[`[___signature__]`](ISimulation.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/simulation/interfaces/ISimulation.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/ISimulation.ts#L14)

Signature used to differentiate it from similar interfaces

#### Inherited from

```ts
ISimulation.[___signature__]
```

***

### sourcePosition

```ts
readonly sourcePosition: ILendingPosition;
```

Defined in: [src/simulation/interfaces/IRefinanceSimulation.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IRefinanceSimulation.ts#L23)

Original position that will be refinanced

***

### steps

```ts
readonly steps: Steps[];
```

Defined in: [src/simulation/interfaces/IRefinanceSimulation.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IRefinanceSimulation.ts#L29)

Steps needed to perform the refinance

***

### swaps

```ts
readonly swaps: SimulatedSwapData[];
```

Defined in: [src/simulation/interfaces/IRefinanceSimulation.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IRefinanceSimulation.ts#L27)

The details of any swaps required as part of the simulation

***

### targetPosition

```ts
readonly targetPosition: ILendingPosition;
```

Defined in: [src/simulation/interfaces/IRefinanceSimulation.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IRefinanceSimulation.ts#L25)

Simulated target position

***

### type

```ts
readonly type: Refinance;
```

Defined in: [src/simulation/interfaces/IRefinanceSimulation.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IRefinanceSimulation.ts#L32)

The type of the simulation

#### Overrides

[`ISimulation`](ISimulation.md).[`type`](ISimulation.md#type)
