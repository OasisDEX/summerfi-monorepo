# Class: SDKError

Defined in: [src/common/implementation/SDKError.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L13)

## See

ISDKError

## Extends

- `Error`

## Extended by

- [`SwapError`](SwapError.md)

## Implements

- [`ISDKError`](../interfaces/ISDKError.md)

## Constructors

### Constructor

```ts
protected new SDKError(params): SDKError;
```

Defined in: [src/common/implementation/SDKError.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L28)

CONSTRUCTOR

#### Parameters

##### params

[`SDKErrorParameters`](../type-aliases/SDKErrorParameters.md)

#### Returns

`SDKError`

#### Overrides

```ts
Error.constructor
```

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/SDKError.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L15)

SIGNATURE

#### Implementation of

[`ISDKError`](../interfaces/ISDKError.md).[`[___signature__]`](../interfaces/ISDKError.md#___signature__)

***

### message

```ts
readonly message: string;
```

Defined in: [src/common/implementation/SDKError.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L20)

Free form debug message, used to debug the issue through the console

#### Implementation of

[`ISDKError`](../interfaces/ISDKError.md).[`message`](../interfaces/ISDKError.md#message)

#### Overrides

```ts
Error.message
```

***

### reason

```ts
readonly reason: string;
```

Defined in: [src/common/implementation/SDKError.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L19)

Free form reason message, used to provide a short description of the problem

#### Implementation of

[`ISDKError`](../interfaces/ISDKError.md).[`reason`](../interfaces/ISDKError.md#reason)

***

### type

```ts
readonly type: SDKErrorType;
```

Defined in: [src/common/implementation/SDKError.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L18)

ATTRIBUTES

#### Implementation of

[`ISDKError`](../interfaces/ISDKError.md).[`type`](../interfaces/ISDKError.md#type)

## Methods

### createFrom()

```ts
static createFrom(params): ISDKError;
```

Defined in: [src/common/implementation/SDKError.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/SDKError.ts#L23)

FACTORY

#### Parameters

##### params

[`SDKErrorParameters`](../type-aliases/SDKErrorParameters.md)

#### Returns

[`ISDKError`](../interfaces/ISDKError.md)
