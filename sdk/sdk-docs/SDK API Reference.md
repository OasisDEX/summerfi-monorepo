# SDK API Reference

**Latest version: v1.1.0**

For information on installing the SDK, please see the installation guide here →
[SDK Installation Guide](https://summerfi.notion.site/summerfi-sdk-install-guide)

## Main Flows

### SDK creation

```tsx
// create a local file ./sdk.ts to reuse a single sdk instance
import { makeSDK } from '@summer_fi/sdk-client'

export const sdk = makeSDK({
  apiDomainUrl: `https://summer.fi`,
  logging: process.env.NODE_ENV === 'development',
})
```

### Retrieve Vault List with extra info

```tsx
const chainId = ChainIds.Base
const vaults: [IArmadaVaultInfo](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21)[] = await sdk.armada.users.getVaultInfoList({
  chainId,
})

console.log(
  'All vaults:',
  vaults.list
    .map((vaultInfo) => {
      return JSON.stringify(
        {
          id: vaultInfo.id.toString(),
          token: vaultInfo.token.toString(),
          depositCap: vaultInfo.depositCap.toString(),
          totalDeposits: vaultInfo.totalDeposits.toString(),
          totalShares: vaultInfo.totalShares.toString(),
          apy: vaultInfo.apy?.toString(),
          rewardsApys: vaultInfo.rewardsApys.map((reward) => ({
            token: reward.token.toString(),
            apy: reward.apy?.toString(),
          })),
        },
        null,
        2,
      )
    })
    .toString(),
)

// All vaults info:
[{
  "id": "Pool ID: Protocol: Armada on Base (ID: 8453)",
  "token": "LVWETH (LazyVault_LowerRisk_WETH)",
  "depositCap": "4500 WETH",
  "totalDeposits": "2023.221718764654726475 WETH",
  "totalShares": "2022.094615580704722886 LVWETH",
  "apy": "3.522884827325959%",
  "rewardsApys": [
    {
      "token": "SUMR (SummerToken)",
      "apy": "52.35132807274111%"
    }
  ]
}, ...]
```

### Retrieve Specific Vault with extra info

```tsx
// you can get vaultId from getVaultInfoList() => vaultInfoList[0].id
// or construct manually using static factory method
const vaultId: IArmadaVaultId = ArmadaVaultId.createFrom({
  chainInfo,
  fleetAddress: '0x....',
})

const vaultInfo: [IArmadaVaultInfo](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21) = await sdk.armada.users.getVaultInfo({
  vaultId,
})

console.log(
  'Specific vault info:',
  JSON.stringify(
    {
      id: vaultInfo.id.toString(),
      token: vaultInfo.token.toString(),
      depositCap: vaultInfo.depositCap.toString(),
      totalDeposits: vaultInfo.totalDeposits.toString(),
      totalShares: vaultInfo.totalShares.toString(),
      apy: vaultInfo.apy?.toString(),
      rewardsApys: vaultInfo.rewardsApys.map((reward) => ({
        token: reward.token.toString(),
        apy: reward.apy?.toString(),
      })),
    },
    null,
    2,
  ),
)

// Specific vault info:
{
  "id": "Pool ID: Protocol: Armada on Base (ID: 8453)",
  "token": "LVWETH (LazyVault_LowerRisk_WETH)",
  "depositCap": "4500 WETH",
  "totalDeposits": "2948.876393083458875336 WETH",
  "totalShares": "2946.948828922528865601 LVWETH",
  "apy": "2.997274534331705%",
  "rewardsApys": [
    {
      "token": "SUMR (SummerToken)",
      "apy": "32.71121350084195%"
    }
  ]
}
```

### Create Deposit Transaction

```tsx
import {
	ArmadaVaultId, ChainIds, getChainInfoByChainId, Wallet, Address, User
} from "@summer_fi/sdk-common"

import { sdk } from "./sdk"

// create chainInfo for the Base chain
const chainInfo: [IChainInfo](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21) = getChainInfoByChainId(ChainIds.Base)

