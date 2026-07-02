# Class: Percentage

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L18)

## See

IPercentage

## Implements

- [`IPercentage`](../interfaces/IPercentage.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L20)

SIGNATURE

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`[___signature__]`](../interfaces/IPercentage.md#___signature__)

***

### value

```ts
readonly value: number;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L36)

ATTRIBUTES

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`value`](../interfaces/IPercentage.md#value)

***

### Percent100

```ts
static Percent100: Percentage;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L31)

The percentage of 100% with the given `PERCENTAGE_DECIMALS`

***

### PERCENTAGE\_DECIMALS

```ts
static PERCENTAGE_DECIMALS: number = 6;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L25)

The number of decimals used to represent the percentage in Solidity

***

### PERCENTAGE\_FACTOR

```ts
static PERCENTAGE_FACTOR: number;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L28)

The factor used to scale the percentage

## Methods

### add()

```ts
add(percentage): IPercentage;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:66](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L66)

#### Parameters

##### percentage

[`IPercentage`](../interfaces/IPercentage.md)

#### Returns

[`IPercentage`](../interfaces/IPercentage.md)

#### See

IPercentage.add

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`add`](../interfaces/IPercentage.md#add)

***

### divide()

```ts
divide(divisor): IPercentage;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:85](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L85)

#### Parameters

##### divisor

`string` | `number` | [`IPercentage`](../interfaces/IPercentage.md)

#### Returns

[`IPercentage`](../interfaces/IPercentage.md)

#### See

IPercentage.divide

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`divide`](../interfaces/IPercentage.md#divide)

***

### multiply()

```ts
multiply(multiplier): IPercentage;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:76](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L76)

#### Parameters

##### multiplier

`string` | `number` | [`IPercentage`](../interfaces/IPercentage.md)

#### Returns

[`IPercentage`](../interfaces/IPercentage.md)

#### See

IPercentage.multiply

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`multiply`](../interfaces/IPercentage.md#multiply)

***

### subtract()

```ts
subtract(percentage): IPercentage;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:71](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L71)

#### Parameters

##### percentage

[`IPercentage`](../interfaces/IPercentage.md)

#### Returns

[`IPercentage`](../interfaces/IPercentage.md)

#### See

IPercentage.subtract

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`subtract`](../interfaces/IPercentage.md#subtract)

***

### toBigNumber()

```ts
toBigNumber(): BigNumber;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:112](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L112)

#### Returns

`BigNumber`

#### See

IValueConverter.toBigNumber

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`toBigNumber`](../interfaces/IPercentage.md#tobignumber)

***

### toComplement()

```ts
toComplement(): IPercentage;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:99](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L99)

#### Returns

[`IPercentage`](../interfaces/IPercentage.md)

#### See

IPercentage.toComplement

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`toComplement`](../interfaces/IPercentage.md#tocomplement)

***

### toProportion()

```ts
toProportion(): number;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:94](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L94)

#### Returns

`number`

#### See

IPercentage.toProportion

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`toProportion`](../interfaces/IPercentage.md#toproportion)

***

### toSolidityValue()

```ts
toSolidityValue(params): bigint;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:104](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L104)

#### Parameters

##### params

###### decimals

`number`

#### Returns

`bigint`

#### See

IValueConverter.toSolidityValue

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`toSolidityValue`](../interfaces/IPercentage.md#tosolidityvalue)

***

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:117](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L117)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`IPercentage`](../interfaces/IPercentage.md).[`toString`](../interfaces/IPercentage.md#tostring)

***

### createFrom()

```ts
static createFrom(params): Percentage;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L39)

FACTORY

#### Parameters

##### params

[`PercentageParameters`](../type-aliases/PercentageParameters.md)

#### Returns

`Percentage`

***

### createFromSolidityValue()

```ts
static createFromSolidityValue(params): Percentage;
```

Defined in: [../sdk-common/src/common/implementation/Percentage.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Percentage.ts#L48)

Creates a Percentage instance from a Solidity value with PERCENTAGE_DECIMALS decimals

#### Parameters

##### params

###### value

`bigint`

#### Returns

`Percentage`

The Percentage instance
