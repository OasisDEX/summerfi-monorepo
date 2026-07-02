# Class: Address

Defined in: [src/common/implementation/Address.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L15)

## See

IAddress

## Implements

- [`IAddress`](../interfaces/IAddress.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/Address.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L17)

SIGNATURE

#### Implementation of

[`IAddress`](../interfaces/IAddress.md).[`[___signature__]`](../interfaces/IAddress.md#___signature__)

***

### type

```ts
readonly type: AddressType;
```

Defined in: [src/common/implementation/Address.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L21)

The type of the address

#### Implementation of

[`IAddress`](../interfaces/IAddress.md).[`type`](../interfaces/IAddress.md#type)

***

### value

```ts
readonly value: `0x${string}`;
```

Defined in: [src/common/implementation/Address.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L20)

ATTRIBUTES

#### Implementation of

[`IAddress`](../interfaces/IAddress.md).[`value`](../interfaces/IAddress.md#value)

***

### ZeroAddressEthereum

```ts
static ZeroAddressEthereum: Address;
```

Defined in: [src/common/implementation/Address.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L24)

CONSTANTS

## Methods

### equals()

```ts
equals(address): boolean;
```

Defined in: [src/common/implementation/Address.ts:62](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L62)

PUBLIC METHODS

#### Parameters

##### address

`Address`

#### Returns

`boolean`

#### Implementation of

[`IAddress`](../interfaces/IAddress.md).[`equals`](../interfaces/IAddress.md#equals)

***

### toBigNumber()

```ts
toBigNumber(): BigNumber;
```

Defined in: [src/common/implementation/Address.ts:72](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L72)

#### Returns

`BigNumber`

#### See

IValueConverter.toBigNumber

***

### toSolidityValue()

```ts
toSolidityValue(): `0x${string}`;
```

Defined in: [src/common/implementation/Address.ts:67](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L67)

#### Returns

`` `0x${string}` ``

#### See

IValueConverter.toBigNumber

#### Implementation of

[`IAddress`](../interfaces/IAddress.md).[`toSolidityValue`](../interfaces/IAddress.md#tosolidityvalue)

***

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/Address.ts:77](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L77)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`IAddress`](../interfaces/IAddress.md).[`toString`](../interfaces/IAddress.md#tostring)

***

### createFrom()

```ts
static createFrom(params): Address;
```

Defined in: [src/common/implementation/Address.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L31)

FACTORY METHODS

#### Parameters

##### params

[`AddressParameters`](../type-aliases/AddressParameters.md)

#### Returns

`Address`

***

### createFromEthereum()

```ts
static createFromEthereum(params): Address;
```

Defined in: [src/common/implementation/Address.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L35)

#### Parameters

##### params

###### value

`string`

#### Returns

`Address`

***

### getType()

```ts
static getType(address): AddressType;
```

Defined in: [src/common/implementation/Address.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L44)

#### Parameters

##### address

`string`

#### Returns

[`AddressType`](../enumerations/AddressType.md)

***

### isValid()

```ts
static isValid(address): boolean;
```

Defined in: [src/common/implementation/Address.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Address.ts#L39)

#### Parameters

##### address

`string`

#### Returns

`boolean`
