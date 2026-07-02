# Interface: ISparkLendingPoolId

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts#L17)

Identifier of a lending pool in the Spark protocol

Typescript forces the interface to re-declare any properties that have different BUT compatible types.
This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936

## Extends

- `ISparkLendingPoolIdData`.[`ILendingPoolId`](ILendingPoolId.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts#L19)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`ILendingPoolId`](ILendingPoolId.md).[`[___signature__]`](ILendingPoolId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L22)

Signature to differentiate it from other interfaces

#### Inherited from

```ts
ILendingPoolId.[___signature__]
```

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPoolId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L18)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
ILendingPoolId.[___signature__]
```

***

### collateralToken

```ts
readonly collateralToken: ITokenStanalone;
```

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts#L25)

The token used to collateralize the position

#### Overrides

```ts
ISparkLendingPoolIdData.collateralToken
```

***

### debtToken

```ts
readonly debtToken: ITokenStanalone;
```

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts#L27)

The token used to borrow funds

#### Overrides

```ts
ISparkLendingPoolIdData.debtToken
```

***

### emodeType

```ts
readonly emodeType: EmodeType;
```

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts#L23)

The efficiency mode of the pool

#### Overrides

```ts
ISparkLendingPoolIdData.emodeType
```

***

### protocol

```ts
readonly protocol: ISparkProtocol;
```

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkLendingPoolId.ts#L21)

The protocol to which the pool belongs

#### Overrides

[`ILendingPoolId`](ILendingPoolId.md).[`protocol`](ILendingPoolId.md#protocol)

***

### type

```ts
readonly type: Lending;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L35)

Pool type

#### Inherited from

[`ILendingPoolId`](ILendingPoolId.md).[`type`](ILendingPoolId.md#type)