// create a user wallet using EOA address
const address: [IAddress](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21) = Address.createFromEthereum({ value: "0x........." })
const user: [IUser](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21) = User.createFrom({
  chainInfo,
  wallet: Wallet.createFrom({ address })
})

// create a vaultId object for a selected fleet using it's deployment address
const vaultId: [IArmadaVaultId](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21) = ArmadaVaultId.createFrom({
  chainInfo,
  fleetAddress: Address.createFromEthereum({ value: "0x........." })
})

// you can get token entity using chain namespace to get particular token entity
// you can query by symbol or by address on a particular chain from our curated list
const chain: [IChain](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21) = await sdk.chains.getChain({ chainInfo })
const token: [IToken](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21) = await chain.tokens.getTokenBySymbol({ symbol: "ETH" })

// create a token amount to deposit
const amount = TokenAmount.createFrom({
  amount: '1', // amount is in full units e.g. 1 ETH, 1 USDC, ... etc.
  token,
})

// you need to set slippage in case there is swap involved
// happens when deposited asset is different from the vault asset
// use value in percentage, here we're setting 0.5%
const slippage = Percentage.createFrom({ value: '0.5' })

// this will return either one tx with deposit or two tx's if allowance is required
const transactions = await sdk.armada.users.getNewDepositTx({
  vaultId,
  user,
  amount,
  slippage,
  referralCode: "XXXXX" // optional
})

if (transactions == 2) {
	// first tx is approval
	const [approval, deposit] = transactions

	// {
	//   type: "Approval",
	//   transaction: [Transaction](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21)
	//   description: "Approval for ..."
	//   metadata: {
	//     approvalAmount: ITokenAmount
  //     approvalSpender: IAddress
	//   }
	// }
	// {
	//   type: "Deposit",
	//   transaction: [Transaction](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21)
  //   description: "Deposit Operations: ..."
	//   metadata: {
	//     fromAmount: ITokenAmount,
	//     toAmount: ITokenAmount
	//     priceImpact?: TransactionPriceImpact
	//     slippage: IPercentage
	//   }
	// }
}
else if (transactions.length == 1) {
	const [deposit] = transactions
}

// now you can sign and send the transactions using your preferred web3 client (ethers, wagmi, viem... etc.)

// example using viem
const txInfo = transactions[0]
const hash = this.walletClient.sendTransaction({
  to: txInfo.transaction.target.value,
  value: BigInt(depositTx.transaction.value),
  data: txInfo.transaction.calldata,
})

```

### Create Withdraw Transaction

```tsx
import {
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Wallet,
  Address,
  User,
} from '@summer_fi/sdk-common'

import { sdk } from './sdk'

// create chainInfo for the Base chain
const chainInfo = getChainInfoByChainId(ChainIds.Base)

// create a user wallet using EOA address
const address = Address.createFromEthereum({ value: '0x.........' })
const user = User.createFrom({
  chainInfo,
  wallet: Wallet.createFrom({ address }),
})

// create a vaultId object for a selected fleet using it's deployment address
const vaultId = ArmadaVaultId.createFrom({
  chainInfo,
  fleetAddress: Address.createFromEthereum({ value: '0x.........' }),
})

// you can get token entity using chain namespace to get particular token entity
// you can query by symbol or by address on a particular chain from our curated list
const chain = await sdk.chains.getChain({ chainInfo })
const token = await chain.tokens.getTokenBySymbol({ symbol: 'USDC' })

// create a token amount to deposit
const amount = TokenAmount.createFrom({
  amount: '1', // amount is in full units e.g. 1 ETH, 1 USDC, ... etc.
  token,
})

// you need to set slippage in case there is swap involved
// happens when toToken asset is different from the vault asset
// use value in percentage, here we're setting 0.5%
const slippage = Percentage.createFrom({ value: '0.5' })

// this will return either one tx with deposit or two tx's if allowance is required
const transactions = await sdk.armada.users.getWithdrawTx({
  vaultId,
  user,
  amount,
  toToken: amount.token,
  slippage: Percentage.createFrom({
    value: 1,
  }),
})

