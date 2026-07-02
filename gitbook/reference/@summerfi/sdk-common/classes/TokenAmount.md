# Class: TokenAmount

Defined in: [src/common/implementation/TokenAmount.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L27)

## See

ITokenAmount

## Implements

- [`ITokenAmount`](../interfaces/ITokenAmount.md)

## Properties

### \_baseUnitFactor

```ts
protected readonly _baseUnitFactor: BigNumber;
```

Defined in: [src/common/implementation/TokenAmount.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L37)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/TokenAmount.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L29)

SIGNATURE

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`[___signature__]`](../interfaces/ITokenAmount.md#___signature__)

***

### amount

```ts
readonly amount: string;
```

Defined in: [src/common/implementation/TokenAmount.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L33)

Amount in floating point format without taking into account the token decimals

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`amount`](../interfaces/ITokenAmount.md#amount)

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [src/common/implementation/TokenAmount.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L32)

ATTRIBUTES

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`token`](../interfaces/ITokenAmount.md#token)

## Methods

### add()

```ts
add(tokenToAdd): ITokenAmount;
```

Defined in: [src/common/implementation/TokenAmount.ts:91](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L91)

#### Parameters

##### tokenToAdd

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### Returns

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### See

ITokenAmount.add

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`add`](../interfaces/ITokenAmount.md#add)

***

### divide()

```ts
divide<InputParams, ReturnType>(divisor): ReturnType;
```

Defined in: [src/common/implementation/TokenAmount.ts:139](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L139)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`TokenAmountMulDivParamType`](../type-aliases/TokenAmountMulDivParamType.md)

##### ReturnType

`ReturnType` = [`TokenAmountMulDivReturnType`](../type-aliases/TokenAmountMulDivReturnType.md)\<`InputParams`\>

#### Parameters

##### divisor

`InputParams`

#### Returns

`ReturnType`

#### See

ITokenAmount.divide

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`divide`](../interfaces/ITokenAmount.md#divide)

***

### isEqualTo()

```ts
isEqualTo(tokenAmount): boolean;
```

Defined in: [src/common/implementation/TokenAmount.ts:184](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L184)

#### Parameters

##### tokenAmount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### Returns

`boolean`

#### See

ITokenAmount.isEqualTo

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`isEqualTo`](../interfaces/ITokenAmount.md#isequalto)

***

### isGreaterOrEqualThan()

```ts
isGreaterOrEqualThan(tokenAmount): boolean;
```

Defined in: [src/common/implementation/TokenAmount.ts:174](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L174)

#### Parameters

##### tokenAmount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### Returns

`boolean`

#### See

ITokenAmount.isGreaterOrEqualThan

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`isGreaterOrEqualThan`](../interfaces/ITokenAmount.md#isgreaterorequalthan)

***

### isGreaterThan()

```ts
isGreaterThan(tokenAmount): boolean;
```

Defined in: [src/common/implementation/TokenAmount.ts:160](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L160)

#### Parameters

##### tokenAmount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### Returns

`boolean`

#### See

ITokenAmount.isGreaterThan

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`isGreaterThan`](../interfaces/ITokenAmount.md#isgreaterthan)

***

### isLessOrEqualThan()

```ts
isLessOrEqualThan(tokenAmount): boolean;
```

Defined in: [src/common/implementation/TokenAmount.ts:179](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L179)

#### Parameters

##### tokenAmount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### Returns

`boolean`

#### See

ITokenAmount.isLessOrEqualThan

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`isLessOrEqualThan`](../interfaces/ITokenAmount.md#islessorequalthan)

***

### isLessThan()

```ts
isLessThan(tokenAmount): boolean;
```

Defined in: [src/common/implementation/TokenAmount.ts:167](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L167)

#### Parameters

##### tokenAmount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### Returns

`boolean`

#### See

ITokenAmount.isLessThan

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`isLessThan`](../interfaces/ITokenAmount.md#islessthan)

***

### isZero()

```ts
isZero(): boolean;
```

Defined in: [src/common/implementation/TokenAmount.ts:155](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L155)

#### Returns

`boolean`

#### See

ITokenAmount.isZero

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`isZero`](../interfaces/ITokenAmount.md#iszero)

***

### multiply()

```ts
multiply<InputParams, ReturnType>(multiplier): ReturnType;
```

Defined in: [src/common/implementation/TokenAmount.ts:120](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L120)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`TokenAmountMulDivParamType`](../type-aliases/TokenAmountMulDivParamType.md)

##### ReturnType

`ReturnType` = [`TokenAmountMulDivReturnType`](../type-aliases/TokenAmountMulDivReturnType.md)\<`InputParams`\>

#### Parameters

##### multiplier

`InputParams`

#### Returns

`ReturnType`

#### See

ITokenAmount.multiply

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`multiply`](../interfaces/ITokenAmount.md#multiply)

***

### subtract()

```ts
subtract(tokenToSubstract): ITokenAmount;
```

Defined in: [src/common/implementation/TokenAmount.ts:101](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L101)

#### Parameters

##### tokenToSubstract

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### Returns

[`ITokenAmount`](../interfaces/ITokenAmount.md)

#### See

ITokenAmount.subtract

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`subtract`](../interfaces/ITokenAmount.md#subtract)

***

### toBigNumber()

```ts
toBigNumber(): BigNumber;
```

Defined in: [src/common/implementation/TokenAmount.ts:201](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L201)

#### Returns

`BigNumber`

#### See

IValueConverter.toBigNumber

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`toBigNumber`](../interfaces/ITokenAmount.md#tobignumber)

***

### toSolidityValue()

```ts
toSolidityValue(params): bigint;
```

Defined in: [src/common/implementation/TokenAmount.ts:194](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L194)

#### Parameters

##### params

###### decimals

`number`

#### Returns

`bigint`

#### See

IValueConverter.toSolidityValue

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`toSolidityValue`](../interfaces/ITokenAmount.md#tosolidityvalue)

***

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/TokenAmount.ts:189](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L189)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`toString`](../interfaces/ITokenAmount.md#tostring)

***

### createFrom()

```ts
static createFrom(params): ITokenAmount;
```

Defined in: [src/common/implementation/TokenAmount.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L41)

FACTORY

#### Parameters

##### params

[`TokenAmountParameters`](../type-aliases/TokenAmountParameters.md)

#### Returns

[`ITokenAmount`](../interfaces/ITokenAmount.md)

***

### createFromBaseUnit()

```ts
static createFromBaseUnit(params): ITokenAmount;
```

Defined in: [src/common/implementation/TokenAmount.ts:72](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L72)

#### Parameters

##### params

[`TokenAmountParameters`](../type-aliases/TokenAmountParameters.md)

Token amount data to create the instance

#### Returns

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The resulting TokenAmount

`amount` is the integer amount including all the decimals of the token

i.e.: amount in base unit (1eth = 1000000000000000000, 1btc = 100000000, etc...)

***

### createFromEthereum()

```ts
static createFromEthereum(params): ITokenAmount;
```

Defined in: [src/common/implementation/TokenAmount.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/TokenAmount.ts#L48)

#### Parameters

##### params

[`TokenAmountParameters`](../type-aliases/TokenAmountParameters.md)

#### Returns

[`ITokenAmount`](../interfaces/ITokenAmount.md)
