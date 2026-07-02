# Function: useSDKInstiManagerHandlers()

```ts
function useSDKInstiManagerHandlers(sdk): object;
```

Defined in: [src/hooks/useSDK.ts:517](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/hooks/useSDK.ts#L517)

Admin + RWA handlers. These touch `ISDKInstiManager`-only members (`sdk.armada.admin`,
`sdk.armada.accessControl`, `sdk.rwa`) and are therefore exposed only for managed instances
created via `makeAdminSDK` / `makeInstiSdk`.

## Parameters

### sdk

[`ISDKInstiManager`](../../sdk-client/interfaces/ISDKInstiManager.md)

## Returns

`object`

### getAllRoles()

```ts
getAllRoles: (__namedParameters) => Promise<RolesResponse>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### first?

`number`

###### name?

`string`

###### owner?

`` `0x${string}` ``

###### skip?

`number`

###### targetContract?

`` `0x${string}` ``

#### Returns

`Promise`\<[`RolesResponse`](../../sdk-common/type-aliases/RolesResponse.md)\>

### getRwaCancelRoundDepositTx()

```ts
getRwaCancelRoundDepositTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`string`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### receiverAddress?

`` `0x${string}` ``

###### roundId

`bigint`

###### userAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaClaimAssetsTx()

```ts
getRwaClaimAssetsTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`string`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### receiverAddress?

`` `0x${string}` ``

###### roundId

`bigint`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaClaimSharesTx()

```ts
getRwaClaimSharesTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`string`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### receiverAddress?

`` `0x${string}` ``

###### roundId

`bigint`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaCurrentRound()

```ts
getRwaCurrentRound: (__namedParameters) => Promise<bigint>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<`bigint`\>

### getRwaDepositTx()

```ts
getRwaDepositTx: (__namedParameters) => Promise<TransactionInfo[]>;
```

#### Parameters

##### \_\_namedParameters

###### assetsAmount

`string`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)[]\>

### getRwaEmergencyRollbackRoundTx()

```ts
getRwaEmergencyRollbackRoundTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaExchangeRate()

```ts
getRwaExchangeRate: (__namedParameters) => Promise<IPrice>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`IPrice`](../../sdk-common/interfaces/IPrice.md)\>

### getRwaGrantRoleTx()

```ts
getRwaGrantRoleTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### account

`` `0x${string}` ``

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### role

[`RwaRole`](../../sdk-common/type-aliases/RwaRole.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaIsFleetTransfersEnabled()

```ts
getRwaIsFleetTransfersEnabled: (__namedParameters) => Promise<boolean>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

### getRwaIsWhitelisted()

```ts
getRwaIsWhitelisted: (__namedParameters) => Promise<boolean>;
```

#### Parameters

##### \_\_namedParameters

###### accountAddress

`` `0x${string}` ``

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

### getRwaIsWhitelistOpen()

```ts
getRwaIsWhitelistOpen: (__namedParameters) => Promise<boolean>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

### getRwaNextRoundTx()

```ts
getRwaNextRoundTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaReceiptBalances()

```ts
getRwaReceiptBalances: (__namedParameters) => Promise<object[]>;
```

#### Parameters

##### \_\_namedParameters

###### accountAddress

`` `0x${string}` ``

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<`object`[]\>

### getRwaRetryRoundTx()

```ts
getRwaRetryRoundTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaRevokeRoleTx()

```ts
getRwaRevokeRoleTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### account

`` `0x${string}` ``

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### role

[`RwaRole`](../../sdk-common/type-aliases/RwaRole.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaRoundState()

```ts
getRwaRoundState: (__namedParameters) => Promise<RoundState>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`RoundState`](../../sdk-common/enumerations/RoundState.md)\>

### getRwaSetFleetTransferabilityTx()

```ts
getRwaSetFleetTransferabilityTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaSetMinimumPositionSizeTx()

```ts
getRwaSetMinimumPositionSizeTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### minimumPositionSize

`string`

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaSetRoundSettledBatchTx()

```ts
getRwaSetRoundSettledBatchTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundIds

`bigint`[]

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaSetRoundSettledTx()

```ts
getRwaSetRoundSettledTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### roundId

`bigint`

###### vaultType

[`RoundsVaultType`](../../sdk-common/enumerations/RoundsVaultType.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaSetWhitelistedBatchTx()

```ts
getRwaSetWhitelistedBatchTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### accountAddresses

`` `0x${string}` ``[]

###### allowed

`boolean`[]

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaSetWhitelistedTx()

```ts
getRwaSetWhitelistedTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### accountAddress

`` `0x${string}` ``

###### allowed

`boolean`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaSetWhitelistOpenTx()

```ts
getRwaSetWhitelistOpenTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### isOpen

`boolean`

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getRwaUserVaultExposure()

```ts
getRwaUserVaultExposure: (__namedParameters) => Promise<IRwaUserVaultExposure>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`IRwaUserVaultExposure`](../../sdk-common/interfaces/IRwaUserVaultExposure.md)\>

### getRwaVaultMarketValue()

```ts
getRwaVaultMarketValue: (__namedParameters) => Promise<IRwaVaultMarketValue>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`IRwaVaultMarketValue`](../../sdk-common/interfaces/IRwaVaultMarketValue.md)\>

### getRwaWithdrawTx()

```ts
getRwaWithdrawTx: (__namedParameters) => Promise<TransactionInfo[]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddress

`` `0x${string}` ``

###### sharesAmount

`string`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)[]\>

