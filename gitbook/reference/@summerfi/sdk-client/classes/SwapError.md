# Class: SwapError

Defined in: [../sdk-common/src/swap/implementation/SwapError.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L15)

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

Defined in: [../sdk-common/src/swap/implementation/SwapError.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L17)

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

Defined in: [../sdk-common/src/common/implementation/SDKError.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L15)

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

Defined in: [../sdk-common/src/swap/implementation/SwapError.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L22)

Full URL of the API query that generated the error

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`apiQuery`](../interfaces/ISwapError.md#apiquery)

***

### cause?

```ts
optional cause: unknown;
```

Defined in: [../../node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/npm/typescript@5.9.3/node_modules/typescript/lib/lib.es2022.error.d.ts#L26)

#### Inherited from

[`SDKError`](SDKError.md).[`cause`](SDKError.md#cause)

***

### message

```ts
readonly message: string;
```

Defined in: [../sdk-common/src/common/implementation/SDKError.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L20)

Free form debug message, used to debug the issue through the console

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`message`](../interfaces/ISwapError.md#message)

#### Inherited from

[`SDKError`](SDKError.md).[`message`](SDKError.md#message)

***

### name

```ts
name: string;
```

Defined in: [../../node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1076](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/npm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1076)

#### Inherited from

[`SDKError`](SDKError.md).[`name`](SDKError.md#name)

***

### reason

```ts
readonly reason: string;
```

Defined in: [../sdk-common/src/common/implementation/SDKError.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L19)

Free form reason message, used to provide a short description of the problem

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`reason`](../interfaces/ISwapError.md#reason)

#### Inherited from

[`SDKError`](SDKError.md).[`reason`](SDKError.md#reason)

***

### stack?

```ts
optional stack: string;
```

Defined in: [../../node\_modules/.pnpm/typescript@5.9.3/node\_modules/typescript/lib/lib.es5.d.ts:1078](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/npm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts#L1078)

#### Inherited from

[`SDKError`](SDKError.md).[`stack`](SDKError.md#stack)

***

### statusCode

```ts
readonly statusCode: number;
```

Defined in: [../sdk-common/src/swap/implementation/SwapError.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L23)

GET or POST status code

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`statusCode`](../interfaces/ISwapError.md#statuscode)

***

### subtype

```ts
readonly subtype: SwapErrorType;
```

Defined in: [../sdk-common/src/swap/implementation/SwapError.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L21)

Specific error for the swap service

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`subtype`](../interfaces/ISwapError.md#subtype)

***

### type

```ts
readonly type: SwapError;
```

Defined in: [../sdk-common/src/swap/implementation/SwapError.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L20)

ATTRIBUTES

#### Implementation of

[`ISwapError`](../interfaces/ISwapError.md).[`type`](../interfaces/ISwapError.md#type)

#### Overrides

[`SDKError`](SDKError.md).[`type`](SDKError.md#type)

***

### stackTraceLimit

```ts
static stackTraceLimit: number;
```

Defined in: [../../node\_modules/.pnpm/@types+node@20.19.37/node\_modules/@types/node/globals.d.ts:68](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/npm/@types+node@20.19.37/node_modules/@types/node/globals.d.ts#L68)

The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.

#### Inherited from

[`SDKError`](SDKError.md).[`stackTraceLimit`](SDKError.md#stacktracelimit)

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: [../../node\_modules/.pnpm/@types+node@20.19.37/node\_modules/@types/node/globals.d.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/npm/@types+node@20.19.37/node_modules/@types/node/globals.d.ts#L52)

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

[`SDKError`](SDKError.md).[`captureStackTrace`](SDKError.md#capturestacktrace)

***

### createFrom()

```ts
static createFrom(params): SwapError;
```

Defined in: [../sdk-common/src/swap/implementation/SwapError.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SwapError.ts#L26)

FACTORY

#### Parameters

##### params

[`SwapErrorParams`](../type-aliases/SwapErrorParams.md)

#### Returns

`SwapError`

#### Overrides

[`SDKError`](SDKError.md).[`createFrom`](SDKError.md#createfrom)

***

### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: [../../node\_modules/.pnpm/@types+node@20.19.37/node\_modules/@types/node/globals.d.ts:56](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/npm/@types+node@20.19.37/node_modules/@types/node/globals.d.ts#L56)

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`SDKError`](SDKError.md).[`prepareStackTrace`](SDKError.md#preparestacktrace)
