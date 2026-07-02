# Interface: IUsersManager

Defined in: [src/interfaces/IUsersManager.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IUsersManager.ts#L7)

Allows to retrieve a user by their wallet and network

## Methods

### getUserClient()

```ts
getUserClient(params): Promise<IUserClient>;
```

Defined in: [src/interfaces/IUsersManager.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IUsersManager.ts#L16)

Retrieves a user by their wallet and network

#### Parameters

##### params

###### chainInfo

[`ChainInfo`](../classes/ChainInfo.md)

###### walletAddress

[`Address`](../classes/Address.md)

#### Returns

`Promise`\<[`IUserClient`](IUserClient.md)\>

The user for the given wallet and network