### getTipRate()

```ts
getTipRate: (__namedParameters) => Promise<bigint>;
```

#### Parameters

##### \_\_namedParameters

###### vaultId

[`IArmadaVaultId`](../../sdk-common/interfaces/IArmadaVaultId.md)

#### Returns

`Promise`\<`bigint`\>

### grantContractSpecificRole()

```ts
grantContractSpecificRole: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### contractAddress

`string`

###### role

[`InstiContractRoles`](../../sdk-common/enumerations/InstiContractRoles.md)

###### targetAddress

`string`

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### isWhitelisted()

```ts
isWhitelisted: (__namedParameters) => Promise<boolean>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetCommanderAddress

`` `0x${string}` ``

###### targetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

### isWhitelistedAQ()

```ts
isWhitelistedAQ: (__namedParameters) => Promise<boolean>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### targetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

### revokeContractSpecificRole()

```ts
revokeContractSpecificRole: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### contractAddress

`string`

###### role

[`InstiContractRoles`](../../sdk-common/enumerations/InstiContractRoles.md)

###### targetAddress

`string`

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setArkDepositCap()

```ts
setArkDepositCap: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### arkAddress

`string`

###### cap

`string`

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### token

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setArkMaxDepositPercentageOfTVL()

```ts
setArkMaxDepositPercentageOfTVL: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### arkAddress

`string`

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### maxDepositPercentage

`number`

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setFleetDepositCap()

```ts
setFleetDepositCap: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### cap

`string`

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### token

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setMinimumBufferBalance()

```ts
setMinimumBufferBalance: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### minimumBufferBalance

`string`

###### token

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setPerformanceFeeRate()

```ts
setPerformanceFeeRate: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### rate

`number`

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setTipRate()

```ts
setTipRate: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### rate

`number`

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setWhitelistedAQTx()

```ts
setWhitelistedAQTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### allowed

`boolean`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### targetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setWhitelistedBatchAQTx()

```ts
setWhitelistedBatchAQTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### allowed

`boolean`[]

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### targetAddresses

`` `0x${string}` ``[]

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setWhitelistedBatchTx()

```ts
setWhitelistedBatchTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### allowed

`boolean`[]

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetCommanderAddress

`` `0x${string}` ``

###### targetAddresses

`` `0x${string}` ``[]

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### setWhitelistedTx()

```ts
setWhitelistedTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### allowed

`boolean`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetCommanderAddress

`` `0x${string}` ``

###### targetAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>