// now you can sign and send the transactions using your preferred web3 client (ethers, wagmi, viem... etc.)

// example using viem
const txInfo = transactions[0]
const hash = this.walletClient.sendTransaction({
  to: txInfo.transaction.target.value,
  value: BigInt(depositTx.transaction.value),
  data: txInfo.transaction.calldata,
})
```

### Retrieve Positions

```tsx
import { makeSDK, ArmadaVaultId } from '@summer_fi/sdk-client';
import {
	ChainIds, getChainInfoByChainId, Wallet, Address, User
} from "@summer_fi/sdk-common"

import { sdk } from "./sdk"

// create chainInfo for the Base chain
const chainInfo = getChainInfoByChainId(ChainIds.Base)

// create a user wallet using EOA address
const userEOAAddress = "0x........."
const user = User.createFrom({
  chainInfo,
  wallet: Wallet.createFrom({ address })
})

// when you have deposited some assets to the vault

// you can retrieve all user positions on a particular chain
const positions: [IArmadaPosition](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21)[] = await sdk.armada.users.getUserPositions({
  user,
})

// or only position in a particular vault
const position: [IArmadaPosition](https://www.notion.so/SDK-API-Reference-v1-0-1-1c98cbaf47f88066b3b4d2ab5008c884?pvs=21) = await sdk.armada.users.getUserPosition({
  user,
  fleetAddress: Address.createFromEthereum({ value: "0x........." })
})
```

### Switch Vaults

```tsx
const userAddress = "0x..."
const chainId = ChainIds.Base
const chainInfo = getChainInfoByChainId(chainId)

const chain = await sdk.chains.getChain({ chainInfo })
const usdc = await chain.tokens.getTokenBySymbol({ symbol: "USDC" })
const switchAmount = TokenAmount.createFrom({
  amount: "10",
  token: usdc,
})

const user = User.createFrom({
  wallet: Wallet.createFrom({
    address: userAddress,
  }),
  chainInfo,
})

const sourceVaultId = ArmadaVaultId.createFrom({
  chainInfo,
  fleetAddress: sourceFleetAddress,
})
const destinationVaultId = ArmadaVaultId.createFrom({
  chainInfo,
  fleetAddress: destinationFleetAddress,
})

const slippage = Percentage.createFrom({
  value: DEFAULT_SLIPPAGE_PERCENTAGE,
})

const transactions = await sdk.armada.users.getVaultSwitchTx({
  sourceVaultId,
  destinationVaultId,
  amount: switchAmount,
  user,
  slippage,
})

// you'll get up to 3 transactions to execute
// first two are approvals, only if they are needed so they are optional
// the last one will always be a switch tx
typeof transactions =
| [VaultSwitchTransactionInfo]
| [ApproveTransactionInfo, VaultSwitchTransactionInfo]
| [ApproveTransactionInfo, ApproveTransactionInfo, VaultSwitchTransactionInfo]
```

## Utility Interfaces

There are utility interfaces that are of interest for providing various entities required for
interacting with the api like: tokens, token prices, or subgraph data etc.

### Tokens

```tsx
import { getChainInfoByChainId, ChainIds, type IAddress, type IToken } from 'sdk-common'

const chainInfo = getChainInfoByChainId(ChainIds.Base)
const baseChain = await sdk.chains.getChain({ chainInfo })

// get token by symbol
const usdcToken: IToken = await baseChain.tokens.getTokenBySymbol({ symbol: 'USDC' })
// or by address
const address: IAddress = Address.createFromEthereum({ value: '0x.......' })
const otherToken: IToken = await baseChain.tokens.getTokenByAddress({ address })
```

### Token Prices

```tsx
import { getChainInfoByChainId, ChainIds, FiatCurrency, type IToken } from 'sdk-common'

const chainInfo = getChainInfoByChainId(ChainIds.Base)
const baseChain = await sdk.chains.getChain({ chainInfo })

const baseToken = await baseChain.tokens.getTokenBySymbol({ symbol: 'ETH' })

