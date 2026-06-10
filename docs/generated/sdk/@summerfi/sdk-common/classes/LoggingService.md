# Class: LoggingService

Defined in: [sdk/sdk-common/src/services/LoggingService.ts:5](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/services/LoggingService.ts#L5)

Static logging helper whose `log`/`debug` output is gated by the `SDK_LOGGING_ENABLED` and
`SDK_DEBUG_ENABLED` environment variables; errors are always emitted.

## Constructors

### Constructor

```ts
new LoggingService(): LoggingService;
```

#### Returns

`LoggingService`

## Methods

### debug()

```ts
static debug(...messages): void;
```

Defined in: [sdk/sdk-common/src/services/LoggingService.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/services/LoggingService.ts#L12)

#### Parameters

##### messages

...`unknown`[]

#### Returns

`void`

***

### error()

```ts
static error(...messages): void;
```

Defined in: [sdk/sdk-common/src/services/LoggingService.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/services/LoggingService.ts#L18)

#### Parameters

##### messages

...`unknown`[]

#### Returns

`void`

***

### log()

```ts
static log(...messages): void;
```

Defined in: [sdk/sdk-common/src/services/LoggingService.ts:6](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/services/LoggingService.ts#L6)

#### Parameters

##### messages

...`unknown`[]

#### Returns

`void`
