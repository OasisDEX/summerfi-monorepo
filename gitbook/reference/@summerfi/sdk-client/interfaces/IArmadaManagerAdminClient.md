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

###### maxDepositCap

[`ITokenAmount`](ITokenAmount.md)

###### maxRebalanceInflow

[`ITokenAmount`](ITokenAmount.md)

###### maxRebalanceOutflow

[`ITokenAmount`](ITokenAmount.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

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

###### maxDepositCaps

[`ITokenAmount`](ITokenAmount.md)[]

###### maxRebalanceInflows

[`ITokenAmount`](ITokenAmount.md)[]

###### maxRebalanceOutflows

[`ITokenAmount`](ITokenAmount.md)[]

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### arkConfig()

```ts
arkConfig(params): Promise<IArkConfig>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:253](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L253)

Gets the configuration of an ark. Used to fetch data from the blockchain

#### Parameters

##### params

###### arkAddressValue

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

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

#### Returns

`Promise`\<[`IAddress`](IAddress.md)[]\>

The list of active ark addresses

***

### emergencyShutdown()

```ts
emergencyShutdown(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:243](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L243)

Shuts down the fleet in case of an emergency. Used by the governance

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### forceRebalance()

```ts
forceRebalance(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:231](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L231)

Forces a rebalance of the fleet. Used by the governance

#### Parameters

##### params

###### rebalanceData

[`IRebalanceData`](IRebalanceData.md)[]

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### getFeeRevenueConfig()

```ts
getFeeRevenueConfig(params): Promise<IFeeRevenueConfig>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:262](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L262)

Gets the fee revenue configuration with hardcoded values per chain

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`IFeeRevenueConfig`](IFeeRevenueConfig.md)\>

Promise<IFeeRevenueConfig> The fee revenue configuration

***

### getVaultRaw()

```ts
getVaultRaw(params): Promise<GetVaultQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:289](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L289)

Retrieves a specific protocol vault

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<`GetVaultQuery`\>

The corresponding Armada vault

***

### getVaultsRaw()

```ts
getVaultsRaw(params): Promise<GetVaultsQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:280](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L280)

Retrieves all protocol vaults

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

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

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

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

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setArkDepositCap()

```ts
setArkDepositCap(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:145](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L145)

Sets the deposit cap of an ark. Used by the governance

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### cap

[`ITokenAmount`](ITokenAmount.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setArkMaxDepositPercentageOfTVL()

```ts
setArkMaxDepositPercentageOfTVL(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:160](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L160)

Sets the maximum deposit percentage of TVL for an ark

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### maxDepositPercentageOfTVL

[`IPercentage`](IPercentage.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setArkMaxRebalanceInflow()

```ts
setArkMaxRebalanceInflow(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:190](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L190)

Sets the maximum rebalance inflow of an ark. Used by the governance

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### maxRebalanceInflow

[`ITokenAmount`](ITokenAmount.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setArkMaxRebalanceOutflow()

```ts
setArkMaxRebalanceOutflow(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:175](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L175)

Sets the maximum rebalance outflow of an ark. Used by the governance

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### maxRebalanceOutflow

[`ITokenAmount`](ITokenAmount.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

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

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### setMinimumBufferBalance()

```ts
setMinimumBufferBalance(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:205](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L205)

Sets the minimum buffer balance of an ark. Used by the governance

#### Parameters

##### params

###### minimumBufferBalance

[`ITokenAmount`](ITokenAmount.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

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

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

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

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

***

### tipRate()

```ts
tipRate(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:271](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L271)

Gets the tip rate of the fleet. Used to fetch data from the blockchain

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<`bigint`\>

Promise<bigint> The tip rate as a bigint

***

### updateRebalanceCooldown()

```ts
updateRebalanceCooldown(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:218](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L218)

Sets the rebalance cooldown of the fleet. Used by the governance

#### Parameters

##### params

###### cooldown

`number`

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information