// denomination in quote token
const denomination: IToken = await baseChain.tokens.getTokenBySymbol({ symbol: 'USDC' })
// or in Fiat USD
const denomination: FiatCurrency = FiatCurrency.USD

const priceInfo: SpotPriceInfo = sdk.oracle.getSpotPrice({
  baseToken,
  denomination,
})

const price: IPrice = priceInfo.price
```

## Merkl Rewards

The Merkl Rewards flow enables users to claim their accrued rewards from the Merkl campaigns for
both using Lazy Vaults but also using referral programs.

### Get User Merkl Rewards

Get all Merkl rewards for a user across specified chains.

#### Parameters

- **address**: The user's wallet address
- **chainIds** (optional): Array of chain IDs to filter by (default: all supported chains)
- **rewardsTokensAddresses** (optional): Array of specific reward token addresses to filter rewards

#### Example

```typescript
import { ChainIds } from '@summerfi/sdk-common'

// Get rewards for all supported chains
const rewards = await sdk.armada.users.getUserMerklRewards({
  address: '0x742d35Cc6633C0532925a3b8D84c94f8855C4ba2',
})
console.log('Rewards per chain:', rewards.perChain)

// Get rewards for specific chain (like Base in this example)
const baseRewards = await sdk.armada.users.getUserMerklRewards({
  address: '0x742d35Cc6633C0532925a3b8D84c94f8855C4ba2',
  chainIds: [ChainIds.Base],
})
console.log('Rewards per chain on base:', baseRewards.perChain)
```

#### Response

Returns an object with rewards organized by chain ID.

```json
{
  "perChain": {
    "8453": [
      {
        "token": {
          "chainId": 8453,
          "address": "0xA0b86a33E6D9FDB91b23DC0a4dD9A7B0D2d15a76",
          "symbol": "USDC",
          "decimals": 6,
          "price": 1.0
        },
        "root": "0x1234567890abcdef...",
        "recipient": "0x742d35Cc6633C0532925a3b8D84c94f8855C4ba2",
        "amount": "1000000",
        "claimed": "0",
        "pending": "1000000",
        "proofs": [
          "0xabcdef1234567890...",
          "0x9876543210fedcba..."
        ]
      }
    ],
    "1": [
      ...
    ]
  }
}
```

### Get Referral Fees Merkl Claim Transaction

Generate a transaction to claim accrued referral fees in some token for a user on a specific chain.

#### Parameters

- **address**: The user's wallet address
- **chainId**: The chain ID where rewards should be claimed
- **rewardsTokensAddresses** : Array of specific reward token addresses to claim

#### Example

```typescript
import { ChainId } from '@summerfi/sdk-common'

// Get referral fees claim transaction for a user
const claimTransactions = await sdk.armada.users.getReferralFeesMerklClaimTx({
  address: userAddress,
  chainId: ChainId.Base,
  rewardsTokensAddresses: [usdcTokenAddress],
})

if (claimTransactions) {
  // Execute the claim transaction
  const tx = claimTransactions[0]
  console.log('Claim transaction:', tx.transaction)

  // Send transaction using your wallet
  const result = await wallet.sendTransaction({
    to: tx.transaction.target,
    data: tx.transaction.calldata,
    value: tx.transaction.value,
  })
}
```

#### Response

Returns an array with one claim transaction if rewards are available, or `undefined` if no rewards
exist for the specified chain.

```json
[
  {
    "type": "MerklClaim",
    "description": "Claiming Merkl rewards for 1 token(s) on Base",
    "transaction": {
      "target": "0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae",
      "calldata": "0x2f49ae08000000000000000000000000742d35cc6633c0532925a3b8d84c94f8855c4ba2000000000000000000000000a0b86a33e6d9fdb91b23dc0a4dd9a7b0d2d15a760000000000000000000000000000000000000000000000000000000000000001",
      "value": "0"
    }
  }
]
```

### Get User Merkl Claim Transaction

Generate a transaction to claim all Merkl rewards for a user on a specific chain.

#### Parameters

- **address**: The user's wallet address
- **chainId**: The chain ID where rewards should be claimed

#### Example

```typescript
import { ChainIds } from '@summerfi/sdk-common'

