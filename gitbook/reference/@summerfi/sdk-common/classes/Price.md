# Class: Price

Defined in: [src/common/implementation/Price.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L36)

## See

IPrice

## Implements

- [`IPrice`](../interfaces/IPrice.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/Price.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L38)

SIGNATURE

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`[___signature__]`](../interfaces/IPrice.md#___signature__)

***

### base

```ts
readonly base: Denomination;
```

Defined in: [src/common/implementation/Price.ts:45](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L45)

The token for the base of the price

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`base`](../interfaces/IPrice.md#base)

***

### quote

```ts
readonly quote: Denomination;
```

Defined in: [src/common/implementation/Price.ts:46](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L46)

The token for the quote of the price

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`quote`](../interfaces/IPrice.md#quote)

***

### value

```ts
readonly value: string;
```

Defined in: [src/common/implementation/Price.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L44)

ATTRIBUTES

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`value`](../interfaces/IPrice.md#value)

***

### PRICE\_DECIMALS

```ts
readonly static PRICE_DECIMALS: 18 = 18;
```

Defined in: [src/common/implementation/Price.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L41)

CONSTANTS

## Methods

### add()

```ts
add(otherPrice): IPrice;
```

Defined in: [src/common/implementation/Price.ts:135](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L135)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

[`IPrice`](../interfaces/IPrice.md)

#### See

IPrice.add

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`add`](../interfaces/IPrice.md#add)

***

### divide()

```ts
divide(divider): IPrice;
```

Defined in: [src/common/implementation/Price.ts:190](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L190)

#### Parameters

##### divider

`string` | `number` | [`IPercentage`](../interfaces/IPercentage.md) | [`IPrice`](../interfaces/IPrice.md)

#### Returns

[`IPrice`](../interfaces/IPrice.md)

#### See

IPrice.divide

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`divide`](../interfaces/IPrice.md#divide)

***

### hasSameBase()

```ts
hasSameBase(otherPrice): boolean;
```

Defined in: [src/common/implementation/Price.ts:121](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L121)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

`boolean`

#### See

IPrice.hasSameBase

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`hasSameBase`](../interfaces/IPrice.md#hassamebase)

***

### hasSameDenominations()

```ts
hasSameDenominations(otherPrice): boolean;
```

Defined in: [src/common/implementation/Price.ts:130](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L130)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

`boolean`

#### See

IPrice.hasSameDenominations

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`hasSameDenominations`](../interfaces/IPrice.md#hassamedenominations)

***

### hasSameQuote()

```ts
hasSameQuote(otherPrice): boolean;
```

Defined in: [src/common/implementation/Price.ts:112](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L112)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

`boolean`

#### See

IPrice.hasSameQuote

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`hasSameQuote`](../interfaces/IPrice.md#hassamequote)

***

### invert()

```ts
invert(): IPrice;
```

Defined in: [src/common/implementation/Price.ts:209](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L209)

#### Returns

[`IPrice`](../interfaces/IPrice.md)

#### See

IPrice.invert

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`invert`](../interfaces/IPrice.md#invert)

***

### isEqual()

```ts
isEqual(otherPrice): boolean;
```

Defined in: [src/common/implementation/Price.ts:251](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L251)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

`boolean`

#### See

IPrice.isEqual

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`isEqual`](../interfaces/IPrice.md#isequal)

***

### isGreaterThan()

```ts
isGreaterThan(otherPrice): boolean;
```

Defined in: [src/common/implementation/Price.ts:232](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L232)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

`boolean`

#### See

IPrice.isGreaterThan

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`isGreaterThan`](../interfaces/IPrice.md#isgreaterthan)

***

### isGreaterThanOrEqual()

```ts
isGreaterThanOrEqual(otherPrice): boolean;
```

Defined in: [src/common/implementation/Price.ts:239](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L239)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

`boolean`

#### See

IPrice.isGreaterThanOrEqual

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`isGreaterThanOrEqual`](../interfaces/IPrice.md#isgreaterthanorequal)

***

### isLessThan()

```ts
isLessThan(otherPrice): boolean;
```

Defined in: [src/common/implementation/Price.ts:218](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L218)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

`boolean`

#### See

IPrice.isLessThan

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`isLessThan`](../interfaces/IPrice.md#islessthan)

***

### isLessThanOrEqual()

```ts
isLessThanOrEqual(otherPrice): boolean;
```

Defined in: [src/common/implementation/Price.ts:225](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L225)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

`boolean`

#### See

IPrice.isLessThanOrEqual

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`isLessThanOrEqual`](../interfaces/IPrice.md#islessthanorequal)

***

### isZero()

```ts
isZero(): boolean;
```

Defined in: [src/common/implementation/Price.ts:246](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L246)

#### Returns

`boolean`

#### See

IPrice.isZero

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`isZero`](../interfaces/IPrice.md#iszero)

***

### multiply()

```ts
multiply<InputParams, ReturnType>(multiplier): ReturnType;
```

Defined in: [src/common/implementation/Price.ts:157](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L157)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`PriceMulParamType`](../type-aliases/PriceMulParamType.md)

