# Interface: IImportSimulation

Defined in: [src/simulation/interfaces/IImportSimulation.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IImportSimulation.ts#L22)

Simulation result of an import operation

## Extends

- [`ISimulation`](ISimulation.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/simulation/interfaces/IImportSimulation.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IImportSimulation.ts#L24)

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
readonly sourcePosition: IExternalLendingPosition;
```

Defined in: [src/simulation/interfaces/IImportSimulation.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IImportSimulation.ts#L26)

Original position that will be refinanced

***

### steps

```ts
readonly steps: Steps[];
```

Defined in: [src/simulation/interfaces/IImportSimulation.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IImportSimulation.ts#L30)

Steps needed to perform the refinance

***

### targetPosition

```ts
readonly targetPosition: ILendingPosition;
```

Defined in: [src/simulation/interfaces/IImportSimulation.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IImportSimulation.ts#L28)

Simulated target position

***

### type

```ts
readonly type: ImportPosition;
```

Defined in: [src/simulation/interfaces/IImportSimulation.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IImportSimulation.ts#L33)

The type of the simulation

#### Overrides

[`ISimulation`](ISimulation.md).[`type`](ISimulation.md#type)