// Get claim transaction for user rewards
const claimTransactions = await sdk.armada.users.getUserMerklClaimTx({
  address: '0x742d35Cc6633C0532925a3b8D84c94f8855C4ba2',
  chainId: ChainIds.Base,
})

if (claimTransactions) {
  // Execute the claim transaction
  const tx = claimTransactions[0]
  console.log('Claim transaction:', tx.transaction)

  // Send transaction using your wallet
  const result = await wallet.sendTransaction({
    to: tx.transaction.target,
    data: tx.transaction.calldata,
    value: tx.transaction.value,
  })
}
```

#### Response

Returns an array with one claim transaction if rewards are available, or `undefined` if no rewards
exist for the specified chain.

```json
[
  {
    "type": "MerklClaim",
    "description": "Claiming Merkl rewards for 2 token(s) on Base",
    "transaction": {
      "target": "0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae",
      "calldata": "0x2f49ae08000000000000000000000000742d35cc6633c0532925a3b8d84c94f8855c4ba2000000000000000000000000a0b86a33e6d9fdb91b23dc0a4dd9a7b0d2d15a760000000000000000000000000000000000000000000000000000000000000002",
      "value": "0"
    }
  }
]
```

### Check Merkl Rewards Operator Authorization

Check if AdmiralsQuarters is authorized as a Merkl rewards operator for a user on a specific chain.

#### Parameters

- **chainId**: The chain ID to check authorization on
- **user**: The user's wallet address

#### Example

```typescript
import { ChainIds } from '@summerfi/sdk-common'

// Check if user has authorized AdmiralsQuarters as operator
const isAuthorized = await sdk.armada.users.getIsAuthorizedAsMerklRewardsOperator({
  chainId: ChainIds.Base,
  user: '0x742d35Cc6633C0532925a3b8D84c94f8855C4ba2',
})

console.log('Is authorized as operator:', isAuthorized)
```

#### Response

Returns a boolean value indicating authorization status.

```json
true
```

### Authorize as Merkl Rewards Operator Transaction

Generate a transaction to authorize AdmiralsQuarters as a Merkl rewards operator for a user.

#### Parameters

- **chainId**: The chain ID to perform the operation on
- **user**: The user's wallet address

#### Example

```typescript
import { ChainIds } from '@summerfi/sdk-common'

// Generate authorization transaction
const authTransactions = await sdk.armada.users.getAuthorizeAsMerklRewardsOperatorTx({
  chainId: ChainIds.Base,
  user: '0x742d35Cc6633C0532925a3b8D84c94f8855C4ba2',
})

// Execute the authorization transaction
const tx = authTransactions[0]
console.log('Authorization transaction:', tx.transaction)

// Send transaction using your wallet
const result = await wallet.sendTransaction({
  to: tx.transaction.target,
  data: tx.transaction.calldata,
  value: tx.transaction.value,
})
```

#### Response

Returns an array containing the authorization transaction.

```json
[
  {
    "type": "ToggleAQasMerklRewardsOperator",
    "description": "Authorize AdmiralsQuarters as Merkl rewards operator",
    "transaction": {
      "target": "0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae",
      "calldata": "0xa9059cbb000000000000000000000000742d35cc6633c0532925a3b8d84c94f8855c4ba20000000000000000000000000000000000000000000000000000000000000001",
      "value": "0"
    }
  }
]
```

# SDK Client Interfaces Definition

## ISDKManager

```tsx
interface ISDKManager {
  chains: IChainsManagerClient
  oracle: IOracleManagerClient
}
```

## IChainsManagerClient

```tsx
interface IChainsManager {
  getChain({ chainInfo: IChainInfo }): Promise<IChain>
  getChainById({ chainId: ChainId }): Promise<IChain>
}
```

## IChain

```tsx
interface IChain {
  tokens: ITokensManagerClient

