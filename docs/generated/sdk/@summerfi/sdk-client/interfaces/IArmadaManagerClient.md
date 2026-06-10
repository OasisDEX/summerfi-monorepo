# Interface: IArmadaManagerClient

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IArmadaManagerClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IArmadaManagerClient.ts#L10)

IArmadaManagerClient

## Description

Interface of the FleetCommander manager for the SDK Client. Allows to instantiate
             FleetCommanders to interact with them

## Properties

### accessControl

```ts
accessControl: IArmadaManagerClientAccessControl;
```

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IArmadaManagerClient.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IArmadaManagerClient.ts#L16)

Access Control API for the Armada protocol - role-based access control operations

***

### admin

```ts
admin: IArmadaManagerAdminClient;
```

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IArmadaManagerClient.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IArmadaManagerClient.ts#L14)

Admin API for the Armada protocol - consolidated administrative operations

***

### users

```ts
users: IArmadaManagerUsersClient;
```

Defined in: [sdk/sdk-client/src/interfaces/ArmadaManager/IArmadaManagerClient.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/ArmadaManager/IArmadaManagerClient.ts#L12)

Users API for the Armada protocol
