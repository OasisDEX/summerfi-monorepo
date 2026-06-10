# Class: TokenAmount

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L28)

TokenAmount

## See

ITokenAmount

## Implements

- [`ITokenAmount`](../interfaces/ITokenAmount.md)

## Properties

### \_baseUnitFactor

```ts
protected readonly _baseUnitFactor: BigNumber;
```

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L38)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L30)

SIGNATURE

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`[___signature__]`](../interfaces/ITokenAmount.md#___signature__)

***

### amount

```ts
readonly amount: string;
```

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L34)

Amount in floating point format without taking into account the token decimals

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`amount`](../interfaces/ITokenAmount.md#amount)

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L33)

ATTRIBUTES

#### Implementation of

[`ITokenAmount`](../interfaces/ITokenAmount.md).[`token`](../interfaces/ITokenAmount.md#token)

## Methods

### add()

```ts
add(tokenToAdd): ITokenAmount;
```

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:94](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L94)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:142](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L142)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:187](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L187)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:177](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L177)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:163](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L163)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:182](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L182)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:170](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L170)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:158](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L158)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:123](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L123)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:104](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L104)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:204](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L204)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:197](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L197)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:192](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L192)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L42)

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

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:75](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L75)

#### Parameters

##### params

[`TokenAmountParameters`](../type-aliases/TokenAmountParameters.md)

Token amount data to create the instance

#### Returns

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The resulting TokenAmount

`amount` is the integer amount including all the decimals of the token

i.e.: amount in base unit (1eth = 1000000000000000000, 1btc = 100000000, etc...)

#### Name

createFromBaseUnit

***

### createFromEthereum()

```ts
static createFromEthereum(params): ITokenAmount;
```

Defined in: [sdk/sdk-common/src/common/implementation/TokenAmount.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/TokenAmount.ts#L49)

#### Parameters

##### params

[`TokenAmountParameters`](../type-aliases/TokenAmountParameters.md)

#### Returns

[`ITokenAmount`](../interfaces/ITokenAmount.md)