  chainId: ChainId
  name: string
}
```

## ITokensManagerClient

```tsx
interface ITokensManager {
  getTokenBySymbol({ symbol: string }): Promise<IToken>
  getTokenByAddress({ address: string }): Promise<IToken>
}
```

## IOracleManagerClient

```tsx
interface IOracleManager {
  getSpotPrice({ baseToken: IToken; denomination?: Denomination }): Promise<ISpotPriceInfo>
}
```

# SDK Common Interface Definitions

## IArmadaPosition

```tsx
IArmadaPosition = {
  id: IArmadaPositionId;
  pool: IArmadaVault;
  amount: ITokenAmount
  shares: ITokenAmount
  claimedSummerToken: ITokenAmount
  claimableSummerToken: ITokenAmount
  rewards: {
    claimed: ITokenAmount
    claimable: ITokenAmount
  }[]

  @deprecated
  deposits: {
    amount: ITokenAmount;
    timestamp: number;
	}[]
  @deprecated
  withdrawals: {
    amount: ITokenAmount;
    timestamp: number;
	}[]
}
```

## IArmadaPositionId

```tsx
IArmadaPositionId = {
  user: IUser;
}
```

## IArmadaVault

```tsx
IArmadaVault = {
  id: IArmadaVaultId,
}
```

## IArmadaVaultId

```tsx
IArmadaVault = {
  chainInfo: IChainInfo
  fleetAddress: IAddress
}
```

## IArmadaVaultInfo

```tsx
IArmadaVaultInfo = {
  id: IArmadaVaultId
  token: IToken
  depositCap: ITokenAmount
  totalDeposits: ITokenAmount
  totalShares: ITokenAmount
  apy: IPercentage | null
	rewardsApys: Array<{ token: IToken, apy: IPercentage | null }>
}
```

## IAddress

```tsx
IAddress = {
  value: AddressValue
  type: AddressType

  createFrom({ value: string, type: AddressType }): IAddress
	createFromEthereum({ value: string }): IAddress
}
```

## IChainInfo

```tsx
IChainInfo = {
  chainId: ChainId
  name: string
}
```

## IToken

```tsx
IToken = {
	symbol: string
  name: string
  chainInfo: IChainInfo
  address: IAddress
  decimals: number
}
```

## ITokenAmount

```tsx
ITokenAmount = {
  amount: string
  token: IToken

  createFrom({ token: IToken, amount: string }): ITokenAmount
}
```

## IPrice

```tsx
IPrice = {
	value: string
  base: Denomination
  quote: Denomination

  createFrom({ value: string, base: Denomination, quote: Denomination }): IPrice
}
```

## IPercentage

```tsx
IPercentage = {
  amount: string

  createFrom({ value: string }): IPercentage
  createFromSolidityValue({ value: bigint }): IPercentage
}
```

## ISpotPriceInfo

```tsx
ISpotPriceInfo = {
  token: IToken
  price: IPrice
}
```

## IUser

```tsx
IUser = {
  wallet: IWallet
  chainInfo: IChainInfo

  createFrom({ wallet: IWallet, chainInfo: IChainInfo }): IUser
}
```

## IWallet

```tsx
IWallet = {
  address: IAddress

  createFrom({ address: IAddress }): IWallet
}
```

# SDK Common Transaction Types

```tsx
/**
 * @enum TransactionType
 * @description Enum of all the transaction types that can be performed.
 */
export enum TransactionType {
  Approve = 'Approve',
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Claim = 'Claim',
  Delegate = 'Delegate',
  Stake = 'Stake',
  Unstake = 'Unstake',
  Migration = 'Migration',
  Bridge = 'Bridge',
  Send = 'Send',
  VaultSwitch = 'VaultSwitch',
}

type Transaction = {
  target: Address
  calldata: HexData
  value: string
}

type TransactionInfo = {
  transaction: Transaction
  description: string
}

export type ApproveTransactionInfo = TransactionInfo & {
  type: TransactionType.Approve
  metadata: TransactionMetadataApproval
}
export type TransactionMetadataApproval = {
  approvalAmount: ITokenAmount
  approvalSpender: IAddress
}

