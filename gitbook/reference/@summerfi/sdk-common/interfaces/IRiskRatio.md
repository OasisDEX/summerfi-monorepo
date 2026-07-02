# Interface: IRiskRatio

Defined in: [src/common/interfaces/IRiskRatio.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRiskRatio.ts#L25)

Interface for the implementors of the risk ratio

## Extends

- [`IRiskRatioData`](../type-aliases/IRiskRatioData.md).[`IPrintable`](IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IRiskRatio.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRiskRatio.ts#L27)

Signature to differentiate from similar interfaces

***

### type

```ts
readonly type: RiskRatioType;
```

Defined in: [src/common/interfaces/IRiskRatio.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRiskRatio.ts#L29)

The type of the risk ratio

#### Overrides

```ts
IRiskRatioData.type
```

***

### value

```ts
readonly value: number | IPercentage;
```

Defined in: [src/common/interfaces/IRiskRatio.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRiskRatio.ts#L31)

The risk ratio value, a percentage for LTV and Collateralization Ratio, a number for Multiple

#### Overrides

```ts
IRiskRatioData.value
```

## Methods

### toCollateralizationRatio()

```ts
toCollateralizationRatio(): IPercentage;
```

Defined in: [src/common/interfaces/IRiskRatio.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRiskRatio.ts#L34)

Gets the LTV value as a collateralization ratio

#### Returns

[`IPercentage`](IPercentage.md)

***

### toLTV()

```ts
toLTV(): IPercentage;
```

Defined in: [src/common/interfaces/IRiskRatio.ts:40](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRiskRatio.ts#L40)

Gets the LTV value

#### Returns

[`IPercentage`](IPercentage.md)

***

### toMultiple()

```ts
toMultiple(): number;
```

Defined in: [src/common/interfaces/IRiskRatio.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRiskRatio.ts#L37)

Gets the LTV value as a multiply factor

#### Returns

`number`

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
