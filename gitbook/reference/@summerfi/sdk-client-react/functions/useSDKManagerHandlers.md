# Function: useSDKManagerHandlers()

```ts
function useSDKManagerHandlers(sdk, __namedParameters): object;
```

Defined in: [src/hooks/useSDK.ts:153](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/hooks/useSDK.ts#L153)

Handlers available on every SDK instance — both the public `makeSDK` instance and the managed
(`makeAdminSDK` / `makeInstiSdk`) instances. These only touch `ISDKManager` members, so an
`ISDKInstiManager` (a structural superset) satisfies the parameter too.

## Parameters

### sdk

[`ISDKManager`](../../sdk-client/interfaces/ISDKManager.md)

### \_\_namedParameters

[`SdkStateParams`](../type-aliases/SdkStateParams.md)

## Returns

`object`

### authorizeStakingRewardsCallerV2()

```ts
authorizeStakingRewardsCallerV2: (__namedParameters) => Promise<[ClaimTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### authorizedCallerAddress?

`` `0x${string}` ``

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### isAuthorized

`boolean`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`ClaimTransactionInfo`](../../sdk-common/type-aliases/ClaimTransactionInfo.md)\]\>

### cancelStrategyTx()

```ts
cancelStrategyTx: (__namedParameters) => Promise<[CancelDcaStrategyTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### strategy

[`IDcaStrategy`](../../sdk-common/interfaces/IDcaStrategy.md)

#### Returns

`Promise`\<\[[`CancelDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/CancelDcaStrategyTransactionInfo.md)\]\>

### createStrategyTx()

```ts
createStrategyTx: (__namedParameters) => Promise<
  | [Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]
| [Permit2AuthorizationTransactionInfo, Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amountShares

`string`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### deadlineUnixTimestamp

`number`

###### fromVault

`` `0x${string}` ``

###### inAsset

`` `0x${string}` ``

###### inAssetFeed

[`IChainlinkFeed`](../../sdk-common/interfaces/IChainlinkFeed.md)

###### intervalSeconds

`number`

###### maxTrades

`number`

###### neverBuyAbove?

`string`

###### neverSellBelow?

`string`

###### outAsset

`` `0x${string}` ``

###### outAssetFeed

[`IChainlinkFeed`](../../sdk-common/interfaces/IChainlinkFeed.md)

###### slippagePercentage

`string`

###### toVault

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<
  \| \[[`Permit2SubAllowanceTransactionInfo`](../../sdk-common/type-aliases/Permit2SubAllowanceTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../../sdk-common/type-aliases/Permit2AuthorizationTransactionInfo.md), [`Permit2SubAllowanceTransactionInfo`](../../sdk-common/type-aliases/Permit2SubAllowanceTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/CreateDcaStrategyTransactionInfo.md)\]\>

### depositAndCreateStrategyTx()

```ts
depositAndCreateStrategyTx: (__namedParameters) => Promise<
  | [Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]
  | [Permit2AuthorizationTransactionInfo, Permit2SubAllowanceTransactionInfo, CreateDcaStrategyTransactionInfo]
  | [Permit2SubAllowanceTransactionInfo, ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]
| [Permit2AuthorizationTransactionInfo, Permit2SubAllowanceTransactionInfo, ApproveTransactionInfo, CreateDcaStrategyTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amountShares

`string`

###### assetAmount

`string`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### deadlineUnixTimestamp

`number`

###### fromVault

`` `0x${string}` ``

###### inAsset

`` `0x${string}` ``

###### inAssetFeed

[`IChainlinkFeed`](../../sdk-common/interfaces/IChainlinkFeed.md)

###### intervalSeconds

`number`

###### maxTrades

`number`

###### neverBuyAbove?

`string`

###### neverSellBelow?

`string`

###### outAsset

`` `0x${string}` ``

###### outAssetFeed

[`IChainlinkFeed`](../../sdk-common/interfaces/IChainlinkFeed.md)

###### slippagePercentage

`string`

###### toVault

`` `0x${string}` ``

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<
  \| \[[`Permit2SubAllowanceTransactionInfo`](../../sdk-common/type-aliases/Permit2SubAllowanceTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../../sdk-common/type-aliases/Permit2AuthorizationTransactionInfo.md), [`Permit2SubAllowanceTransactionInfo`](../../sdk-common/type-aliases/Permit2SubAllowanceTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2SubAllowanceTransactionInfo`](../../sdk-common/type-aliases/Permit2SubAllowanceTransactionInfo.md), [`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/CreateDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../../sdk-common/type-aliases/Permit2AuthorizationTransactionInfo.md), [`Permit2SubAllowanceTransactionInfo`](../../sdk-common/type-aliases/Permit2SubAllowanceTransactionInfo.md), [`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`CreateDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/CreateDcaStrategyTransactionInfo.md)\]\>

### editStrategyTx()

```ts
editStrategyTx: (__namedParameters) => Promise<
  | [EditDcaStrategyTransactionInfo]
  | [Permit2SubAllowanceTransactionInfo, EditDcaStrategyTransactionInfo]
  | [Permit2AuthorizationTransactionInfo, EditDcaStrategyTransactionInfo]
| [Permit2AuthorizationTransactionInfo, Permit2SubAllowanceTransactionInfo, EditDcaStrategyTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### strategy

[`IDcaStrategy`](../../sdk-common/interfaces/IDcaStrategy.md)

###### update

[`IDcaStrategyUpdate`](../../sdk-common/type-aliases/IDcaStrategyUpdate.md)

#### Returns

`Promise`\<
  \| \[[`EditDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/EditDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2SubAllowanceTransactionInfo`](../../sdk-common/type-aliases/Permit2SubAllowanceTransactionInfo.md), [`EditDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/EditDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../../sdk-common/type-aliases/Permit2AuthorizationTransactionInfo.md), [`EditDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/EditDcaStrategyTransactionInfo.md)\]
  \| \[[`Permit2AuthorizationTransactionInfo`](../../sdk-common/type-aliases/Permit2AuthorizationTransactionInfo.md), [`Permit2SubAllowanceTransactionInfo`](../../sdk-common/type-aliases/Permit2SubAllowanceTransactionInfo.md), [`EditDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/EditDcaStrategyTransactionInfo.md)\]\>

### getAddresses()

```ts
getAddresses: (__namedParameters) => Promise<Record<"admiralsQuarters", `0x${string}`>>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

#### Returns

`Promise`\<`Record`\<`"admiralsQuarters"`, `` `0x${string}` ``\>\>

### getAggregatedClaimsForChainTx()

```ts
getAggregatedClaimsForChainTx: (__namedParameters) => Promise<
  | [ClaimTransactionInfo]
| undefined>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### includeMerkl?

`boolean`

###### includeStakingV2?

`boolean` = `true`

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<
  \| \[[`ClaimTransactionInfo`](../../sdk-common/type-aliases/ClaimTransactionInfo.md)\]
  \| `undefined`\>

### getAggregatedRewards()

```ts
getAggregatedRewards: (__namedParameters) => Promise<{
  distribution: bigint;
  perChain: Record<number, bigint>;
  stakingV2: bigint;
  total: bigint;
  vaultUsage: bigint;
  vaultUsagePerChain: Record<number, bigint>;
  voteDelegation: bigint;
}>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

`number`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\{
  `distribution`: `bigint`;
  `perChain`: `Record`\<`number`, `bigint`\>;
  `stakingV2`: `bigint`;
  `total`: `bigint`;
  `vaultUsage`: `bigint`;
  `vaultUsagePerChain`: `Record`\<`number`, `bigint`\>;
  `voteDelegation`: `bigint`;
\}\>

### getAggregatedRewardsIncludingMerkl()

```ts
getAggregatedRewardsIncludingMerkl: (__namedParameters) => Promise<{
  distribution: bigint;
  perChain: Record<number, bigint>;
  stakingV2: bigint;
  total: bigint;
  vaultUsage: bigint;
  vaultUsagePerChain: Record<number, bigint>;
  voteDelegation: bigint;
}>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

`number`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\{
  `distribution`: `bigint`;
  `perChain`: `Record`\<`number`, `bigint`\>;
  `stakingV2`: `bigint`;
  `total`: `bigint`;
  `vaultUsage`: `bigint`;
  `vaultUsagePerChain`: `Record`\<`number`, `bigint`\>;
  `voteDelegation`: `bigint`;
\}\>

### getAuthorizeAsMerklRewardsOperatorTx()

```ts
getAuthorizeAsMerklRewardsOperatorTx: (__namedParameters) => Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`ChainInfo`](../../sdk-common/classes/ChainInfo.md)

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<\[[`ToggleAQasMerklRewardsOperatorTransactionInfo`](../../sdk-common/type-aliases/ToggleAQasMerklRewardsOperatorTransactionInfo.md)\]\>

### getBridgeTx()

```ts
getBridgeTx: (__namedParameters) => Promise<BridgeTransactionInfo[]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### recipient

[`IAddress`](../../sdk-common/interfaces/IAddress.md)

###### sourceChain

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### targetChain

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<[`BridgeTransactionInfo`](../../sdk-common/type-aliases/BridgeTransactionInfo.md)[]\>

### getCalculatePenaltyAmount()

```ts
getCalculatePenaltyAmount: (__namedParameters) => Promise<bigint[]>;
```

#### Parameters

##### \_\_namedParameters

###### amounts?

`bigint`[]

###### userStakes

[`UserStakeV2`](../../sdk-client/interfaces/UserStakeV2.md)[]

#### Returns

`Promise`\<`bigint`[]\>

### getCalculatePenaltyPercentage()

```ts
getCalculatePenaltyPercentage: (__namedParameters) => Promise<IPercentage[]>;
```

#### Parameters

##### \_\_namedParameters

###### userStakes

[`UserStakeV2`](../../sdk-client/interfaces/UserStakeV2.md)[]

#### Returns

`Promise`\<[`IPercentage`](../../sdk-common/interfaces/IPercentage.md)[]\>

### getChain()

```ts
getChain: (__namedParameters) => Promise<Chain>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

`number`

#### Returns

`Promise`\<[`Chain`](../../sdk-client/classes/Chain.md)\>

### getChainInfo()

```ts
getChainInfo: () => ChainInfo;
```

#### Returns

[`ChainInfo`](../../sdk-common/classes/ChainInfo.md)

### getClaimStakingV2UserRewardsTx()

```ts
getClaimStakingV2UserRewardsTx: (__namedParameters) => Promise<[ClaimTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### address

`` `0x${string}` ``

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

#### Returns

`Promise`\<\[[`ClaimTransactionInfo`](../../sdk-common/type-aliases/ClaimTransactionInfo.md)\]\>

### getCrossChainDepositTx()

```ts
getCrossChainDepositTx: (__namedParameters) => Promise<
  | [DepositTransactionInfo]
| [ApproveTransactionInfo, DepositTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### fromChainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### receiverAddressValue?

`` `0x${string}` ``

###### senderAddressValue

`` `0x${string}` ``

###### slippage

[`IPercentage`](../../sdk-common/interfaces/IPercentage.md)

###### vaultId

[`IArmadaVaultId`](../../sdk-common/interfaces/IArmadaVaultId.md)

#### Returns

`Promise`\<
  \| \[[`DepositTransactionInfo`](../../sdk-common/type-aliases/DepositTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`DepositTransactionInfo`](../../sdk-common/type-aliases/DepositTransactionInfo.md)\]\>

### getCrossChainWithdrawTx()

```ts
getCrossChainWithdrawTx: (__namedParameters) => Promise<
  | [WithdrawTransactionInfo]
| [ApproveTransactionInfo, WithdrawTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### slippage

[`IPercentage`](../../sdk-common/interfaces/IPercentage.md)

###### toChainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

###### vaultId

[`IArmadaVaultId`](../../sdk-common/interfaces/IArmadaVaultId.md)

#### Returns

`Promise`\<
  \| \[[`WithdrawTransactionInfo`](../../sdk-common/type-aliases/WithdrawTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`WithdrawTransactionInfo`](../../sdk-common/type-aliases/WithdrawTransactionInfo.md)\]\>

### getCurrentUser()

```ts
getCurrentUser: () => User;
```

#### Returns

[`User`](../../sdk-common/classes/User.md)

### getDelegateTx()

```ts
getDelegateTx: (__namedParameters) => Promise<[DelegateTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<\[[`DelegateTransactionInfo`](../../sdk-common/type-aliases/DelegateTransactionInfo.md)\]\>

### getDelegateTxV2()

```ts
getDelegateTxV2: (__namedParameters) => Promise<[DelegateTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### delegateeAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`DelegateTransactionInfo`](../../sdk-common/type-aliases/DelegateTransactionInfo.md)\]\>

### getDeposits()

```ts
getDeposits: (__namedParameters) => Promise<Readonly<{
  amount: ITokenAmount;
  amountUsd: IFiatCurrencyAmount;
  from: `0x${string}`;
  timestamp: number;
  to: `0x${string}`;
  txHash: `0x${string}`;
  vaultBalance: ITokenAmount;
  vaultBalanceUsd: IFiatCurrencyAmount;
}>[]>;
```

#### Parameters

##### \_\_namedParameters

###### first?

`number`

###### positionId

[`IArmadaPositionId`](../../sdk-common/interfaces/IArmadaPositionId.md)

###### skip?

`number`

#### Returns

`Promise`\<`Readonly`\<\{
  `amount`: [`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md);
  `amountUsd`: [`IFiatCurrencyAmount`](../../sdk-common/interfaces/IFiatCurrencyAmount.md);
  `from`: `` `0x${string}` ``;
  `timestamp`: `number`;
  `to`: `` `0x${string}` ``;
  `txHash`: `` `0x${string}` ``;
  `vaultBalance`: [`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md);
  `vaultBalanceUsd`: [`IFiatCurrencyAmount`](../../sdk-common/interfaces/IFiatCurrencyAmount.md);
\}\>[]\>

### getDepositTx()

```ts
getDepositTx: (__namedParameters) => Promise<
  | [DepositTransactionInfo]
| [ApproveTransactionInfo, DepositTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### referralCode?

`string`

###### shouldStake?

`boolean`

###### slippage

`number`

###### walletAddress

[`IAddress`](../../sdk-common/interfaces/IAddress.md)

#### Returns

`Promise`\<
  \| \[[`DepositTransactionInfo`](../../sdk-common/type-aliases/DepositTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`DepositTransactionInfo`](../../sdk-common/type-aliases/DepositTransactionInfo.md)\]\>

### getIntentSwapsCancelOrder()

```ts
getIntentSwapsCancelOrder: (__namedParameters) => Promise<{
  result: string;
}>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### orderId

`string`

###### publicClient

\{
\}

###### walletClient

\{
\}

#### Returns

`Promise`\<\{
  `result`: `string`;
\}\>

### getIntentSwapsCheckOrder()

```ts
getIntentSwapsCheckOrder: (__namedParameters) => Promise<
  | {
  order: EnrichedOrder;
}
| null>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### orderId

`string`

#### Returns

`Promise`\<
  \| \{
  `order`: `EnrichedOrder`;
\}
  \| `null`\>

### getIntentSwapsIsPermit2AuthorizationNeeded()

```ts
getIntentSwapsIsPermit2AuthorizationNeeded: (__namedParameters) => Promise<boolean>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`bigint`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### ownerAddress

`` `0x${string}` ``

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

### getIntentSwapsPermit2AuthorizationTx()

```ts
getIntentSwapsPermit2AuthorizationTx: (__namedParameters) => Promise<[Permit2AuthorizationTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`Permit2AuthorizationTransactionInfo`](../../sdk-common/type-aliases/Permit2AuthorizationTransactionInfo.md)\]\>

### getIntentSwapsPermit2RevokeTx()

```ts
getIntentSwapsPermit2RevokeTx: (__namedParameters) => Promise<[Permit2RevokeTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`Permit2RevokeTransactionInfo`](../../sdk-common/type-aliases/Permit2RevokeTransactionInfo.md)\]\>

### getIntentSwapsSellOrderQuote()

```ts
getIntentSwapsSellOrderQuote: (__namedParameters) => Promise<IntentQuoteData>;
```

#### Parameters

##### \_\_namedParameters

###### fromAmount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### limitPrice?

`string`

###### partiallyFillable?

`boolean`

###### receiver?

`` `0x${string}` ``

###### sender

`` `0x${string}` ``

###### slippagePercentage?

`number`

###### toToken

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)

#### Returns

`Promise`\<[`IntentQuoteData`](../../sdk-common/type-aliases/IntentQuoteData.md)\>

### getIntentSwapsSendDepositOrder()

```ts
getIntentSwapsSendDepositOrder: (__namedParameters) => Promise<{
  orderId: string;
  status: "order_sent";
}>;
```

#### Parameters

##### \_\_namedParameters

###### apiKey?

`string`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### fleetAddressValue

`` `0x${string}` ``

###### fromAmount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### limitPrice

[`IPrice`](../../sdk-common/interfaces/IPrice.md)

###### order

`UnsignedOrder`

###### publicClient

\{
\}

###### referralCode?

`` `0x${string}` `` = `'0x'`

###### sender

`` `0x${string}` ``

###### signTypedData

(`params`) => `Promise`\<`` `0x${string}` ``\>

###### slippagePercentage

`number`

###### toAmount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### walletClient

\{
\}

#### Returns

`Promise`\<\{
  `orderId`: `string`;
  `status`: `"order_sent"`;
\}\>

### getMigratablePositions()

```ts
getMigratablePositions: (__namedParameters) => Promise<{
  chainInfo: IChainInfo;
  positions: ArmadaMigratablePosition[];
}>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### walletAddress

`string`

#### Returns

`Promise`\<\{
  `chainInfo`: [`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md);
  `positions`: [`ArmadaMigratablePosition`](../../sdk-common/type-aliases/ArmadaMigratablePosition.md)[];
\}\>

### getMigratablePositionsApy()

```ts
getMigratablePositionsApy: (__namedParameters) => Promise<{
  apyByPositionId: Record<string, ArmadaMigratablePositionApy>;
  chainInfo: IChainInfo;
}>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### positionIds

`` `0x${string}` ``[]

#### Returns

`Promise`\<\{
  `apyByPositionId`: `Record`\<`string`, [`ArmadaMigratablePositionApy`](../../sdk-common/type-aliases/ArmadaMigratablePositionApy.md)\>;
  `chainInfo`: [`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md);
\}\>

### getMigrateTx()

```ts
getMigrateTx: (__namedParameters) => Promise<
  | [ApproveTransactionInfo[], MigrationTransactionInfo]
| [MigrationTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### positionIds

`` `0x${string}` ``[]

###### shouldStake?

`boolean`

###### slippage

`number`

###### walletAddress

`string`

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md)[], [`MigrationTransactionInfo`](../../sdk-common/type-aliases/MigrationTransactionInfo.md)\]
  \| \[[`MigrationTransactionInfo`](../../sdk-common/type-aliases/MigrationTransactionInfo.md)\]\>

### getPermit2AuthorizationTx()

```ts
getPermit2AuthorizationTx: (__namedParameters) => Promise<[Permit2AuthorizationTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`Permit2AuthorizationTransactionInfo`](../../sdk-common/type-aliases/Permit2AuthorizationTransactionInfo.md)\]\>

### getPermit2RevokeTx()

```ts
getPermit2RevokeTx: (__namedParameters) => Promise<[Permit2RevokeTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`Permit2RevokeTransactionInfo`](../../sdk-common/type-aliases/Permit2RevokeTransactionInfo.md)\]\>

### getPositionHistory()

```ts
getPositionHistory: (__namedParameters) => Promise<GetPositionHistoryQuery>;
```

#### Parameters

##### \_\_namedParameters

###### positionId

[`IArmadaPositionId`](../../sdk-common/interfaces/IArmadaPositionId.md)

#### Returns

`Promise`\<`GetPositionHistoryQuery`\>

### getProtocolRevenue()

```ts
getProtocolRevenue: () => Promise<number>;
```

#### Returns

`Promise`\<`number`\>

### getProtocolTvl()

```ts
getProtocolTvl: () => Promise<number>;
```

#### Returns

`Promise`\<`number`\>

### getReferralFeesMerklClaimTx()

```ts
getReferralFeesMerklClaimTx: (__namedParameters) => Promise<
  | [MerklClaimTransactionInfo]
| undefined>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### rewardsTokensAddresses

`` `0x${string}` ``[]

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<
  \| \[[`MerklClaimTransactionInfo`](../../sdk-common/type-aliases/MerklClaimTransactionInfo.md)\]
  \| `undefined`\>

### getSpotPrice()

```ts
getSpotPrice: (__namedParameters) => Promise<ISpotPriceInfo>;
```

#### Parameters

##### \_\_namedParameters

###### baseToken

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)

###### denomination?

[`Denomination`](../../sdk-common/type-aliases/Denomination.md)

#### Returns

`Promise`\<[`ISpotPriceInfo`](../../sdk-common/type-aliases/ISpotPriceInfo.md)\>

### getSpotPrices()

```ts
getSpotPrices: (__namedParameters) => Promise<SpotPricesInfo>;
```

#### Parameters

##### \_\_namedParameters

###### baseTokens

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)[]

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### quoteCurrency?

[`FiatCurrency`](../../sdk-common/enumerations/FiatCurrency.md)

#### Returns

`Promise`\<[`SpotPricesInfo`](../../sdk-common/type-aliases/SpotPricesInfo.md)\>

### getStakedBalance()

```ts
getStakedBalance: (__namedParameters) => Promise<{
  assets: ITokenAmount;
  shares: ITokenAmount;
}>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<\{
  `assets`: [`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md);
  `shares`: [`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md);
\}\>

### getStakeOnBehalfTxV2()

```ts
getStakeOnBehalfTxV2: (__namedParameters) => Promise<
  | [ApproveTransactionInfo, StakeTransactionInfo]
| [StakeTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`bigint`

###### lockupPeriod

`bigint`

###### receiver

[`IAddress`](../../sdk-common/interfaces/IAddress.md)

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`StakeTransactionInfo`](../../sdk-common/type-aliases/StakeTransactionInfo.md)\]
  \| \[[`StakeTransactionInfo`](../../sdk-common/type-aliases/StakeTransactionInfo.md)\]\>

### getStakeTx()

```ts
getStakeTx: (__namedParameters) => Promise<
  | [ApproveTransactionInfo, StakeTransactionInfo]
| [StakeTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`bigint`

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`StakeTransactionInfo`](../../sdk-common/type-aliases/StakeTransactionInfo.md)\]
  \| \[[`StakeTransactionInfo`](../../sdk-common/type-aliases/StakeTransactionInfo.md)\]\>

### getStakeTxV2()

```ts
getStakeTxV2: (__namedParameters) => Promise<
  | [ApproveTransactionInfo, StakeTransactionInfo]
| [StakeTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`bigint`

###### lockupPeriod

`bigint`

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`StakeTransactionInfo`](../../sdk-common/type-aliases/StakeTransactionInfo.md)\]
  \| \[[`StakeTransactionInfo`](../../sdk-common/type-aliases/StakeTransactionInfo.md)\]\>

### getStakingBucketsInfoV2()

```ts
getStakingBucketsInfoV2: () => Promise<StakingBucketInfo[]>;
```

#### Returns

`Promise`\<`StakingBucketInfo`[]\>

### getStakingCalculateWeightedStakeV2()

```ts
getStakingCalculateWeightedStakeV2: (params) => Promise<bigint>;
```

#### Parameters

##### params

###### amount

`bigint`

###### lockupPeriod

`bigint`

#### Returns

`Promise`\<`bigint`\>

### getStakingConfigV2()

```ts
getStakingConfigV2: () => Promise<{
  stakingContractAddress: `0x${string}`;
}>;
```

#### Returns

`Promise`\<\{
  `stakingContractAddress`: `` `0x${string}` ``;
\}\>

### getStakingEarningsEstimationV2()

```ts
getStakingEarningsEstimationV2: (params) => Promise<StakingEarningsEstimationForStakes>;
```

#### Parameters

##### params

###### stakes

`object`[]

#### Returns

`Promise`\<`StakingEarningsEstimationForStakes`\>

### getStakingRevenueShareV2()

```ts
getStakingRevenueShareV2: () => Promise<{
  amount: number;
  percentage: IPercentage;
}>;
```

#### Returns

`Promise`\<\{
  `amount`: `number`;
  `percentage`: [`IPercentage`](../../sdk-common/interfaces/IPercentage.md);
\}\>

### getStakingRewardRatesV2()

```ts
getStakingRewardRatesV2: (__namedParameters) => Promise<StakingRewardRates>;
```

#### Parameters

##### \_\_namedParameters

###### rewardTokenAddress?

[`IAddress`](../../sdk-common/interfaces/IAddress.md)

###### sumrPriceUsd?

`number`

#### Returns

`Promise`\<`StakingRewardRates`\>

### getStakingSimulationDataV2()

```ts
getStakingSimulationDataV2: (params) => Promise<StakingSimulationData>;
```

#### Parameters

##### params

###### amount

`bigint`

###### period

`bigint`

###### sumrPriceUsd?

`number`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`StakingSimulationData`\>

### getStakingStakesV2()

```ts
getStakingStakesV2: (params?) => Promise<StakingStake[]>;
```

#### Parameters

##### params?

###### first?

`number`

###### skip?

`number`

#### Returns

`Promise`\<[`StakingStake`](../../sdk-common/interfaces/StakingStake.md)[]\>

### getStakingStatsV2()

```ts
getStakingStatsV2: () => Promise<StakingStats>;
```

#### Returns

`Promise`\<`StakingStats`\>

### getStakingTotalSumrStakedV2()

```ts
getStakingTotalSumrStakedV2: () => Promise<bigint>;
```

#### Returns

`Promise`\<`bigint`\>

### getStakingTotalWeightedSupplyV2()

```ts
getStakingTotalWeightedSupplyV2: () => Promise<bigint>;
```

#### Returns

`Promise`\<`bigint`\>

### getStrategy()

```ts
getStrategy: (__namedParameters) => Promise<
  | IDcaStrategy
| undefined>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### strategyId

`string`

#### Returns

`Promise`\<
  \| [`IDcaStrategy`](../../sdk-common/interfaces/IDcaStrategy.md)
  \| `undefined`\>

### getSummerPrice()

```ts
getSummerPrice: (params?) => Promise<{
  price: number;
}>;
```

#### Parameters

##### params?

###### override?

`number`

#### Returns

`Promise`\<\{
  `price`: `number`;
\}\>

### getSummerToken()

```ts
getSummerToken: (__namedParameters) => Promise<ITokenStanalone>;
```

#### Parameters

##### \_\_namedParameters

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

#### Returns

`Promise`\<[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)\>

### getSwapQuote()

```ts
getSwapQuote: (__namedParameters) => Promise<QuoteDataStanalone>;
```

#### Parameters

##### \_\_namedParameters

###### fromAmount

`string`

###### fromToken

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)

###### slippage

`number`

###### toToken

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)

#### Returns

`Promise`\<[`QuoteDataStanalone`](../../sdk-common/type-aliases/QuoteDataStanalone.md)\>

### getTargetChainInfo()

```ts
getTargetChainInfo: (specificChainId) => ChainInfo;
```

#### Parameters

##### specificChainId

`number`

#### Returns

[`ChainInfo`](../../sdk-common/classes/ChainInfo.md)

### getTokenBySymbol()

```ts
getTokenBySymbol: (__namedParameters) => Promise<Token>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

`number`

###### symbol

`string`

#### Returns

`Promise`\<[`Token`](../../sdk-common/classes/Token.md)\>

### getUndelegateTx()

```ts
getUndelegateTx: () => Promise<[DelegateTransactionInfo]>;
```

#### Returns

`Promise`\<\[[`DelegateTransactionInfo`](../../sdk-common/type-aliases/DelegateTransactionInfo.md)\]\>

### getUnstakeFleetTokensTx()

```ts
getUnstakeFleetTokensTx: (__namedParameters) => Promise<TransactionInfo>;
```

#### Parameters

##### \_\_namedParameters

###### amountValue?

`string`

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<[`TransactionInfo`](../../sdk-common/interfaces/TransactionInfo.md)\>

### getUnstakeTx()

```ts
getUnstakeTx: (__namedParameters) => Promise<[UnstakeTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`bigint`

#### Returns

`Promise`\<\[[`UnstakeTransactionInfo`](../../sdk-common/type-aliases/UnstakeTransactionInfo.md)\]\>

### getUnstakeTxV2()

```ts
getUnstakeTxV2: (__namedParameters) => Promise<
  | [ApproveTransactionInfo, UnstakeTransactionInfo]
| [UnstakeTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`bigint`

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

###### userStakeIndex

`bigint`

#### Returns

`Promise`\<
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`UnstakeTransactionInfo`](../../sdk-common/type-aliases/UnstakeTransactionInfo.md)\]
  \| \[[`UnstakeTransactionInfo`](../../sdk-common/type-aliases/UnstakeTransactionInfo.md)\]\>

### getUserBalance()

```ts
getUserBalance: (__namedParameters) => Promise<bigint>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

`number`

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`bigint`\>

### getUserBlendedYieldBoost()

```ts
getUserBlendedYieldBoost: (__namedParameters) => Promise<number>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<`number`\>

### getUserDelegatee()

```ts
getUserDelegatee: (__namedParameters) => Promise<IAddress>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<[`IAddress`](../../sdk-common/interfaces/IAddress.md)\>

### getUserDelegateeV2()

```ts
getUserDelegateeV2: (__namedParameters) => Promise<IAddress>;
```

#### Parameters

##### \_\_namedParameters

###### userAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`IAddress`](../../sdk-common/interfaces/IAddress.md)\>

### getUserMerklRewards()

```ts
getUserMerklRewards: (__namedParameters) => Promise<{
  perChain: Partial<Record<ChainId, MerklReward[]>>;
}>;
```

#### Parameters

##### \_\_namedParameters

###### chainIds

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)[]

###### rewardsTokensAddresses

`` `0x${string}` ``[]

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<\{
  `perChain`: `Partial`\<`Record`\<[`ChainId`](../../sdk-common/type-aliases/ChainId.md), [`MerklReward`](../../sdk-client/interfaces/MerklReward.md)[]\>\>;
\}\>

### getUserPosition()

```ts
getUserPosition: (__namedParameters) => Promise<
  | IArmadaPosition
| undefined>;
```

#### Parameters

##### \_\_namedParameters

###### fleetAddress

`string`

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<
  \| [`IArmadaPosition`](../../sdk-common/interfaces/IArmadaPosition.md)
  \| `undefined`\>

### getUserPositions()

```ts
getUserPositions: (params) => Promise<IArmadaPosition[]>;
```

#### Parameters

##### params

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<[`IArmadaPosition`](../../sdk-common/interfaces/IArmadaPosition.md)[]\>

### getUserStakedBalance()

```ts
getUserStakedBalance: (__namedParameters) => Promise<bigint>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<`bigint`\>

### getUserStakesCount()

```ts
getUserStakesCount: (__namedParameters) => Promise<{
  userStakesCountAfter: bigint;
  userStakesCountBefore: bigint;
}>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<\{
  `userStakesCountAfter`: `bigint`;
  `userStakesCountBefore`: `bigint`;
\}\>

### getUserStakesV2()

```ts
getUserStakesV2: (__namedParameters) => Promise<UserStakeV2[]>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<[`UserStakeV2`](../../sdk-client/interfaces/UserStakeV2.md)[]\>

### getUserStakingBalanceV2()

```ts
getUserStakingBalanceV2: (__namedParameters) => Promise<StakingBalanceByBucket[]>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<`StakingBalanceByBucket`[]\>

### getUserStakingEarnedV2()

```ts
getUserStakingEarnedV2: (__namedParameters) => Promise<bigint>;
```

#### Parameters

##### \_\_namedParameters

###### rewardTokenAddress?

[`IAddress`](../../sdk-common/interfaces/IAddress.md)

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<`bigint`\>

### getUserStakingSumrStaked()

```ts
getUserStakingSumrStaked: (__namedParameters) => Promise<bigint>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<`bigint`\>

### getUserStakingWeightedBalanceV2()

```ts
getUserStakingWeightedBalanceV2: (__namedParameters) => Promise<bigint>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<`bigint`\>

### getUserVotes()

```ts
getUserVotes: (__namedParameters) => Promise<bigint>;
```

#### Parameters

##### \_\_namedParameters

###### user

[`IUser`](../../sdk-common/interfaces/IUser.md)

#### Returns

`Promise`\<`bigint`\>

### getVaultRewardsMerklClaimTx()

```ts
getVaultRewardsMerklClaimTx: (__namedParameters) => Promise<
  | [MerklClaimTransactionInfo]
| undefined>;
```

#### Parameters

##### \_\_namedParameters

###### address

`` `0x${string}` ``

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### rewardsTokensAddresses?

`` `0x${string}` ``[]

#### Returns

`Promise`\<
  \| \[[`MerklClaimTransactionInfo`](../../sdk-common/type-aliases/MerklClaimTransactionInfo.md)\]
  \| `undefined`\>

### getVaultSwitchEnsoTx()

```ts
getVaultSwitchEnsoTx: (__namedParameters) => Promise<
  | [VaultSwitchTransactionInfo]
| [ApproveTransactionInfo, VaultSwitchTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### destinationFleetAddress

`string`

###### slippage

`number`

###### sourceFleetAddress

`string`

###### walletAddress

[`IAddress`](../../sdk-common/interfaces/IAddress.md)

#### Returns

`Promise`\<
  \| \[[`VaultSwitchTransactionInfo`](../../sdk-common/type-aliases/VaultSwitchTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`VaultSwitchTransactionInfo`](../../sdk-common/type-aliases/VaultSwitchTransactionInfo.md)\]\>

### getVaultSwitchTx()

```ts
getVaultSwitchTx: (__namedParameters) => Promise<
  | [VaultSwitchTransactionInfo]
  | [ApproveTransactionInfo, VaultSwitchTransactionInfo]
| [ApproveTransactionInfo, ApproveTransactionInfo, VaultSwitchTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### destinationFleetAddress

`string`

###### shouldStake?

`boolean`

###### slippage

`number`

###### sourceFleetAddress

`string`

###### walletAddress

[`IAddress`](../../sdk-common/interfaces/IAddress.md)

#### Returns

`Promise`\<
  \| \[[`VaultSwitchTransactionInfo`](../../sdk-common/type-aliases/VaultSwitchTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`VaultSwitchTransactionInfo`](../../sdk-common/type-aliases/VaultSwitchTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`VaultSwitchTransactionInfo`](../../sdk-common/type-aliases/VaultSwitchTransactionInfo.md)\]\>

### getWalletAddress()

```ts
getWalletAddress: () => Address;
```

#### Returns

[`Address`](../../sdk-common/classes/Address.md)

### getWithdrawals()

```ts
getWithdrawals: (__namedParameters) => Promise<Readonly<{
  amount: ITokenAmount;
  amountUsd: IFiatCurrencyAmount;
  from: `0x${string}`;
  timestamp: number;
  to: `0x${string}`;
  txHash: `0x${string}`;
  vaultBalance: ITokenAmount;
  vaultBalanceUsd: IFiatCurrencyAmount;
}>[]>;
```

#### Parameters

##### \_\_namedParameters

###### first?

`number`

###### positionId

[`IArmadaPositionId`](../../sdk-common/interfaces/IArmadaPositionId.md)

###### skip?

`number`

#### Returns

`Promise`\<`Readonly`\<\{
  `amount`: [`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md);
  `amountUsd`: [`IFiatCurrencyAmount`](../../sdk-common/interfaces/IFiatCurrencyAmount.md);
  `from`: `` `0x${string}` ``;
  `timestamp`: `number`;
  `to`: `` `0x${string}` ``;
  `txHash`: `` `0x${string}` ``;
  `vaultBalance`: [`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md);
  `vaultBalanceUsd`: [`IFiatCurrencyAmount`](../../sdk-common/interfaces/IFiatCurrencyAmount.md);
\}\>[]\>

### getWithdrawTx()

```ts
getWithdrawTx: (__namedParameters) => Promise<
  | [WithdrawTransactionInfo]
  | [ApproveTransactionInfo, WithdrawTransactionInfo]
| [ApproveTransactionInfo, ApproveTransactionInfo, WithdrawTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### amount

[`ITokenAmount`](../../sdk-common/interfaces/ITokenAmount.md)

###### chainInfo

[`IChainInfo`](../../sdk-common/interfaces/IChainInfo.md)

###### fleetAddress

`string`

###### slippage

`number`

###### toToken

[`ITokenStanalone`](../../sdk-common/interfaces/ITokenStanalone.md)

###### walletAddress

[`IAddress`](../../sdk-common/interfaces/IAddress.md)

#### Returns

`Promise`\<
  \| \[[`WithdrawTransactionInfo`](../../sdk-common/type-aliases/WithdrawTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`WithdrawTransactionInfo`](../../sdk-common/type-aliases/WithdrawTransactionInfo.md)\]
  \| \[[`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`ApproveTransactionInfo`](../../sdk-common/type-aliases/ApproveTransactionInfo.md), [`WithdrawTransactionInfo`](../../sdk-common/type-aliases/WithdrawTransactionInfo.md)\]\>

### isAuthorizedStakingRewardsCallerV2()

```ts
isAuthorizedStakingRewardsCallerV2: (__namedParameters) => Promise<boolean>;
```

#### Parameters

##### \_\_namedParameters

###### authorizedCallerAddress?

`` `0x${string}` ``

###### ownerAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

### isPermit2AuthorizationNeeded()

```ts
isPermit2AuthorizationNeeded: (__namedParameters) => Promise<boolean>;
```

#### Parameters

##### \_\_namedParameters

###### amount

`bigint`

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### ownerAddress

`` `0x${string}` ``

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

### pauseStrategyTx()

```ts
pauseStrategyTx: (__namedParameters) => Promise<[PauseDcaStrategyTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### strategy

[`IDcaStrategy`](../../sdk-common/interfaces/IDcaStrategy.md)

#### Returns

`Promise`\<\[[`PauseDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/PauseDcaStrategyTransactionInfo.md)\]\>

### resumeStrategyTx()

```ts
resumeStrategyTx: (__namedParameters) => Promise<[ResumeDcaStrategyTransactionInfo]>;
```

#### Parameters

##### \_\_namedParameters

###### chainId

[`ChainId`](../../sdk-common/type-aliases/ChainId.md)

###### strategy

[`IDcaStrategy`](../../sdk-common/interfaces/IDcaStrategy.md)

#### Returns

`Promise`\<\[[`ResumeDcaStrategyTransactionInfo`](../../sdk-common/type-aliases/ResumeDcaStrategyTransactionInfo.md)\]\>
