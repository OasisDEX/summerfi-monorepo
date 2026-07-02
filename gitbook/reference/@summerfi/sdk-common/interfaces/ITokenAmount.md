# Interface: ITokenAmount

Defined in: [src/common/interfaces/ITokenAmount.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L32)

Interface for the implementors of the token amount

This interface is used to add all the methods that the interface supports

## Extends

- [`ITokenAmountData`](../type-aliases/ITokenAmountData.md).`IValueConverter`.[`IPrintable`](IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L34)

Signature to differentiate from similar interfaces

***

### amount

```ts
readonly amount: string;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L38)

Amount in floating point format without taking into account the token decimals

#### Overrides

```ts
ITokenAmountData.amount
```

***

### token

```ts
readonly token: ITokenStanalone;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L36)

Token this amount refers to

#### Overrides

```ts
ITokenAmountData.token
```

## Methods

### add()

```ts
add(tokenToAdd): ITokenAmount;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L44)

#### Parameters

##### tokenToAdd

`ITokenAmount`

TokenAmount to add

#### Returns

`ITokenAmount`

The resulting TokenAmount

***

### divide()

```ts
divide<InputParams, ReturnType>(divisor): ReturnType;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:67](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L67)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`TokenAmountMulDivParamType`](../type-aliases/TokenAmountMulDivParamType.md)

##### ReturnType

`ReturnType` = [`TokenAmountMulDivReturnType`](../type-aliases/TokenAmountMulDivReturnType.md)\<`InputParams`\>

#### Parameters

##### divisor

`InputParams`

A percentage, price, string amount or number to divide

#### Returns

`ReturnType`

The resulting TokenAmount

***

### isEqualTo()

```ts
isEqualTo(tokenAmount): boolean;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:119](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L119)

Checks if the amount is equal to the provided TokenAmount

#### Parameters

##### tokenAmount

`ITokenAmount`

TokenAmount to compare

#### Returns

`boolean`

true if the amount is equal to the provided TokenAmount

***

### isGreaterOrEqualThan()

```ts
isGreaterOrEqualThan(tokenAmount): boolean;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:103](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L103)

Checks if the amount is greater or equal than the provided TokenAmount

#### Parameters

##### tokenAmount

`ITokenAmount`

TokenAmount to compare

#### Returns

`boolean`

true if the amount is greater or equal than the provided TokenAmount

***

### isGreaterThan()

```ts
isGreaterThan(tokenAmount): boolean;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:87](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L87)

Checks if the amount is greater than the provided TokenAmount

#### Parameters

##### tokenAmount

`ITokenAmount`

TokenAmount to compare

#### Returns

`boolean`

true if the amount is greater than the provided TokenAmount

***

### isLessOrEqualThan()

```ts
isLessOrEqualThan(tokenAmount): boolean;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:111](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L111)

Checks if the amount is less or equal than the provided TokenAmount

#### Parameters

##### tokenAmount

`ITokenAmount`

TokenAmount to compare

#### Returns

`boolean`

true if the amount is less or equal than the provided TokenAmount

***

### isLessThan()

```ts
isLessThan(tokenAmount): boolean;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:95](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L95)

Checks if the amount is less than the provided TokenAmount

#### Parameters

##### tokenAmount

`ITokenAmount`

TokenAmount to compare

#### Returns

`boolean`

true if the amount is less than the provided TokenAmount

***

### isZero()

```ts
isZero(): boolean;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:79](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L79)

Checks if the amount is zero

#### Returns

`boolean`

true if the amount is zero or false otherwise

***

### multiply()

```ts
multiply<InputParams, ReturnType>(multiplier): ReturnType;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:56](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L56)

#### Type Parameters

##### InputParams

`InputParams` *extends* [`TokenAmountMulDivParamType`](../type-aliases/TokenAmountMulDivParamType.md)

##### ReturnType

`ReturnType` = [`TokenAmountMulDivReturnType`](../type-aliases/TokenAmountMulDivReturnType.md)\<`InputParams`\>

#### Parameters

##### multiplier

`InputParams`

A percentage, price, string amount or number to multiply

#### Returns

`ReturnType`

The resulting TokenAmount

***

### subtract()

```ts
subtract(tokenToSubstract): ITokenAmount;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:50](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L50)

#### Parameters

##### tokenToSubstract

`ITokenAmount`

TokenAmount to subtract

#### Returns

`ITokenAmount`

The resulting TokenAmount

***

### toBigNumber()

```ts
toBigNumber(): BigNumber;
```

Defined in: [src/common/interfaces/IValueConverter.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IValueConverter.ts#L34)

Converts the instance into a BigNumber

#### Returns

`BigNumber`

The value as a BigNumber

#### Remarks

It returns a BigNumber without explicit decimals. This function is intended for low
         level operations not accounted for in the specific data type. The BigNumber does NOT
         carry any information on how many decimals the value has, meaning that the conversion
         of BigNumber to a Solidity value must be done manually. Use `toSolidityValue` to
         convert the value to a Solidity value instead.

#### Inherited from

```ts
IValueConverter.toBigNumber
```

***

### toSolidityValue()

```ts
toSolidityValue(params?): bigint;
```

Defined in: [src/common/interfaces/IValueConverter.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IValueConverter.ts#L21)

Converts the instance into a Solidity value

#### Parameters

##### params?

###### decimals

`number`

The number of decimals used to represent the value in Solidity

#### Returns

`bigint`

The value as a TypeScript bigint that can be passed to a Solidity contract

#### Remarks

The value is expected to be scaled by 10^decimals, thus yielding a Solidity uint256
         value with the correct fixed point decimals. The data type implementing this
         interface should provide a default value for decimals when possible to aid in the
         conversion.

#### Inherited from

```ts
IValueConverter.toSolidityValue
```

***

### toString()

```ts
toString(): string;
```

Defined in: [src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)
