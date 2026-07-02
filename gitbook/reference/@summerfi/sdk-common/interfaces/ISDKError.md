# Interface: ISDKError

Defined in: [src/common/interfaces/ISDKError.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L13)

Represents a custom error of the SDK

## Extends

- [`ISDKErrorData`](../type-aliases/ISDKErrorData.md).[`IPrintable`](IPrintable.md)

## Extended by

- [`ISwapError`](ISwapError.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/ISDKError.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L15)

Signature to differentiate from similar interfaces

***

### message

```ts
readonly message: string;
```

Defined in: [src/common/interfaces/ISDKError.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L21)

Free form debug message, used to debug the issue through the console

#### Overrides

```ts
ISDKErrorData.message
```

***

### reason

```ts
readonly reason: string;
```

Defined in: [src/common/interfaces/ISDKError.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L19)

Free form reason message, used to provide a short description of the problem

#### Overrides

```ts
ISDKErrorData.reason
```

***

### type

```ts
readonly type: SDKErrorType;
```

Defined in: [src/common/interfaces/ISDKError.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L17)

Error type main category

#### Overrides

```ts
ISDKErrorData.type
```

## Methods

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
