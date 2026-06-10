# Interface: IUsersManager

Defined in: [sdk/sdk-client/src/interfaces/IUsersManager.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/interfaces/IUsersManager.ts#L8)

IUsersManager

## Description

Allows to retrieve a user by their wallet and network

## Methods

### getUserClient()

```ts
getUserClient(params): Promise<IUserClient>;
```

Defined in: [sdk/sdk-client/src/interfaces/IUsersManager.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/interfaces/IUsersManager.ts#L18)

#### Parameters

##### params

###### chainInfo

[`ChainInfo`](../classes/ChainInfo.md)

###### walletAddress

[`Address`](../classes/Address.md)

#### Returns

`Promise`\<[`IUserClient`](IUserClient.md)\>

The user for the given wallet and network

#### Method

getUserClient

#### Description

Retrieves a user by their wallet and network
