# Class: RiskRatio

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L14)

## See

IRiskRatio

## Implements

- [`IRiskRatio`](../interfaces/IRiskRatio.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L16)

SIGNATURE

#### Implementation of

[`IRiskRatio`](../interfaces/IRiskRatio.md).[`[___signature__]`](../interfaces/IRiskRatio.md#___signature__)

***

### type

```ts
readonly type: RiskRatioType;
```

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L19)

ATTRIBUTES

#### Implementation of

[`IRiskRatio`](../interfaces/IRiskRatio.md).[`type`](../interfaces/IRiskRatio.md#type)

***

### value

```ts
readonly value: number | IPercentage;
```

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L20)

The risk ratio value, a percentage for LTV and Collateralization Ratio, a number for Multiple

#### Implementation of

[`IRiskRatio`](../interfaces/IRiskRatio.md).[`value`](../interfaces/IRiskRatio.md#value)

## Methods

### toCollateralizationRatio()

```ts
toCollateralizationRatio(): IPercentage;
```

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:66](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L66)

#### Returns

[`IPercentage`](../interfaces/IPercentage.md)

#### See

IRiskRatio.toCollateralizationRatio

#### Implementation of

[`IRiskRatio`](../interfaces/IRiskRatio.md).[`toCollateralizationRatio`](../interfaces/IRiskRatio.md#tocollateralizationratio)

***

### toLTV()

```ts
toLTV(): IPercentage;
```

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:80](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L80)

#### Returns

[`IPercentage`](../interfaces/IPercentage.md)

#### See

IRiskRatio.toLTV

#### Implementation of

[`IRiskRatio`](../interfaces/IRiskRatio.md).[`toLTV`](../interfaces/IRiskRatio.md#toltv)

***

### toMultiple()

```ts
toMultiple(): number;
```

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:73](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L73)

#### Returns

`number`

#### See

IRiskRatio.toMultiple

#### Implementation of

[`IRiskRatio`](../interfaces/IRiskRatio.md).[`toMultiple`](../interfaces/IRiskRatio.md#tomultiple)

***

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L85)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`IRiskRatio`](../interfaces/IRiskRatio.md).[`toString`](../interfaces/IRiskRatio.md#tostring)

***

### createFrom()

```ts
static createFrom(params): RiskRatio;
```

Defined in: [../sdk-common/src/common/implementation/RiskRatio.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/RiskRatio.ts#L25)

FACTORY

#### Parameters

##### params

[`RiskRatioParameters`](../type-aliases/RiskRatioParameters.md)

#### Returns

`RiskRatio`
