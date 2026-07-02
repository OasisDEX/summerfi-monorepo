# Interface: IMakerLendingPoolId

Defined in: [../protocol-plugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts#L16)

Represents a lending pool's ID for the Maker protocol

It includes the ILK type which will determine which pool will be used

## Extends

- [`ILendingPoolId`](ILendingPoolId.md).`IMakerLendingPoolIdData`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../protocol-plugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts#L18)

Signature to differentiate from similar interfaces

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

Defined in: [../protocol-plugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts#L24)

The token used to collateralize the position

#### Overrides

```ts
IMakerLendingPoolIdData.collateralToken
```

***

### debtToken

```ts
readonly debtToken: ITokenStanalone;
```

Defined in: [../protocol-plugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts#L26)

The token used to borrow funds

#### Overrides

```ts
IMakerLendingPoolIdData.debtToken
```

***

### ilkType

```ts
readonly ilkType: ILKType;
```

Defined in: [../protocol-plugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts#L22)

The ILK type of the pool

#### Overrides

```ts
IMakerLendingPoolIdData.ilkType
```

***

### protocol

```ts
readonly protocol: IMakerProtocol;
```

Defined in: [../protocol-plugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/interfaces/IMakerLendingPoolId.ts#L20)

The Maker protocol

#### Overrides

[`ILendingPoolId`](ILendingPoolId.md).[`protocol`](ILendingPoolId.md#protocol)

***

### type

```ts
readonly type: Lending;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L27)

Pool type

#### Inherited from

[`ILendingPoolId`](ILendingPoolId.md).[`type`](ILendingPoolId.md#type)
