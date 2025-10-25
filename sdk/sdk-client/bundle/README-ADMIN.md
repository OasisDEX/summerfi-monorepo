# SDK Admin API Reference v2

**Latest version: v2.1.0**

For information on installing the SDK, please see the installation guide here →
[SDK Installation Guide](https://summerfi.notion.site/summerfi-sdk-install-guide)

## Main Flows

### AdminSDK Creation

```typescript
// create a local file ./sdk.ts to reuse a common sdk instance
import { makeAdminSDK } from '@summer_fi/sdk-client'

export const sdk = makeAdminSDK({
  apiDomainUrl: `https://summer.fi`,
  clientId: 'your-client-id', // client id is provided by SummerFi to partners
  logging: process.env.NODE_ENV === 'development',
})
```

## Self Managed Vaults - Admin

### Get Fee Revenue Configuration

Retrieves the fee revenue configuration for a specific chain. This includes the vault fee receiver
address and the vault fee percentage.

**Parameters:**

- **chainId**: The chain ID to get the fee revenue configuration for (e.g., `ChainIds.Base`,
  `ChainIds.ArbitrumOne`)

**Example:**

```typescript
import { ChainIds } from '@summer_fi/sdk-client'
import { sdk } from './sdk'

const chainId = ChainIds.Base

// Get fee revenue configuration
const config = await sdk.armada.admin.getFeeRevenueConfig({
  chainId,
})

console.log('Fee Receiver Address:', config.vaultFeeReceiverAddress)
console.log('Fee Amount (%):', config.vaultFeeAmount.value)
console.log('Fee Amount (solidity format):', config.vaultFeeAmount.toSolidityValue())
```

**Response:**

```typescript
{
  vaultFeeReceiverAddress: string, // Address that receives vault fees
  vaultFeeAmount: Percentage // Fee percentage
}
```

### Rebalance Assets Between Arks

Rebalances assets between arks (yield sources) in a fleet. This operation moves funds from one ark
to another to optimize yield or manage risk. The keeper must ensure proper configuration limits are
set before executing a rebalance.

**Required Role:** The executing address must have the `KEEPER_ROLE` contract-specific role for the
target fleet (FleetCommander contract), or the `SUPER_KEEPER_ROLE` global role which allows keeper
operations on any fleet. See [Roles Overview](#roles-overview) for details.

This flow includes:

1. Fetching ark configurations to check limits
2. Setting required limits (maxRebalanceOutflow, maxRebalanceInflow, depositCap) if needed
3. Executing the rebalance operation

**Parameters:**

- **vaultId**: The ID of the vault (fleet) to rebalance
- **rebalanceData**: Array of rebalance operations, each containing:
  - **fromArk**: The ark address to withdraw funds from
  - **toArk**: The ark address to deposit funds to
  - **amount**: The amount of tokens to move (as TokenAmount), to transfer the entire available
    balance use `MAX_UINT256_STRING` (see example below)

**Example:**

```typescript
import { Address, ArmadaVaultId, getChainInfoByChainId, TokenAmount, MAX_UINT256_STRING } from '@summer_fi/sdk-client'
import { sdk } from './sdk'

const chainId = ChainIds.Base
const chainInfo = getChainInfoByChainId(chainId)

const fleetAddress = Address.createFromEthereum({
  value: '0xFLEETADDRESS...',
})

const vaultId = ArmadaVaultId.createFrom({
  chainInfo,
  fleetAddress,
})

// Define ark addresses
const bufferArk = Address.createFromEthereum({
  value: '0x04acEf9ca748ABD2c2053beD4a7b6dbF8BdCCc31',
})

const aaveArk = Address.createFromEthereum({
  value: '0xC01348b33Dd2431980688DBd0D1956BA1e642172',
})

// Get the token
const usdc = await sdk.tokens.getTokenBySymbol({
  chainId,
  symbol: 'USDC',
})

// Create the amount to rebalance
const amount = TokenAmount.createFrom({
  amount: '1000',
  token: usdc,
})

// Special case: transfer the entire available balance (avoid leaving dust)
// If you want to transfer the full available balance and avoid leaving a small "dust"
// amount (which can occur due to rounding or because assets increase in value between
// operations), pass the maximum uint256 value as the amount.
// Example using the decimal string representation of MaxUint256:
const amountAll = TokenAmount.createFromBaseUnit({
  amount: MAX_UINT256_STRING,
  token: usdc,
})

