# Interface: IArmadaManagerAdminClient

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L22)

Interface for the Armada Manager Admin client - consolidates all administrative operations

## Methods

### addArk()

```ts
addArk(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:90](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L90)

Adds an ark to the fleet. Used by the governance

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

The address of the ark to add

###### maxDepositCap

[`ITokenAmount`](ITokenAmount.md)

The maximum deposit cap of the ark

###### maxRebalanceInflow

[`ITokenAmount`](ITokenAmount.md)

The maximum rebalance inflow of the ark

###### maxRebalanceOutflow

[`ITokenAmount`](ITokenAmount.md)

The maximum rebalance outflow of the ark

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### addArks()

```ts
addArks(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:109](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L109)

Adds multiple arks to the fleet. Used by the governance

#### Parameters

##### params

###### arks

[`IAddress`](IAddress.md)[]

The addresses of the arks to add

###### maxDepositCaps

[`ITokenAmount`](ITokenAmount.md)[]

The maximum deposit caps of the arks

###### maxRebalanceInflows

[`ITokenAmount`](ITokenAmount.md)[]

The maximum rebalance inflows of the arks

###### maxRebalanceOutflows

[`ITokenAmount`](ITokenAmount.md)[]

The maximum rebalance outflows of the arks

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### arkConfig()

```ts
arkConfig(params): Promise<IArkConfig>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:248](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L248)

Gets the configuration of an ark. Used to fetch data from the blockchain

#### Parameters

##### params

###### arkAddressValue

`` `0x${string}` ``

The address of the ark

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain ID where the ark is deployed

#### Returns

`Promise`\<[`IArkConfig`](IArkConfig.md)\>

Promise<IArkConfig> The ark configuration

***

### arks()

```ts
arks(params): Promise<IAddress[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:134](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L134)

Gets the list of active arks for a fleet

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the vault

#### Returns

`Promise`\<[`IAddress`](IAddress.md)[]\>

The list of active ark addresses

***

### emergencyShutdown()

```ts
emergencyShutdown(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:238](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L238)

Shuts down the fleet in case of an emergency. Used by the governance

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### forceRebalance()

```ts
forceRebalance(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:226](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L226)

Forces a rebalance of the fleet. Used by the governance

#### Parameters

##### params

###### rebalanceData

[`IRebalanceData`](IRebalanceData.md)[]

The data for the rebalance

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### getFeeRevenueConfig()

```ts
getFeeRevenueConfig(params): Promise<IFeeRevenueConfig>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:257](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L257)

Gets the fee revenue configuration with hardcoded values per chain

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the vault

#### Returns

`Promise`\<[`IFeeRevenueConfig`](IFeeRevenueConfig.md)\>

Promise<IFeeRevenueConfig> The fee revenue configuration

***

### getVaultRaw()

```ts
getVaultRaw(params): Promise<GetVaultQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:284](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L284)

Retrieves a specific protocol vault

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

ID of the vault

#### Returns

`Promise`\<`GetVaultQuery`\>

The corresponding Armada vault

***

### getVaultsRaw()

```ts
getVaultsRaw(params): Promise<GetVaultsQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:275](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L275)

Retrieves all protocol vaults

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

Chain information

#### Returns

`Promise`\<`GetVaultsQuery`\>

All Armada vaults

***

### rebalance()

```ts
rebalance(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L31)

Rebalances the fleet using the provided rebalance data. Used by the keeper

#### Parameters

##### params

###### rebalanceData

[`IRebalanceData`](IRebalanceData.md)[]

The data for the rebalance

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### removeArk()

```ts
removeArk(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:125](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L125)

Removes an ark from the fleet. Used by the governance

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

The address of the ark to remove

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setArkDepositCap()

```ts
setArkDepositCap(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:144](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L144)

Sets the deposit cap of an ark. Used by the governance

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### cap

[`ITokenAmount`](ITokenAmount.md)

The new deposit cap

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setArkMaxDepositPercentageOfTVL()

```ts
setArkMaxDepositPercentageOfTVL(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:158](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L158)

Sets the maximum deposit percentage of TVL for an ark

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### maxDepositPercentageOfTVL

[`IPercentage`](IPercentage.md)

The new maximum deposit percentage of TVL

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the vault

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setArkMaxRebalanceInflow()

```ts
setArkMaxRebalanceInflow(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:186](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L186)

Sets the maximum rebalance inflow of an ark. Used by the governance

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### maxRebalanceInflow

[`ITokenAmount`](ITokenAmount.md)

The new maximum rebalance inflow

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setArkMaxRebalanceOutflow()

```ts
setArkMaxRebalanceOutflow(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:172](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L172)

Sets the maximum rebalance outflow of an ark. Used by the governance

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### maxRebalanceOutflow

[`ITokenAmount`](ITokenAmount.md)

The new maximum rebalance outflow

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setFleetDepositCap()

```ts
setFleetDepositCap(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L44)

Sets the deposit cap of the fleet. Used by the governance

#### Parameters

##### params

###### cap

[`ITokenAmount`](ITokenAmount.md)

The new deposit cap

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setMinimumBufferBalance()

```ts
setMinimumBufferBalance(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:200](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L200)

Sets the minimum buffer balance of an ark. Used by the governance

#### Parameters

##### params

###### minimumBufferBalance

[`ITokenAmount`](ITokenAmount.md)

The new minimum buffer balance

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setPerformanceFeeRate()

```ts
setPerformanceFeeRate(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:74](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L74)

Sets the performance fee rate of the fleet. Used by the governance

#### Parameters

##### params

###### rate

[`IPercentage`](IPercentage.md)

The new performance fee rate

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setTipJar()

```ts
setTipJar(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:54](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L54)

Sets the tip jar address of the fleet. Used by the governance

#### Parameters

##### params

###### addressValue

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setTipRate()

```ts
setTipRate(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:64](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L64)

Sets the tip rate of the fleet. Used by the governance

#### Parameters

##### params

###### rate

[`IPercentage`](IPercentage.md)

The new tip rate

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### tipRate()

```ts
tipRate(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:266](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L266)

Gets the tip rate of the fleet. Used to fetch data from the blockchain

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the vault

#### Returns

`Promise`\<`bigint`\>

Promise<bigint> The tip rate as a bigint

***

### updateRebalanceCooldown()

```ts
updateRebalanceCooldown(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:213](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L213)

Sets the rebalance cooldown of the fleet. Used by the governance

#### Parameters

##### params

###### cooldown

`number`

The new rebalance cooldown

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

The ID of the pool

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information
