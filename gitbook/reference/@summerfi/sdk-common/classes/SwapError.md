# Class: SwapError

Defined in: [src/swap/implementation/SwapError.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L15)

## See

ISwapError

## Extends

- [`SDKError`](SDKError.md)

## Implements

- [`ISwapError`](../interfaces/ISwapError.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/swap/implementation/SwapError.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L17)

SIGNATURE

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`[___signature__]`](../interfaces/ISwapError.md#___signature__-1)

#### Inherited from

[`SDKError`](SDKError.md).[`[___signature__]`](SDKError.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/SDKError.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L15)

SIGNATURE

#### Implementation of

```ts
ISwapError.[___signature__]
```

#### Inherited from

```ts
SDKError.[___signature__]
```

***

### apiQuery

```ts
readonly apiQuery: string;
```

Defined in: [src/swap/implementation/SwapError.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L22)

Full URL of the API query that generated the error

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`apiQuery`](../interfaces/ISwapError.md#apiquery)

***

### message

```ts
readonly message: string;
```

Defined in: [src/common/implementation/SDKError.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L20)

Free form debug message, used to debug the issue through the console

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`message`](../interfaces/ISwapError.md#message)

#### Inherited from

[`SDKError`](SDKError.md).[`message`](SDKError.md#message)

***

### reason

```ts
readonly reason: string;
```

Defined in: [src/common/implementation/SDKError.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L19)

Free form reason message, used to provide a short description of the problem

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`reason`](../interfaces/ISwapError.md#reason)

#### Inherited from

[`SDKError`](SDKError.md).[`reason`](SDKError.md#reason)

***

### statusCode

```ts
readonly statusCode: number;
```

Defined in: [src/swap/implementation/SwapError.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L23)

GET or POST status code

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`statusCode`](../interfaces/ISwapError.md#statuscode)

***

### subtype

```ts
readonly subtype: SwapErrorType;
```

Defined in: [src/swap/implementation/SwapError.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L21)

Specific error for the swap service

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`subtype`](../interfaces/ISwapError.md#subtype)

***

### type

```ts
readonly type: SwapError;
```

Defined in: [src/swap/implementation/SwapError.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L20)

ATTRIBUTES

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`type`](../interfaces/ISwapError.md#type)

#### Overrides

[`SDKError`](SDKError.md).[`type`](SDKError.md#type)

## Methods

### createFrom()

```ts
static createFrom(params): SwapError;
```

Defined in: [src/swap/implementation/SwapError.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L26)

FACTORY

#### Parameters

##### params

[`SwapErrorParams`](../type-aliases/SwapErrorParams.md)

#### Returns

`SwapError`

#### Overrides

[`SDKError`](SDKError.md).[`createFrom`](SDKError.md#createfrom)
