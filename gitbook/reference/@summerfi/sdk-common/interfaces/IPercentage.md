# Interface: IPercentage

Defined in: [src/common/interfaces/IPercentage.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L13)

Percentage type that can be used for calculations with other types like TokenAmount or Price

## Extends

- [`IPercentageData`](../type-aliases/IPercentageData.md).`IValueConverter`.[`IPrintable`](IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPercentage.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L15)

Signature to differentiate from similar interfaces

***

### value

```ts
readonly value: number;
```

Defined in: [src/common/interfaces/IPercentage.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L17)

The percentage in floating point format

#### Overrides

```ts
IPercentageData.value
```

## Methods

### add()

```ts
add(percentage): IPercentage;
```

Defined in: [src/common/interfaces/IPercentage.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L23)

#### Parameters

##### percentage

`IPercentage`

Percentage to add

#### Returns

`IPercentage`

the result of the addition

***

### divide()

```ts
divide(divisor): IPercentage;
```

Defined in: [src/common/interfaces/IPercentage.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L41)

#### Parameters

##### divisor

A percentage, string amount or number to divide

`string` | `number` | `IPercentage`

#### Returns

`IPercentage`

The resulting percentage

***

### multiply()

```ts
multiply(multiplier): IPercentage;
```

Defined in: [src/common/interfaces/IPercentage.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L35)

#### Parameters

##### multiplier

A percentage, string amount or number to multiply

`string` | `number` | `IPercentage`

#### Returns

`IPercentage`

The resulting percentage

***

### subtract()

```ts
subtract(percentage): IPercentage;
```

Defined in: [src/common/interfaces/IPercentage.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L29)

#### Parameters

##### percentage

[`IPercentageData`](../type-aliases/IPercentageData.md)

Percentage to subtract

#### Returns

`IPercentage`

the result of the subtraction

***

### toBigNumber()

```ts
toBigNumber(): BigNumber;
```

Defined in: [src/common/interfaces/IValueConverter.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IValueConverter.ts#L36)

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

### toComplement()

```ts
toComplement(): IPercentage;
```

Defined in: [src/common/interfaces/IPercentage.ts:55](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L55)

#### Returns

`IPercentage`

The complement of the percentage

The complement is the difference between 100% and the percentage

***

### toProportion()

```ts
toProportion(): number;
```

Defined in: [src/common/interfaces/IPercentage.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L48)

#### Returns

`number`

Returns the equivalent proportion of the percentage

The proportion is the percentage divided by 100, this is, a floating value between 0 and 1

***

### toSolidityValue()

```ts
toSolidityValue(params?): bigint;
```

Defined in: [src/common/interfaces/IValueConverter.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IValueConverter.ts#L22)

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

Defined in: [src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)
