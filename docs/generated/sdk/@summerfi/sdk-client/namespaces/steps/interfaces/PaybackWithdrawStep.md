# Interface: PaybackWithdrawStep

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L59)

## Extends

- [`Step`](Step.md)\<[`PaybackWithdraw`](../../../enumerations/SimulationSteps.md#paybackwithdraw), \{
  `paybackAmount`: [`ReferenceableField`](../../../type-aliases/ReferenceableField.md)\<[`ITokenAmount`](../../../interfaces/ITokenAmount.md)\>;
  `position`: [`ILendingPosition`](../../../interfaces/ILendingPosition.md);
  `withdrawAmount`: [`ITokenAmount`](../../../interfaces/ITokenAmount.md);
  `withdrawTargetType`: [`TokenTransferTargetType`](../../../enumerations/TokenTransferTargetType.md);
\}, \{
  `paybackAmount`: [`ITokenAmount`](../../../interfaces/ITokenAmount.md);
  `withdrawAmount`: [`ITokenAmount`](../../../interfaces/ITokenAmount.md);
\}\>

## Properties

### inputs

```ts
inputs: object;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L26)

#### paybackAmount

```ts
paybackAmount: ReferenceableField<ITokenAmount>;
```

#### position

```ts
position: ILendingPosition;
```

#### withdrawAmount

```ts
withdrawAmount: ITokenAmount;
```

#### withdrawTargetType

```ts
withdrawTargetType: TokenTransferTargetType;
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
outputs: object;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L27)

#### paybackAmount

```ts
paybackAmount: ITokenAmount;
```

#### withdrawAmount

```ts
withdrawAmount: ITokenAmount;
```

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
type: PaybackWithdraw;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/Steps.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/simulation/interfaces/Steps.ts#L24)

#### Inherited from

[`Step`](Step.md).[`type`](Step.md#type)
