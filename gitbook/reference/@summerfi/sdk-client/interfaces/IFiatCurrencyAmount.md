# Interface: IFiatCurrencyAmount

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L35)

## Name

IFiatCurrencyAmount

## Description

Represents an amount of a fiat currency

The amount is represented as a string in floating point format without taking into consideration
the number of decimals of the token. This data type can be used for calculations with other types
like Price or Percentage

## Extends

- [`IFiatCurrencyAmountData`](../type-aliases/IFiatCurrencyAmountData.md).`IValueConverter`.[`IPrintable`](IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L37)

Signature to differentiate from similar interfaces

***

### amount

```ts
readonly amount: string;
```

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L41)

The amount in floating point format

#### Overrides

```ts
IFiatCurrencyAmountData.amount
```

***

### fiat

```ts
readonly fiat: FiatCurrency;
```

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L39)

Fiat currency for the amount

#### Overrides

```ts
IFiatCurrencyAmountData.fiat
```

## Methods

### add()

```ts
add(fiatToAdd): IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L48)

#### Parameters

##### fiatToAdd

`IFiatCurrencyAmount`

FiatCurrencyAmount to add

#### Returns

`IFiatCurrencyAmount`

The resulting FiatCurrencyAmount

#### Name

add

***

### divide()

```ts
divide<InputParams, ReturnType>(divisor): ReturnType;
```

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:74](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L74)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`FiatCurrencyAmountMulDivParamType`](../type-aliases/FiatCurrencyAmountMulDivParamType.md)

##### ReturnType

`ReturnType` = [`FiatCurrencyAmountMulDivReturnType`](../type-aliases/FiatCurrencyAmountMulDivReturnType.md)\<`InputParams`\>

#### Parameters

##### divisor

`InputParams`

A percentage, price string amount or number to divide

#### Returns

`ReturnType`

The resulting FiatCurrencyAmount

#### Name

divide

***

### multiply()

```ts
multiply<InputParams, ReturnType>(multiplier): ReturnType;
```

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:62](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L62)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`FiatCurrencyAmountMulDivParamType`](../type-aliases/FiatCurrencyAmountMulDivParamType.md)

##### ReturnType

`ReturnType` = [`FiatCurrencyAmountMulDivReturnType`](../type-aliases/FiatCurrencyAmountMulDivReturnType.md)\<`InputParams`\>

#### Parameters

##### multiplier

`InputParams`

A percentage, string amount or number to multiply

#### Returns

`ReturnType`

The resulting FiatCurrencyAmount

#### Name

multiply

***

### subtract()

```ts
subtract(fiatToSubtract): IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:55](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IFiatCurrencyAmount.ts#L55)

#### Parameters

##### fiatToSubtract

`IFiatCurrencyAmount`

#### Returns

`IFiatCurrencyAmount`

The resulting FiatCurrencyAmount

#### Name

subtract

***

### toBigNumber()

```ts
toBigNumber(): BigNumber;
```

Defined in: [../sdk-common/src/common/interfaces/IValueConverter.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IValueConverter.ts#L37)

Converts the instance into a BigNumber

#### Returns

`BigNumber`

The value as a BigNumber

#### Remarks

It returns a BigNumber without explicit decimals. This function is intended for low
         level operations not accounted for in the specific data type. The BigNumber does NOT
         carry any information on how many decimals the value has, meaning that the conversion
         of BigNumber to a Solidity value must be done manually

#### Inherited from

```ts
IValueConverter.toBigNumber
```

***

### toSolidityValue()

```ts
toSolidityValue(params?): bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IValueConverter.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IValueConverter.ts#L23)

Converts the instance into a Solidity value

#### Parameters

##### params?

###### decimals

`number`

#### Returns

`bigint`

The value as a TypeScript bigint that can be passed to a Solidity contract

#### Remarks

The value is expected to be scaled by 10^decimals, thus yielding a Solidity uint256
         value with the correct fixed point decimals

#### Inherited from

```ts
IValueConverter.toSolidityValue
```

***

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/interfaces/IPrintable.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L15)

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Name

toString

#### Description

Returns a string representation of the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)
