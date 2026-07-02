# Interface: IArmadaManagerClientAccessControl

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L14)

Interface for the Armada Manager Access Control client - handles role-based access control operations

## Methods

### getAllAddressesWithContractSpecificRole()

```ts
getAllAddressesWithContractSpecificRole(params): Promise<`0x${string}`[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:133](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L133)

Gets all addresses that currently have a specific contract-specific role

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to check the role on

###### contractAddress

[`IAddress`](IAddress.md)

The target contract address

###### role

[`InstiContractRoles`](../enumerations/InstiContractRoles.md)

The contract-specific role to check for

#### Returns

`Promise`\<`` `0x${string}` ``[]\>

Promise<AddressValue[]> Array of addresses that have the role

***

### getAllAddressesWithGlobalRole()

```ts
getAllAddressesWithGlobalRole(params): Promise<`0x${string}`[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:119](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L119)

Gets all addresses that currently have a specific global protocol role

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to check the role on

###### role

[`GlobalRoles`](../enumerations/GlobalRoles.md)

The global role to check for

#### Returns

`Promise`\<`` `0x${string}` ``[]\>

Promise<AddressValue[]> Array of addresses that have the role

***

### getAllRoles()

```ts
getAllRoles(params): Promise<RolesResponse>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:240](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L240)

Gets all roles for a given chainId with pagination and filtering support

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to get roles for

###### first?

`number`

Number of items to return (default: 1000)

###### name?

`string`

Optional role name filter

###### owner?

`` `0x${string}` ``

Optional owner address filter

###### skip?

`number`

Number of items to skip for pagination (default: 0)

###### targetContract?

`` `0x${string}` ``

Optional target contract address filter

#### Returns

`Promise`\<[`RolesResponse`](../type-aliases/RolesResponse.md)\>

Promise with array of role objects containing id, name, owner, targetContract, and institution

***

### grantContractSpecificRole()

```ts
grantContractSpecificRole(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:87](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L87)

Grants a contract-specific role to an address

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to grant the role on

###### contractAddress

[`IAddress`](IAddress.md)

The target contract address

###### role

[`InstiContractRoles`](../enumerations/InstiContractRoles.md)

The contract-specific role to grant

###### targetAddress

[`IAddress`](IAddress.md)

The address to grant the role to

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction information

***

### grantGlobalRole()

```ts
grantGlobalRole(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:56](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L56)

Grants a global protocol role to an address

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to grant the role on

###### role

[`GlobalRoles`](../enumerations/GlobalRoles.md)

The global role to grant

###### targetAddress

[`IAddress`](IAddress.md)

The address to grant the role to

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction information

***

### hasContractSpecificRole()

```ts
hasContractSpecificRole(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:40](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L40)

Checks if an address has a specific contract-specific role

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to check the role on

###### contractAddress

[`IAddress`](IAddress.md)

The target contract address

###### role

[`InstiContractRoles`](../enumerations/InstiContractRoles.md)

The contract-specific role to check

###### targetAddress

[`IAddress`](IAddress.md)

The address to check for the role

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> True if the target address has the role

***

### hasGlobalRole()

```ts
hasGlobalRole(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L24)

Checks if an address has a specific global protocol role

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to check the role on

###### role

[`GlobalRoles`](../enumerations/GlobalRoles.md)

The global role to check

###### targetAddress

[`IAddress`](IAddress.md)

The address to check for the role

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> True if the address has the role

***

### isWhitelisted()

```ts
isWhitelisted(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:148](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L148)

Checks if an address is whitelisted in the FleetCommander contract

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to check the whitelist status on

###### fleetCommanderAddress

`` `0x${string}` ``

The FleetCommander contract address

###### targetAddress

`` `0x${string}` ``

The address to check for whitelist status

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> True if the address is whitelisted

***

### isWhitelistedAQ()

```ts
isWhitelistedAQ(params): Promise<boolean>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:196](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L196)

Checks if an address is whitelisted in the AdmiralsQuarters contract

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to check the whitelist status on

###### targetAddress

`` `0x${string}` ``

The address to check for whitelist status

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> True if the address is whitelisted

***

### revokeContractSpecificRole()

```ts
revokeContractSpecificRole(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:104](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L104)

Revokes a contract-specific role from an address

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to revoke the role on

###### contractAddress

[`IAddress`](IAddress.md)

The target contract address

###### role

[`InstiContractRoles`](../enumerations/InstiContractRoles.md)

The contract-specific role to revoke

###### targetAddress

[`IAddress`](IAddress.md)

The address to revoke the role from

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction information

***

### revokeGlobalRole()

```ts
revokeGlobalRole(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:71](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L71)

Revokes a global protocol role from an address

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to revoke the role on

###### role

[`GlobalRoles`](../enumerations/GlobalRoles.md)

The global role to revoke

###### targetAddress

[`IAddress`](IAddress.md)

The address to revoke the role from

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction information

***

### setWhitelisted()

```ts
setWhitelisted(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:164](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L164)

Sets the whitelist status for an address in the FleetCommander contract

#### Parameters

##### params

###### allowed

`boolean`

The whitelist status to set

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to set the whitelist status on

###### fleetCommanderAddress

`` `0x${string}` ``

The FleetCommander contract address

###### targetAddress

`` `0x${string}` ``

The address to set the whitelist status for

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction information

***

### setWhitelistedAQ()

```ts
setWhitelistedAQ(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:207](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L207)

Sets the whitelist status for an address in the AdmiralsQuarters contract

#### Parameters

##### params

###### allowed

`boolean`

The whitelist status to set

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to set the whitelist status on

###### targetAddress

`` `0x${string}` ``

The address to set the whitelist status for

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction information

***

### setWhitelistedBatch()

```ts
setWhitelistedBatch(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:181](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L181)

Sets the whitelist status for multiple addresses in the FleetCommander contract

#### Parameters

##### params

###### allowed

`boolean`[]

The whitelist statuses to set (must match the length of targetAddresses)

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to set the whitelist status on

###### fleetCommanderAddress

`` `0x${string}` ``

The FleetCommander contract address

###### targetAddresses

`` `0x${string}` ``[]

The addresses to set the whitelist status for

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction information

***

### setWhitelistedBatchAQ()

```ts
setWhitelistedBatchAQ(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts:222](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClientAccessControl.ts#L222)

Sets the whitelist status for multiple addresses in the AdmiralsQuarters contract

#### Parameters

##### params

###### allowed

`boolean`[]

The whitelist statuses to set (must match the length of targetAddresses)

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID to set the whitelist status on

###### targetAddresses

`` `0x${string}` ``[]

The addresses to set the whitelist status for

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

Promise<TransactionInfo> The transaction information
