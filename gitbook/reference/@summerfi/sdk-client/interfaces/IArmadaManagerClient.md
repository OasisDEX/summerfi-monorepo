# Interface: IArmadaManagerClient

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClient.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClient.ts#L9)

Interface of the FleetCommander manager for the SDK Client. Allows to instantiate
FleetCommanders to interact with them

## Properties

### accessControl

```ts
accessControl: IArmadaManagerClientAccessControl;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClient.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClient.ts#L15)

Access Control API for the Armada protocol - role-based access control operations

***

### admin

```ts
admin: IArmadaManagerAdminClient;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClient.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClient.ts#L13)

Admin API for the Armada protocol - consolidated administrative operations

***

### users

```ts
users: IArmadaManagerUsersClient;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerClient.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerClient.ts#L11)

Users API for the Armada protocol
