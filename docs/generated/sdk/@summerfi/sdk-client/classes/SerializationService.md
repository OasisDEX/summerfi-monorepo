# Class: SerializationService

Defined in: [sdk/sdk-common/src/services/SerializationService.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/services/SerializationService.ts#L14)

Static facade over SuperJSON for registering classes and custom transformers so SDK domain
objects can be serialized and deserialized across the RPC boundary.

## Constructors

### Constructor

```ts
new SerializationService(): SerializationService;
```

#### Returns

`SerializationService`

## Methods

### getTransformer()

```ts
static getTransformer(): object;
```

Defined in: [sdk/sdk-common/src/services/SerializationService.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/services/SerializationService.ts#L36)

#### Returns

`object`

##### input

```ts
input: object;
```

###### input.deserialize()

```ts
deserialize: (serializedData) => unknown;
```

###### Parameters

###### serializedData

`string`

###### Returns

`unknown`

###### input.serialize()

```ts
serialize: (obj) => string;
```

###### Parameters

###### obj

`unknown`

###### Returns

`string`

##### output

```ts
output: object;
```

###### output.deserialize()

```ts
deserialize: (serializedData) => unknown;
```

###### Parameters

###### serializedData

`string`

###### Returns

`unknown`

###### output.serialize()

```ts
serialize: (obj) => string;
```

###### Parameters

###### obj

`unknown`

###### Returns

`string`

***

### parse()

```ts
static parse<T>(v): T;
```

Defined in: [sdk/sdk-common/src/services/SerializationService.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/services/SerializationService.ts#L32)

#### Type Parameters

##### T

`T`

#### Parameters

##### v

`string`

#### Returns

`T`

***

### registerClass()

```ts
static registerClass(v, options?): void;
```

Defined in: [sdk/sdk-common/src/services/SerializationService.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/services/SerializationService.ts#L15)

#### Parameters

##### v

`object`

##### options?

`string` | `RegisterOptions`

#### Returns

`void`

***

### registerCustom()

```ts
static registerCustom<I, O>(transformer, name): void;
```

Defined in: [sdk/sdk-common/src/services/SerializationService.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/services/SerializationService.ts#L20)

#### Type Parameters

##### I

`I`

##### O

`O` *extends* `JSONValue`

#### Parameters

##### transformer

`Omit`\<`CustomTransfomer`\<`I`, `O`\>, `"name"`\>

##### name

`string`

#### Returns

`void`

***

### stringify()

```ts
static stringify(v): string;
```

Defined in: [sdk/sdk-common/src/services/SerializationService.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/services/SerializationService.ts#L28)

#### Parameters

##### v

`unknown`

#### Returns

`string`
