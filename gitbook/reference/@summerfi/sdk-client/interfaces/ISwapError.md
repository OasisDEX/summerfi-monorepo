# Interface: ISwapError

Defined in: [../sdk-common/src/swap/interfaces/ISwapError.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/interfaces/ISwapError.ts#L14)

Represents a custom error of the SDK for the Swap service

## Extends

- [`ISDKError`](ISDKError.md).[`ISwapErrorData`](../type-aliases/ISwapErrorData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/swap/interfaces/ISwapError.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/interfaces/ISwapError.ts#L16)

Signature to differentiate from similar interfaces

#### Inherited from

[`ISDKError`](ISDKError.md).[`[___signature__]`](ISDKError.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/ISDKError.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L15)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
ISDKError.[___signature__]
```

***

### apiQuery

```ts
readonly apiQuery: string;
```

Defined in: [../sdk-common/src/swap/interfaces/ISwapError.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/interfaces/ISwapError.ts#L21)

Full URL of the API query that generated the error

#### Overrides

```ts
ISwapErrorData.apiQuery
```

***

### message

```ts
readonly message: string;
```

Defined in: [../sdk-common/src/common/interfaces/ISDKError.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L21)

Free form debug message, used to debug the issue through the console

#### Inherited from

[`ISDKError`](ISDKError.md).[`message`](ISDKError.md#message)

***

### reason

```ts
readonly reason: string;
```

Defined in: [../sdk-common/src/common/interfaces/ISDKError.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ISDKError.ts#L19)

Free form reason message, used to provide a short description of the problem

#### Inherited from

[`ISDKError`](ISDKError.md).[`reason`](ISDKError.md#reason)

***

### statusCode

```ts
readonly statusCode: number;
```

Defined in: [../sdk-common/src/swap/interfaces/ISwapError.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/interfaces/ISwapError.ts#L23)

GET or POST status code

#### Overrides

```ts
ISwapErrorData.statusCode
```

***

### subtype

```ts
readonly subtype: SwapErrorType;
```

Defined in: [../sdk-common/src/swap/interfaces/ISwapError.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/interfaces/ISwapError.ts#L19)

Specific error for the swap service

#### Overrides

```ts
ISwapErrorData.subtype
```

***

### type

```ts
readonly type: SwapError;
```

Defined in: [../sdk-common/src/swap/interfaces/ISwapError.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/interfaces/ISwapError.ts#L17)

Error type main category

#### Overrides

[`ISDKError`](ISDKError.md).[`type`](ISDKError.md#type)

## Methods

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

[`ISDKError`](ISDKError.md).[`toString`](ISDKError.md#tostring)
