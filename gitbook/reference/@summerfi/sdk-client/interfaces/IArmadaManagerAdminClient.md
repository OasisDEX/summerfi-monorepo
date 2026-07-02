# Interface: IArmadaManagerAdminClient

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L23)

## Name

IArmadaManagerAdminClient

## Description

Interface for the Armada Manager Admin client - consolidates all administrative operations

## Methods

### addArk()

```ts
addArk(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:97](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L97)

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

#### Name

addArk

#### Description

Adds an ark to the fleet. Used by the governance

***

### addArks()

```ts
addArks(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:117](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L117)

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

#### Name

addArks

#### Description

Adds multiple arks to the fleet. Used by the governance

***

### arkConfig()

```ts
arkConfig(params): Promise<IArkConfig>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:272](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L272)

#### Parameters

##### params

###### arkAddressValue

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

#### Returns

`Promise`\<[`IArkConfig`](IArkConfig.md)\>

Promise<IArkConfig> The ark configuration

#### Name

arkConfig

#### Description

Gets the configuration of an ark. Used to fetch data from the blockchain

***

### arks()

```ts
arks(params): Promise<IAddress[]>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:144](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L144)

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`IAddress`](IAddress.md)[]\>

The list of active ark addresses

#### Name

arks

#### Description

Gets the list of active arks for a fleet

***

### emergencyShutdown()

```ts
emergencyShutdown(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:261](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L261)

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

emergencyShutdown

#### Description

Shuts down the fleet in case of an emergency. Used by the governance

***

### forceRebalance()

```ts
forceRebalance(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:248](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L248)

#### Parameters

##### params

###### rebalanceData

[`IRebalanceData`](IRebalanceData.md)[]

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

forceRebalance

#### Description

Forces a rebalance of the fleet. Used by the governance

***

### getFeeRevenueConfig()

```ts
getFeeRevenueConfig(params): Promise<IFeeRevenueConfig>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:282](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L282)

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`IFeeRevenueConfig`](IFeeRevenueConfig.md)\>

Promise<IFeeRevenueConfig> The fee revenue configuration

#### Name

getFeeRevenueConfig

#### Description

Gets the fee revenue configuration with hardcoded values per chain

***

### getVaultRaw()

```ts
getVaultRaw(params): Promise<GetVaultQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:312](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L312)

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<`GetVaultQuery`\>

The corresponding Armada vault

#### Method

getVaultRaw

#### Description

Retrieves a specific protocol vault

***

### getVaultsRaw()

```ts
getVaultsRaw(params): Promise<GetVaultsQuery>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:302](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L302)

#### Parameters

##### params

###### chainInfo

[`IChainInfo`](IChainInfo.md)

#### Returns

`Promise`\<`GetVaultsQuery`\>

All Armada vaults

#### Method

getVaultsRaw

#### Description

Retrieves all protocol vaults

***

### rebalance()

```ts
rebalance(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L33)

#### Parameters

##### params

###### rebalanceData

[`IRebalanceData`](IRebalanceData.md)[]

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

rebalance

#### Description

Rebalances the fleet using the provided rebalance data. Used by the keeper

***

### removeArk()

```ts
removeArk(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:134](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L134)

#### Parameters

##### params

###### ark

[`IAddress`](IAddress.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

removeArk

#### Description

Removes an ark from the fleet. Used by the governance

***

### setArkDepositCap()

```ts
setArkDepositCap(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:156](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L156)

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

#### Name

setArkDepositCap

#### Description

Sets the deposit cap of an ark. Used by the governance

***

### setArkMaxDepositPercentageOfTVL()

```ts
setArkMaxDepositPercentageOfTVL(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:172](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L172)

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

#### Name

setArkMaxDepositPercentageOfTVL

#### Description

Sets the maximum deposit percentage of TVL for an ark

***

### setArkMaxRebalanceInflow()

```ts
setArkMaxRebalanceInflow(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:204](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L204)

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

#### Name

setArkMaxRebalanceInflow

#### Description

Sets the maximum rebalance inflow of an ark. Used by the governance

***

### setArkMaxRebalanceOutflow()

```ts
setArkMaxRebalanceOutflow(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:188](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L188)

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

#### Name

setArkMaxRebalanceOutflow

#### Description

Sets the maximum rebalance outflow of an ark. Used by the governance

***

### setFleetDepositCap()

```ts
setFleetDepositCap(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:47](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L47)

#### Parameters

##### params

###### cap

[`ITokenAmount`](ITokenAmount.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

setFleetDepositCap

#### Description

Sets the deposit cap of the fleet. Used by the governance

***

### setMinimumBufferBalance()

```ts
setMinimumBufferBalance(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:220](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L220)

#### Parameters

##### params

###### minimumBufferBalance

[`ITokenAmount`](ITokenAmount.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

setArkMinimumBufferBalance

#### Description

Sets the minimum buffer balance of an ark. Used by the governance

***

### setPerformanceFeeRate()

```ts
setPerformanceFeeRate(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:80](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L80)

#### Parameters

##### params

###### rate

[`IPercentage`](IPercentage.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

setPerformanceFeeRate

#### Description

Sets the performance fee rate of the fleet. Used by the governance

***

### setTipJar()

```ts
setTipJar(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:58](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L58)

#### Parameters

##### params

###### addressValue

`` `0x${string}` ``

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

setTipJar

#### Description

Sets the tip jar address of the fleet. Used by the governance

***

### setTipRate()

```ts
setTipRate(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:69](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L69)

#### Parameters

##### params

###### rate

[`IPercentage`](IPercentage.md)

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

setTipRate

#### Description

Sets the tip rate of the fleet. Used by the governance

***

### tipRate()

```ts
tipRate(params): Promise<bigint>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:292](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L292)

#### Parameters

##### params

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<`bigint`\>

Promise<bigint> The tip rate as a bigint

#### Name

tipRate

#### Description

Gets the tip rate of the fleet. Used to fetch data from the blockchain

***

### updateRebalanceCooldown()

```ts
updateRebalanceCooldown(params): Promise<TransactionInfo>;
```

Defined in: [src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts:234](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ArmadaManager/IArmadaManagerAdminClient.ts#L234)

#### Parameters

##### params

###### cooldown

`number`

###### vaultId

[`IArmadaVaultId`](IArmadaVaultId.md)

#### Returns

`Promise`\<[`TransactionInfo`](TransactionInfo.md)\>

The transaction information

#### Name

setRebalanceCooldown

#### Description

Sets the rebalance cooldown of the fleet. Used by the governance