##### ReturnType

`ReturnType` = [`PriceMulReturnType`](../type-aliases/PriceMulReturnType.md)\<`InputParams`\>

#### Parameters

##### multiplier

`InputParams`

#### Returns

`ReturnType`

#### See

IPrice.multiply

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`multiply`](../interfaces/IPrice.md#multiply)

***

### subtract()

```ts
subtract(otherPrice): IPrice;
```

Defined in: [src/common/implementation/Price.ts:146](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L146)

#### Parameters

##### otherPrice

[`IPrice`](../interfaces/IPrice.md)

#### Returns

[`IPrice`](../interfaces/IPrice.md)

#### See

IPrice.subtract

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`subtract`](../interfaces/IPrice.md#subtract)

***

### toBigNumber()

```ts
toBigNumber(): BigNumber;
```

Defined in: [src/common/implementation/Price.ts:269](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L269)

#### Returns

`BigNumber`

#### See

IValueConverter.toBigNumber

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`toBigNumber`](../interfaces/IPrice.md#tobignumber)

***

### toSolidityValue()

```ts
toSolidityValue(params): bigint;
```

Defined in: [src/common/implementation/Price.ts:263](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L263)

#### Parameters

##### params

###### decimals

`number`

#### Returns

`bigint`

#### See

IValueConverter.toSolidityValue

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`toSolidityValue`](../interfaces/IPrice.md#tosolidityvalue)

***

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/Price.ts:258](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L258)

#### Returns

`string`

#### See

IPrice.toString

#### Implementation of

[`IPrice`](../interfaces/IPrice.md).[`toString`](../interfaces/IPrice.md#tostring)

***

### createFrom()

```ts
static createFrom(params): IPrice;
```

Defined in: [src/common/implementation/Price.ts:55](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L55)

FACTORY

#### Parameters

##### params

[`PriceParameters`](../type-aliases/PriceParameters.md)

#### Returns

[`IPrice`](../interfaces/IPrice.md)

***

### createFromAmountsRatio()

```ts
static createFromAmountsRatio(params): IPrice;
```

Defined in: [src/common/implementation/Price.ts:68](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Price.ts#L68)

Creates a price from the ratio of two token amounts

#### Parameters

##### params

###### denominator

[`ITokenAmount`](../interfaces/ITokenAmount.md)

the token amount in the denominator

###### numerator

[`ITokenAmount`](../interfaces/ITokenAmount.md)

the token amount in the numerator

#### Returns

[`IPrice`](../interfaces/IPrice.md)

the price calculated from the amounts ratio of numerator divided by denominator

#### Remarks

The denominator becomes the base of the price and the numerator becomes the quote
