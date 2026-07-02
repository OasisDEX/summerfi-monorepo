# Class: User

Defined in: [../sdk-common/src/user/implementation/User.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L18)

## See

IUser

## Implements

- [`IUser`](../interfaces/IUser.md)

## Constructors

### Constructor

```ts
protected new User(params): User;
```

Defined in: [../sdk-common/src/user/implementation/User.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L41)

SEALED CONSTRUCTOR

#### Parameters

##### params

[`UserParameters`](../type-aliases/UserParameters.md)

#### Returns

`User`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/user/implementation/User.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L20)

SIGNATURE

#### Implementation of

[`IUser`](../interfaces/IUser.md).[`[___signature__]`](../interfaces/IUser.md#___signature__)

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/user/implementation/User.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L24)

The chain the user is connected to

#### Implementation of

[`IUser`](../interfaces/IUser.md).[`chainInfo`](../interfaces/IUser.md#chaininfo)

***

### wallet

```ts
readonly wallet: IWallet;
```

Defined in: [../sdk-common/src/user/implementation/User.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L23)

ATTRIBUTES

#### Implementation of

[`IUser`](../interfaces/IUser.md).[`wallet`](../interfaces/IUser.md#wallet)

## Methods

### equals()

```ts
equals(token): boolean;
```

Defined in: [../sdk-common/src/user/implementation/User.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L49)

#### Parameters

##### token

[`IUser`](../interfaces/IUser.md)

#### Returns

`boolean`

#### See

IUser.equals

***

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/user/implementation/User.ts:54](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L54)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`IUser`](../interfaces/IUser.md).[`toString`](../interfaces/IUser.md#tostring)

***

### createFrom()

```ts
static createFrom(params): User;
```

Defined in: [../sdk-common/src/user/implementation/User.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L27)

FACTORY

#### Parameters

##### params

[`UserParameters`](../type-aliases/UserParameters.md)

#### Returns

`User`

***

### createFromEthereum()

```ts
static createFromEthereum(chainId, addressValue): User;
```

Defined in: [../sdk-common/src/user/implementation/User.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/implementation/User.ts#L31)

#### Parameters

##### chainId

`number`

##### addressValue

`` `0x${string}` ``

#### Returns

`User`
