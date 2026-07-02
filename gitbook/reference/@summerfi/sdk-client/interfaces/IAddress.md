# Interface: IAddress

Defined in: [../sdk-common/src/common/interfaces/IAddress.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IAddress.ts#L18)

Represents an address with a certain format, specified by the type

Currently only Ethereum type is supported

## Extends

- [`IAddressData`](../type-aliases/IAddressData.md).[`IPrintable`](IPrintable.md).`ISolidityValue`\<[`AddressValue`](../type-aliases/AddressValue.md)\>

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IAddress.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IAddress.ts#L20)

Signature to differentiate from similar interfaces

***

### type

```ts
readonly type: AddressType;
```

Defined in: [../sdk-common/src/common/interfaces/IAddress.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IAddress.ts#L24)

The type of the address

#### Overrides

```ts
IAddressData.type
```

***

### value

```ts
readonly value: `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/IAddress.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IAddress.ts#L22)

The address value in the format specified by type

#### Overrides

```ts
IAddressData.value
```

## Methods

### equals()

```ts
equals(address): boolean;
```

Defined in: [../sdk-common/src/common/interfaces/IAddress.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IAddress.ts#L34)

Checks if two addresses are equal

#### Parameters

##### address

`IAddress`

The address to compare

#### Returns

`boolean`

true if the addresses are equal

Equality is determined by the address value and type

***

### toSolidityValue()

```ts
toSolidityValue(): `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/ISolidityValue.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISolidityValue.ts#L8)

Converts the instance into a Solidity value

#### Returns

`` `0x${string}` ``

#### Inherited from

```ts
ISolidityValue.toSolidityValue
```

***

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)
