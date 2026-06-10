# Interface: Step\<T, I, O\>

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L23)

## Extended by

- [`FlashloanStep`](FlashloanStep.md)
- [`PullTokenStep`](PullTokenStep.md)
- [`DepositBorrowStep`](DepositBorrowStep.md)
- [`PaybackWithdrawStep`](PaybackWithdrawStep.md)
- [`SkippedStep`](SkippedStep.md)
- [`SwapStep`](SwapStep.md)
- [`ReturnFundsStep`](ReturnFundsStep.md)
- [`RepayFlashloanStep`](RepayFlashloanStep.md)
- [`NewPositionEventStep`](NewPositionEventStep.md)
- [`ImportStep`](ImportStep.md)
- [`OpenPosition`](OpenPosition.md)

## Type Parameters

### T

`T` *extends* [`SimulationSteps`](../../../enumerations/SimulationSteps.md)

### I

`I`

### O

`O` = `undefined`

## Properties

### inputs

```ts
inputs: I;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L26)

***

### name

```ts
name: string;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L25)

***

### outputs

```ts
outputs: O;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L27)

***

### skip?

```ts
optional skip: boolean;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L28)

***

### type

```ts
type: T;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L24)