export type DepositTransactionInfo = TransactionInfo & {
  type: TransactionType.Deposit
  metadata: TransactionMetadataDeposit
}
export type TransactionMetadataDeposit = {
  fromAmount: ITokenAmount
  toAmount: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

export type WithdrawTransactionInfo = TransactionInfo & {
  type: TransactionType.Withdraw
  metadata: TransactionMetadataWithdraw
}
export type TransactionMetadataWithdraw = {
  fromAmount: ITokenAmount
  toAmount: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

export type VaultSwitchTransactionInfo = TransactionInfo & {
  type: TransactionType.VaultSwitch
  metadata: TransactionMetadataVaultSwitch
}
export type TransactionMetadataVaultSwitch = {
  fromVault: IArmadaVaultId
  toVault: IArmadaVaultId
  fromAmount: ITokenAmount
  toAmount: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

export type MigrationTransactionInfo = TransactionInfo & {
  type: TransactionType.Migration
  metadata: TransactionMetadataMigration
}
export type TransactionMetadataMigration = {
  swapAmountByPositionId: Record<string, ITokenAmount>
  priceImpactByPositionId: Record<string, TransactionPriceImpact>
}

export type BridgeTransactionInfo = TransactionInfo & {
  type: TransactionType.Bridge
  metadata: TransactionMetadataBridge
}
export type TransactionMetadataBridge = {
  fromAmount: ITokenAmount
  toAmount: ITokenAmount
  lzFee: ITokenAmount
}

export type ClaimTransactionInfo = TransactionInfo & {
  type: TransactionType.Claim
}

export type DelegateTransactionInfo = TransactionInfo & {
  type: TransactionType.Delegate
}

export type StakeTransactionInfo = TransactionInfo & {
  type: TransactionType.Stake
}

export type UnstakeTransactionInfo = TransactionInfo & {
  type: TransactionType.Unstake
}
```

# SDK Common Enums and Types

## AddressType

```tsx
enum AddressType {
  Unknown = 'Unknown',
  Ethereum = 'Ethereum',
}
```

## AddressValue

```tsx
type AddressValue = `0x${string}`
```

## ChainId & ChainIds

```tsx
const ChainIds = {
  Mainnet: 1,
  Optimism: 10,
  Base: 8453,
  ArbitrumOne: 42161,
  Sonic: 146,
} as const

type ChainId = 1 | 10 | 8453 | 42161 | 146
```

## Denomination

```tsx
type Denomination = IToken | FiatCurrency
```

## FiatCurrency

```tsx
enum FiatCurrency {
  USD = 'USD',
  EUR = 'EUR',
}
```

# Changelog

### v1.1.0

Features:

- Added new Merkl Rewards flow with comprehensive methods:
  - **getUserMerklRewards** - retrieves Merkl rewards for a user across specified chains
  - **getUserMerklClaimTx** - generates transaction to claim all Merkl rewards for a user
  - **getReferralFeesMerklClaimTx** - generates transaction to claim referral fee rewards from Merkl
    campaigns
  - **getIsAuthorizedAsMerklRewardsOperator** - checks if AdmiralsQuarters is authorized as Merkl
    rewards operator
  - **getAuthorizeAsMerklRewardsOperatorTx** - generates transaction to authorize AdmiralsQuarters
    as Merkl rewards operator

### v1.0.1

- Added `apiDomainUrl` param to **makeSdk** factory function \*\*\*\*to provide a cleaner interface,
  it just needs api domain name instead of a direct API endpoint URL.

### v1.0.0

- Versioned API support

### v0.5.0

Features:

- Added `referralCode` arg to deposits - **getNewDepositTx**
- Breaking: refactored `deposits` & `withdrawals` fields on the `IArmadaPosition` interface

### v0.4.0

Features:

- Added new feature Vault Switch - **getVaultSwitchTx**
- Added new feature to retrieve Vaults with extended info - **getVaultInfoList**

Docs:

- Added new section with Transactions entities documentation

### v0.3.1

**First public release**
