# Class: FiatCurrencyAmount

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L26)

## See

IFiatCurrencyAmount

## Implements

- [`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L28)

SIGNATURE

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`[___signature__]`](../interfaces/IFiatCurrencyAmount.md#___signature__)

***

### amount

```ts
readonly amount: string;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L31)

The amount in floating point format

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`amount`](../interfaces/IFiatCurrencyAmount.md#amount)

***

### fiat

```ts
readonly fiat: FiatCurrency;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L30)

Fiat currency for the amount

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`fiat`](../interfaces/IFiatCurrencyAmount.md#fiat)

## Methods

### add()

```ts
add(fiatToAdd): IFiatCurrencyAmount;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:47](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L47)

#### Parameters

##### fiatToAdd

`FiatCurrencyAmount`

#### Returns

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md)

#### See

IFiatCurrencyAmount.add

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`add`](../interfaces/IFiatCurrencyAmount.md#add)

***

### divide()

```ts
divide<InputParams, ReturnType>(divisor): ReturnType;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:86](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L86)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`FiatCurrencyAmountMulDivParamType`](../type-aliases/FiatCurrencyAmountMulDivParamType.md)

##### ReturnType

`ReturnType` = [`FiatCurrencyAmountMulDivReturnType`](../type-aliases/FiatCurrencyAmountMulDivReturnType.md)\<`InputParams`\>

#### Parameters

##### divisor

`InputParams`

#### Returns

`ReturnType`

#### See

IFiatCurrencyAmount.divide

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`divide`](../interfaces/IFiatCurrencyAmount.md#divide)

***

### multiply()

```ts
multiply<InputParams, ReturnType>(multiplier): ReturnType;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:67](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L67)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`FiatCurrencyAmountMulDivParamType`](../type-aliases/FiatCurrencyAmountMulDivParamType.md)

##### ReturnType

`ReturnType` = [`FiatCurrencyAmountMulDivReturnType`](../type-aliases/FiatCurrencyAmountMulDivReturnType.md)\<`InputParams`\>

#### Parameters

##### multiplier

`InputParams`

#### Returns

`ReturnType`

#### See

IFiatCurrencyAmount.multiply

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`multiply`](../interfaces/IFiatCurrencyAmount.md#multiply)

***

### subtract()

```ts
subtract(fiatToSubstract): IFiatCurrencyAmount;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:57](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L57)

#### Parameters

##### fiatToSubstract

`FiatCurrencyAmount`

#### Returns

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md)

#### See

IFiatCurrencyAmount.subtract

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`subtract`](../interfaces/IFiatCurrencyAmount.md#subtract)

***

### toBigNumber()

```ts
toBigNumber(): BigNumber;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:111](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L111)

#### Returns

`BigNumber`

#### See

IValueConverter.toBigNumber

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`toBigNumber`](../interfaces/IFiatCurrencyAmount.md#tobignumber)

***

### toSolidityValue()

```ts
toSolidityValue(params?): bigint;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:105](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L105)

#### Parameters

##### params?

###### decimals

`number`

#### Returns

`bigint`

#### See

IValueConverter.toBigNumber

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`toSolidityValue`](../interfaces/IFiatCurrencyAmount.md#tosolidityvalue)

***

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:116](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L116)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md).[`toString`](../interfaces/IFiatCurrencyAmount.md#tostring)

***

### createFrom()

```ts
static createFrom(params): IFiatCurrencyAmount;
```

Defined in: [src/common/implementation/FiatCurrencyAmount.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/FiatCurrencyAmount.ts#L34)

FACTORY

#### Parameters

##### params

[`FiatCurrencyAmountParameters`](../type-aliases/FiatCurrencyAmountParameters.md)

#### Returns

[`IFiatCurrencyAmount`](../interfaces/IFiatCurrencyAmount.md)
