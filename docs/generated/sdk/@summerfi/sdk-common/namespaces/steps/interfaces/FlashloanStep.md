# Interface: FlashloanStep

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L31)

## Extends

- [`Step`](Step.md)\<[`Flashloan`](../../../enumerations/SimulationSteps.md#flashloan), \{
  `amount`: [`ITokenAmount`](../../../interfaces/ITokenAmount.md);
  `provider`: [`FlashloanProvider`](../../../enumerations/FlashloanProvider.md);
\}\>

## Properties

### inputs

```ts
inputs: object;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L26)

#### amount

```ts
amount: ITokenAmount;
```

#### provider

```ts
provider: FlashloanProvider;
```

#### Inherited from

[`Step`](Step.md).[`inputs`](Step.md#inputs)

***

### name

```ts
name: string;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L25)

#### Inherited from

[`Step`](Step.md).[`name`](Step.md#name)

***

### outputs

```ts
outputs: undefined;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L27)

#### Inherited from

[`Step`](Step.md).[`outputs`](Step.md#outputs)

***

### skip?

```ts
optional skip: boolean;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L28)

#### Inherited from

[`Step`](Step.md).[`skip`](Step.md#skip)

***

### type

```ts
type: Flashloan;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L24)

#### Inherited from

[`Step`](Step.md).[`type`](Step.md#type)
