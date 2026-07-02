# Class: ArmadaManagerClient

Defined in: [src/implementation/ArmadaManager/ArmadaManagerClient.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/ArmadaManagerClient.ts#L13)

Implementation of the Armada Manager client interface of the Armada

## Implements

- [`IArmadaManagerClient`](../interfaces/IArmadaManagerClient.md)

## Constructors

### Constructor

```ts
new ArmadaManagerClient(params): ArmadaManagerClient;
```

Defined in: [src/implementation/ArmadaManager/ArmadaManagerClient.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/ArmadaManagerClient.ts#L19)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`ArmadaManagerClient`

## Properties

### accessControl

```ts
readonly accessControl: IArmadaManagerClientAccessControl;
```

Defined in: [src/implementation/ArmadaManager/ArmadaManagerClient.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/ArmadaManagerClient.ts#L17)

Access Control API for the Armada protocol - role-based access control operations

#### Implementation of

[`IArmadaManagerClient`](../interfaces/IArmadaManagerClient.md).[`accessControl`](../interfaces/IArmadaManagerClient.md#accesscontrol)

***

### admin

```ts
readonly admin: IArmadaManagerAdminClient;
```

Defined in: [src/implementation/ArmadaManager/ArmadaManagerClient.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/ArmadaManagerClient.ts#L16)

Admin API for the Armada protocol - consolidated administrative operations

#### Implementation of

[`IArmadaManagerClient`](../interfaces/IArmadaManagerClient.md).[`admin`](../interfaces/IArmadaManagerClient.md#admin)

***

### users

```ts
readonly users: IArmadaManagerUsersClient;
```

Defined in: [src/implementation/ArmadaManager/ArmadaManagerClient.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/ArmadaManager/ArmadaManagerClient.ts#L15)

APIs for the Armada protocol

#### Implementation of

[`IArmadaManagerClient`](../interfaces/IArmadaManagerClient.md).[`users`](../interfaces/IArmadaManagerClient.md#users)
