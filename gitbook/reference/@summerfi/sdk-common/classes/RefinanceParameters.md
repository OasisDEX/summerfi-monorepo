# Class: RefinanceParameters

Defined in: [src/orders/refinance/implementation/RefinanceParameters.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/refinance/implementation/RefinanceParameters.ts#L19)

## See

IRefinanceParameters

## Implements

- [`IRefinanceParameters`](../interfaces/IRefinanceParameters.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/orders/refinance/implementation/RefinanceParameters.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/refinance/implementation/RefinanceParameters.ts#L21)

SIGNATURE

#### Implementation of

[`IRefinanceParameters`](../interfaces/IRefinanceParameters.md).[`[___signature__]`](../interfaces/IRefinanceParameters.md#___signature__)

***

### slippage

```ts
readonly slippage: IPercentage;
```

Defined in: [src/orders/refinance/implementation/RefinanceParameters.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/refinance/implementation/RefinanceParameters.ts#L26)

Maximum slippage allowed for the simulation

#### Implementation of

[`IRefinanceParameters`](../interfaces/IRefinanceParameters.md).[`slippage`](../interfaces/IRefinanceParameters.md#slippage)

***

### sourcePosition

```ts
readonly sourcePosition: ILendingPosition;
```

Defined in: [src/orders/refinance/implementation/RefinanceParameters.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/refinance/implementation/RefinanceParameters.ts#L24)

ATTRIBUTES

#### Implementation of

[`IRefinanceParameters`](../interfaces/IRefinanceParameters.md).[`sourcePosition`](../interfaces/IRefinanceParameters.md#sourceposition)

***

### targetPool

```ts
readonly targetPool: ILendingPool;
```

Defined in: [src/orders/refinance/implementation/RefinanceParameters.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/refinance/implementation/RefinanceParameters.ts#L25)

Target pool where the source position will be moved

#### Implementation of

[`IRefinanceParameters`](../interfaces/IRefinanceParameters.md).[`targetPool`](../interfaces/IRefinanceParameters.md#targetpool)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/orders/refinance/implementation/RefinanceParameters.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/refinance/implementation/RefinanceParameters.ts#L43)

#### Returns

`string`

#### See

IPrintable.toString

***

### createFrom()

```ts
static createFrom(params): RefinanceParameters;
```

Defined in: [src/orders/refinance/implementation/RefinanceParameters.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/refinance/implementation/RefinanceParameters.ts#L29)

FACTORY

#### Parameters

##### params

[`RefinanceParametersParameters`](../type-aliases/RefinanceParametersParameters.md)

#### Returns

`RefinanceParameters`
