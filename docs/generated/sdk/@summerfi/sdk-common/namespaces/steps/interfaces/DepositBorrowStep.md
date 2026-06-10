# Interface: DepositBorrowStep

Defined in: [src/simulation/interfaces/Steps.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L44)

## Extends

- [`Step`](Step.md)\<[`DepositBorrow`](../../../enumerations/SimulationSteps.md#depositborrow), \{
  `additionalDeposit?`: [`ValueReference`](../../../interfaces/ValueReference.md)\<[`ITokenAmount`](../../../interfaces/ITokenAmount.md)\>;
  `borrowAmount`: [`ReferenceableField`](../../../type-aliases/ReferenceableField.md)\<[`ITokenAmount`](../../../interfaces/ITokenAmount.md)\>;
  `borrowTargetType`: [`TokenTransferTargetType`](../../../enumerations/TokenTransferTargetType.md);
  `depositAmount`: [`ReferenceableField`](../../../type-aliases/ReferenceableField.md)\<[`ITokenAmount`](../../../interfaces/ITokenAmount.md)\>;
  `position`: [`ILendingPosition`](../../../interfaces/ILendingPosition.md);
\}, \{
  `borrowAmount`: [`ITokenAmount`](../../../interfaces/ITokenAmount.md);
  `depositAmount`: [`ITokenAmount`](../../../interfaces/ITokenAmount.md);
\}\>

## Properties

### inputs

```ts
inputs: object;
```

Defined in: [src/simulation/interfaces/Steps.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L26)

#### additionalDeposit?

```ts
optional additionalDeposit: ValueReference<ITokenAmount>;
```

#### borrowAmount

```ts
borrowAmount: ReferenceableField<ITokenAmount>;
```

#### borrowTargetType

```ts
borrowTargetType: TokenTransferTargetType;
```

#### depositAmount

```ts
depositAmount: ReferenceableField<ITokenAmount>;
```

#### position

```ts
position: ILendingPosition;
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

#### borrowAmount

```ts
borrowAmount: ITokenAmount;
```

#### depositAmount

```ts
depositAmount: ITokenAmount;
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
type: DepositBorrow;
```

Defined in: [src/simulation/interfaces/Steps.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/Steps.ts#L24)

#### Inherited from

[`Step`](Step.md).[`type`](Step.md#type)