// 1. Check the source ark configuration
const fromArkConfig = await sdk.armada.admin.arkConfig({
  chainId,
  arkAddressValue: bufferArk.toSolidityValue(),
})

// 2. If maxRebalanceOutflow on the fromArk is too low, update it
if (BigInt(fromArkConfig.maxRebalanceOutflow) < amount.toSolidityValue()) {
  const setMaxRebalanceOutflowTxInfo = await sdk.armada.admin.setArkMaxRebalanceOutflow({
    vaultId,
    ark: bufferArk,
    maxRebalanceOutflow: amount,
  })
  // Send transaction (implementation depends on your setup)

// 3. Check the destination ark configuration
const toArkConfig = await sdk.armada.admin.arkConfig({
  chainId,
  arkAddressValue: aaveArk.toSolidityValue(),
})

// 4. If depositCap on the toArk is too low, update it
if (BigInt(toArkConfig.depositCap) < amount.toSolidityValue()) {
  const setDepositCapTxInfo = await sdk.armada.admin.setArkDepositCap({
    vaultId,
    ark: aaveArk,
    cap: amount,
  })
  // Send transaction

// 5. If maxRebalanceInflow is too low, update it
if (BigInt(toArkConfig.maxRebalanceInflow) < amount.toSolidityValue()) {
  const setMaxRebalanceInflowTxInfo = await sdk.armada.admin.setArkMaxRebalanceInflow({
    vaultId,
    ark: aaveArk,
    maxRebalanceInflow: amount,
  })
  // Send transaction

// 6. Execute the rebalance
const rebalanceTxInfo = await sdk.armada.admin.rebalance({
  vaultId,
  rebalanceData: [
    {
      fromArk: bufferArk,
      toArk: aaveArk,
      amount,
    },
  ],
})
// Send transaction
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Related Methods:**

**Get Ark Configuration:**

```typescript
const arkConfig = await sdk.armada.admin.arkConfig({
  chainId: ChainIds.Base,
  arkAddressValue: '0xARKADDRESS...',
})
```

Response:

```json
{
  "commander": {
    "type": "Address",
    "address": "0x..."
  },
  "raft": {
    "type": "Address",
    "address": "0x..."
  },
  "asset": {
    "type": "Address",
    "address": "0x..."
  },
  "depositCap": "1000000000000",
  "maxRebalanceOutflow": "500000000000",
  "maxRebalanceInflow": "500000000000",
  "name": "Aave USDC Ark",
  "details": "Stringified JSON Data containing specific details of the protocol",
  "requiresKeeperData": false,
  "maxDepositPercentageOfTVL": {
    "type": "Percentage",
    "value": "5000"
  }
}
```

**Set Ark Deposit Cap:**

```typescript
const txInfo = await sdk.armada.admin.setArkDepositCap({
  vaultId,
  ark: arkAddress,
  cap: TokenAmount.createFrom({ amount: '1000000', token: usdc }),
})
```

**Set Ark Max Rebalance Outflow:**

```typescript
const txInfo = await sdk.armada.admin.setArkMaxRebalanceOutflow({
  vaultId,
  ark: arkAddress,
  maxRebalanceOutflow: TokenAmount.createFrom({ amount: '500000', token: usdc }),
})
```

**Set Ark Max Rebalance Inflow:**

```typescript
const txInfo = await sdk.armada.admin.setArkMaxRebalanceInflow({
  vaultId,
  ark: arkAddress,
  maxRebalanceInflow: TokenAmount.createFrom({ amount: '500000', token: usdc }),
})
```

**Notes:**

- The executing address must have either the `KEEPER_ROLE` for the specific fleet or the
  `SUPER_KEEPER_ROLE` global role
- To grant the KEEPER role, use the Access Control methods (see Access Control section):

```typescript
import { ContractSpecificRoleName } from '@summer_fi/sdk-client'

const txInfo = await sdk.armada.accessControl.grantContractSpecificRole({
  chainId: ChainIds.Base,
  role: ContractSpecificRoleName.KEEPER_ROLE,
  contractAddress: fleetAddress, // The fleet (FleetCommander) address
  targetAddress: keeperAddress, // The address to grant the role to
})
```

## Self Managed Vaults - Access Control

### Roles Overview

The Armada Protocol uses a role-based access control system with two categories of roles:

#### Global Roles

Global roles apply across all contracts in the protocol:

- **SUPER_KEEPER_ROLE**: Allows keeper operations on any fleet without needing fleet-specific
  KEEPER_ROLE grants. Use this for trusted keeper addresses that manage multiple fleets.
- **GOVERNOR_ROLE**: Allows governance operations including granting/revoking roles, managing
  protocol parameters, and administrative functions. This is the highest privilege role.
- **DECAY_CONTROLLER_ROLE**: Allows control over decay-related parameters in the protocol's reward
  mechanisms.
- **ADMIRALS_QUARTERS_ROLE**: Allows operations related to Admiral's Quarters functionality.

#### Contract-Specific Roles

Contract-specific roles are scoped to individual contracts (e.g., a specific Fleet):

- **KEEPER_ROLE**: Allows keeper operations for a specific fleet, including: executing rebalances
  between arks, requesting and claiming withdrawals for arks that require withdrawal requests (e.g.,
  Fluid, Origin, Syrup arks), whitelisting Merkl operators for reward claiming, and sweeping idle
  assets from arks with withdrawal requests back to the buffer.
- **CURATOR_ROLE**: Allows curator operations for a specific fleet, including: adding/removing arks
  from the fleet, configuring ark and fleet parameters (deposit caps, max deposit percentage of TVL,
  rebalance inflow/outflow limits, minimum buffer balance, max rebalance operations), managing
  staking rewards, configuring auction parameters for harvested rewards in the Raft, and managing
  sweepable tokens and whitelisted routers for arks with withdrawal requests.
- **COMMANDER_ROLE**: Allows direct ark operations including boarding (deposit), disembarking
  (withdraw), and moving funds between arks. This role is typically granted to FleetCommander
  contracts, not EOAs, as it allows programmatic control over ark operations.

### Check if Address Has Contract-Specific Role

Check if a given address has a specific contract-specific role for a vault (fleet contract).

This is useful for frontends or operational scripts that need to verify permissions before allowing
certain actions.

**Parameters:**

- **chainId**: The chain where the contract (fleet) is deployed
- **role**: The contract-specific role to check. Available roles: `KEEPER_ROLE`, `CURATOR_ROLE` or
  `COMMANDER_ROLE`. See [Roles Overview](#roles-overview) for details.
- **contractAddress**: The target contract (e.g. Fleet / LazyVault) address you are checking against
- **targetAddress**: The address (EOA or contract) whose role membership you want to verify

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Fleet (vault) deployment address
const fleetAddress = Address.createFromEthereum({ value: '0xFLEETADDRESS...' })

// User / target address to check
const userAddress = Address.createFromEthereum({ value: '0xUSERADDRESS...' })

// Check for curator role
const hasCuratorRole = await sdk.armada.accessControl.hasContractSpecificRole({
  chainId: ChainIds.Base,
  role: ContractSpecificRoleName.CURATOR_ROLE,
  contractAddress: fleetAddress,
  targetAddress: userAddress,
})

console.log(
  `Address ${userAddress.value} ${hasCuratorRole ? 'IS' : 'is NOT'} a curator for fleet ${fleetAddress.value}`,
)
```

**Response:**

Boolean value indicating whether the target address has the specified role.

**Notes:**

- Contract-specific roles are managed by governor (requires `GOVERNOR_ROLE`)
- Use `grantContractSpecificRole` / `revokeContractSpecificRole` methods to manage roles (see
  sections below)
- The same method works for all contract-specific roles by changing the `role` parameter
- See [Roles Overview](#roles-overview) for details on each role's permissions

### Grant Contract-Specific Role to Address

Grant a contract-specific role to an address for a vault (fleet contract). This allows the address
to perform role-specific operations on that contract.

See [Roles Overview](#roles-overview) for detailed descriptions of each role and their use cases.

**Required Role:** The executing address must have the global `GOVERNOR_ROLE` to grant roles to
other addresses.

**Parameters:**

- **chainId**: The chain where the contract (fleet) is deployed
- **role**: The contract-specific role to grant. Available roles: `KEEPER_ROLE`, `CURATOR_ROLE` or
  `COMMANDER_ROLE`. See [Roles Overview](#roles-overview) for details.
- **contractAddress**: The target contract (e.g. Fleet / LazyVault) address
- **targetAddress**: The address (EOA or contract) to grant the role to

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Fleet (vault) deployment address
const fleetAddress = Address.createFromEthereum({ value: '0xFLEETADDRESS...' })

// Address to grant the role to
const userAddress = Address.createFromEthereum({ value: '0xUSERADDRESS...' })

// Grant curator role
const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
  chainId: ChainIds.Base,
  role: ContractSpecificRoleName.CURATOR_ROLE,
  contractAddress: fleetAddress,
  targetAddress: userAddress,
})

// Send transaction (implementation depends on your setup)
// const txHash = await sendTransaction(grantTxInfo)
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the global `GOVERNOR_ROLE` can grant roles
- After granting, verify the role using `hasContractSpecificRole` method
- Contract-specific roles are scoped to individual contracts, not global
- See [Roles Overview](#roles-overview) for details on each role's permissions

### Revoke Contract-Specific Role from Address

Revoke a contract-specific role from an address for a vault (fleet contract). This removes the
address's ability to perform role-specific operations on that contract.

**Required Role:** The executing address must have the global `GOVERNOR_ROLE` to revoke roles from
other addresses.

**Parameters:**

- **chainId**: The chain where the contract (fleet) is deployed
- **role**: The contract-specific role to revoke. Available roles: `KEEPER_ROLE`, `CURATOR_ROLE` or
  `COMMANDER_ROLE`. See [Roles Overview](#roles-overview) for details.
- **contractAddress**: The target contract (e.g. Fleet / LazyVault) address
- **targetAddress**: The address (EOA or contract) to revoke the role from

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Fleet (vault) deployment address
const fleetAddress = Address.createFromEthereum({ value: '0xFLEETADDRESS...' })

// Address to revoke the role from
const userAddress = Address.createFromEthereum({ value: '0xUSERADDRESS...' })

// Revoke curator role
const revokeTxInfo = await sdk.armada.accessControl.revokeContractSpecificRole({
  chainId: ChainIds.Base,
  role: ContractSpecificRoleName.CURATOR_ROLE,
  contractAddress: fleetAddress,
  targetAddress: userAddress,
})

// Send transaction (implementation depends on your setup)
// const txHash = await sendTransaction(revokeTxInfo)
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the global `GOVERNOR_ROLE` can revoke roles
- After revoking, verify the role removal using `hasContractSpecificRole` method
- Revoking a role immediately removes associated permissions
- See [Roles Overview](#roles-overview) for details on each role's permissions

### Grant Global Role to Address

Grant a global role to a specific address. Global roles are applicable across all contracts in the
protocol.

See [Roles Overview](#roles-overview) for detailed descriptions of each role and their use cases.

**Required Role:** The executing address must have the global `GOVERNOR_ROLE` to grant other global
roles to other addresses.

**Parameters:**

- **chainId**: The chain where the protocol is deployed
- **role**: The global role to grant. Available global roles: `SUPER_KEEPER_ROLE`, `GOVERNOR_ROLE`,
  `DECAY_CONTROLLER_ROLE` or `ADMIRALS_QUARTERS_ROLE`. See [Roles Overview](#roles-overview) for
  details.
- **targetAddress**: The address (EOA or contract) to grant the role to

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { GlobalRoles } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Address to grant the Super Keeper role to
const keeperAddress = Address.createFromEthereum({ value: '0xKEEPERADDRESS...' })

const grantTxInfo = await sdk.armada.accessControl.grantGlobalRole({
  chainId: ChainIds.Base,
  role: GlobalRoles.SUPER_KEEPER_ROLE,
  targetAddress: keeperAddress,
})

// Send transaction (implementation depends on your setup)
// const txHash = await sendTransaction(grantTxInfo)
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the global `GOVERNOR_ROLE` can grant global roles
- Global roles apply globally across all contracts in the protocol
- After granting, verify the role using `hasGlobalRole` method
- See [Roles Overview](#roles-overview) for details on each role's permissions

### Revoke Global Role from Address

Revoke a global role from a specific address. This removes the address's ability to perform
role-specific operations globally across all contracts in the protocol.

**Required Role:** The executing address must have the global `GOVERNOR_ROLE` to revoke global roles
from other addresses.

**Parameters:**

- **chainId**: The chain where the protocol is deployed
- **role**: The global role to revoke. Available global roles: `SUPER_KEEPER_ROLE`, `GOVERNOR_ROLE`,
  `DECAY_CONTROLLER_ROLE` or `ADMIRALS_QUARTERS_ROLE`. See [Roles Overview](#roles-overview) for
  details.
- **targetAddress**: The address (EOA or contract) to revoke the role from

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { GlobalRoles } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Address to revoke the Super Keeper role from
const keeperAddress = Address.createFromEthereum({ value: '0xKEEPERADDRESS...' })

const revokeTxInfo = await sdk.armada.accessControl.revokeGlobalRole({
  chainId: ChainIds.Base,
  role: GlobalRoles.SUPER_KEEPER_ROLE,
  targetAddress: keeperAddress,
})

// Send transaction (implementation depends on your setup)
// const txHash = await sendTransaction(revokeTxInfo)
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the global `GOVERNOR_ROLE` can revoke global roles
- Global roles apply globally across all contracts in the protocol
- After revoking, verify the role removal using `hasGlobalRole` method
- See [Roles Overview](#roles-overview) for details on each role's permissions

## Self Managed Vaults - Whitelisting

### Check if Address is Whitelisted (Fleet Level)

Check if a specific address is whitelisted for a fleet (vault). Whitelisting controls which
addresses can deposit into a fleet.

**Parameters:**

- **chainId**: The chain where the fleet is deployed
- **fleetCommanderAddress**: The address of the FleetCommander contract (fleet address)
- **targetAddress**: The address to check whitelist status for

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { sdk } from './sdk'

const chainId = ChainIds.Base

// Fleet address
const fleetAddress = Address.createFromEthereum({
  value: '0xFLEETADDRESS...',
})

// Address to check
const userAddress = Address.createFromEthereum({
  value: '0xUSERADDRESS...',
})

const isWhitelisted = await sdk.armada.accessControl.isWhitelisted({
  chainId,
  fleetCommanderAddress: fleetAddress.value,
  targetAddress: userAddress.value,
})

console.log(`Address ${userAddress.value} is ${isWhitelisted ? '' : 'NOT '}whitelisted`)
```

**Response:**

Boolean value indicating whether the address is whitelisted.

### Set Whitelist Status (Fleet Level)

Set the whitelist status for a specific address on a fleet (vault). This controls whether the
address can deposit into the fleet.

**Required Role:** The executing address must have the global `GOVERNOR_ROLE` or the `CURATOR_ROLE`
for the specific fleet.

**Parameters:**

- **chainId**: The chain where the fleet is deployed
- **fleetCommanderAddress**: The address of the FleetCommander contract (fleet address)
- **targetAddress**: The address to set whitelist status for
- **allowed**: Boolean indicating whether to allow (true) or disallow (false) the address

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { sdk } from './sdk'

const chainId = ChainIds.Base

// Fleet address
const fleetAddress = Address.createFromEthereum({
  value: '0xFLEETADDRESS...',
})

// Address to whitelist
const userAddress = Address.createFromEthereum({
  value: '0xUSERADDRESS...',
})

// Add to whitelist
const whitelistTxInfo = await sdk.armada.accessControl.setWhitelisted({
  chainId,
  fleetCommanderAddress: fleetAddress.value,
  targetAddress: userAddress.value,
  allowed: true,
})

// Send transaction (implementation depends on your setup)
// const txHash = await sendTransaction(whitelistTxInfo)

// Remove from whitelist
const removeWhitelistTxInfo = await sdk.armada.accessControl.setWhitelisted({
  chainId,
  fleetCommanderAddress: fleetAddress.value,
  targetAddress: userAddress.value,
  allowed: false,
})
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the global `GOVERNOR_ROLE` or the `CURATOR_ROLE` for the specific fleet can
  modify whitelist status
- Changes take effect immediately upon transaction confirmation

### Batch Set Whitelist Status (Fleet Level)

Set the whitelist status for multiple addresses on a fleet (vault) in a single transaction. This is
more gas-efficient than calling `setWhitelisted` multiple times.

**Required Role:** The executing address must have the global `GOVERNOR_ROLE` or the `CURATOR_ROLE`
for the specific fleet.

**Parameters:**

- **chainId**: The chain where the fleet is deployed
- **fleetCommanderAddress**: The address of the FleetCommander contract (fleet address)
- **targetAddresses**: Array of addresses to set whitelist status for
- **allowed**: Array of boolean values indicating whether to allow (true) or disallow (false) each
  corresponding address

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

### Check if Address is Whitelisted (Admiral's Quarters Level)

Check if a specific address is whitelisted for Admiral's Quarters. Admiral's Quarters is the
protocol-level staking/rewards contract.

**Parameters:**

- **chainId**: The chain where Admiral's Quarters is deployed
- **targetAddress**: The address to check whitelist status for

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { sdk } from './sdk'

const chainId = ChainIds.Base

// Address to check
const userAddress = Address.createFromEthereum({
  value: '0xUSERADDRESS...',
})

const isWhitelisted = await sdk.armada.accessControl.isWhitelistedAQ({
  chainId,
  targetAddress: userAddress.value,
})

console.log(
  `Address ${userAddress.value} is ${isWhitelisted ? '' : 'NOT '}whitelisted for Admiral's Quarters`,
)
```

**Response:**

Boolean value indicating whether the address is whitelisted for Admiral's Quarters.

### Set Whitelist Status (Admiral's Quarters Level)

Set the whitelist status for a specific address on Admiral's Quarters. This controls whether the
address can interact with Admiral's Quarters functionality.

**Required Role:** The executing address must have the global `GOVERNOR_ROLE` or the
`ADMIRALS_QUARTERS_ROLE`.

**Parameters:**

- **chainId**: The chain where Admiral's Quarters is deployed
- **targetAddress**: The address to set whitelist status for
- **allowed**: Boolean indicating whether to allow (true) or disallow (false) the address

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { sdk } from './sdk'

const chainId = ChainIds.Base

// Address to whitelist
const userAddress = Address.createFromEthereum({
  value: '0xUSERADDRESS...',
})

// Add to whitelist
const whitelistTxInfo = await sdk.armada.accessControl.setWhitelistedAQ({
  chainId,
  targetAddress: userAddress.value,
  allowed: true,
})

// Send transaction (implementation depends on your setup)
// const txHash = await sendTransaction(whitelistTxInfo)

// Remove from whitelist
const removeWhitelistTxInfo = await sdk.armada.accessControl.setWhitelistedAQ({
  chainId,
  targetAddress: userAddress.value,
  allowed: false,
})
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the global `GOVERNOR_ROLE` or the `ADMIRALS_QUARTERS_ROLE` can modify
  Admiral's Quarters whitelist status
- **Special Case**: If `address(0)` is set to `allowed: true`, the whitelist becomes open and all
  addresses are considered allowed. This open whitelist mode works only on the Admiral's Quarters
  level.
- Changes take effect immediately upon transaction confirmation

### Batch Set Whitelist Status (Admiral's Quarters Level)

Set the whitelist status for multiple addresses on Admiral's Quarters in a single transaction. This
is more gas-efficient than calling `setWhitelistedAQ` multiple times.

**Required Role:** The executing address must have the global `GOVERNOR_ROLE` or the
`ADMIRALS_QUARTERS_ROLE`.

**Parameters:**

- **chainId**: The chain where Admiral's Quarters is deployed
- **targetAddresses**: Array of addresses to set whitelist status for
- **allowed**: Array of boolean values indicating whether to allow (true) or disallow (false) each
  corresponding address

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Including `address(0)` with `allowed: true` in the batch will enable open whitelist mode for all
  addresses

## Changelog

### v2.1.0

**First public release!**

**Features:**

- Armada Protocol - Get Fee Revenue Configuration
- Armada Protocol - Rebalance Assets Between Arks
  - Get Ark Configuration
  - Set Ark Deposit Cap
  - Set Ark Max Rebalance Outflow
  - Set Ark Max Rebalance Inflow
  - Execute Rebalance Operation
- Access Control - Check if Address Has Contract-Specific Role
- Access Control - Grant Contract-Specific Role to Address
- Access Control - Revoke Contract-Specific Role from Address
- Access Control - Grant Global Role to Address (Super Keeper)
- Access Control - Revoke Global Role from Address (Super Keeper)
