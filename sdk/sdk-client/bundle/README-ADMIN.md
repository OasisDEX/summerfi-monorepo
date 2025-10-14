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

### Rebalance Assets Between Arks

Rebalances assets between arks (yield sources) in a fleet. This operation moves funds from one ark
to another to optimize yield or manage risk. The keeper must ensure proper configuration limits are
set before executing a rebalance.

**Required Role:** The executing address must have the `KEEPER_ROLE` contract-specific role for the
target fleet (FleetCommander contract), or the `SUPER_KEEPER_ROLE` general role which allows keeper
operations on any fleet.

This flow includes:

1. Fetching ark configurations to check limits
2. Setting required limits (maxRebalanceOutflow, maxRebalanceInflow, depositCap) if needed
3. Executing the rebalance operation

**Parameters:**

- **vaultId**: The ID of the vault (fleet) to rebalance
- **rebalanceData**: Array of rebalance operations, each containing:
  - **fromArk**: The ark address to withdraw funds from
  - **toArk**: The ark address to deposit funds to
  - **amount**: The amount of tokens to move (as TokenAmount)

**Example:**

```typescript
import { Address, ArmadaVaultId, getChainInfoByChainId, TokenAmount } from '@summer_fi/sdk-client'
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

Please refer to the TransactionInfo structure in the main SDK documentation.

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

### Access Control - Check Whitelisted Addresses

Check if a given address is whitelisted for a specific vault (fleet contract) by verifying it holds
the `WHITELISTED_ROLE` (a contract-specific role).

This is useful for frontends or operational scripts that need to gate deposit and withdrawal actions
behind allowlists.

**Parameters:**

- **chainId**: The chain where the contract (fleet) is deployed
- **role**: The contract-specific role to check. Use `ContractSpecificRoleName.WHITELISTED_ROLE` for
  whitelist checks
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

const hasWhitelistRole = await sdk.armada.accessControl.hasContractSpecificRole({
  chainId: ChainIds.Base,
  role: ContractSpecificRoleName.WHITELISTED_ROLE,
  contractAddress: fleetAddress,
  targetAddress: userAddress,
})

console.log(
  `Address ${userAddress.value} ${hasWhitelistRole ? 'IS' : 'is NOT'} whitelisted for fleet ${fleetAddress.value}`,
)
```

**Response:**

Returns a boolean value indicating whether the target address has the specified role.

```json
true
```

**Notes:**

- Roles are managed by governor; if you need to add/remove addresses use the corresponding
  `grantContractSpecificRole` / `revokeContractSpecificRole` methods (see sections below)
- The same method can check other contract-specific roles by swapping the `role` value

### Access Control - Grant Whitelisted Role

Grant the whitelisted role to a specific address for a vault (fleet contract). This allows the
address to perform deposits and withdrawals on a whitelisted fleet.

**Required Role:** The executing address must have the `GOVERNOR_ROLE` to grant roles to other
addresses.

**Parameters:**

- **chainId**: The chain where the contract (fleet) is deployed
- **role**: The contract-specific role to grant. Use `ContractSpecificRoleName.WHITELISTED_ROLE` for
  whitelist grants
- **contractAddress**: The target contract (e.g. Fleet / LazyVault) address
- **targetAddress**: The address (EOA or contract) to grant the role to

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Fleet (vault) deployment address
const fleetAddress = Address.createFromEthereum({ value: '0xFLEETADDRESS...' })

// Address to grant the whitelisted role to
const userAddress = Address.createFromEthereum({ value: '0xUSERADDRESS...' })

const grantTxInfo = await sdk.armada.accessControl.grantContractSpecificRole({
  chainId: ChainIds.Base,
  role: ContractSpecificRoleName.WHITELISTED_ROLE,
  contractAddress: fleetAddress,
  targetAddress: userAddress,
})

// Send transaction (implementation depends on your setup)
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the general `GOVERNOR_ROLE` can grant roles
- After granting, you can verify the role using `hasContractSpecificRole` method
- The same method can grant other contract-specific roles (KEEPER_ROLE, CURATOR_ROLE, etc.) by
  changing the `role` parameter

### Access Control - Revoke Whitelisted Role

Revoke the whitelisted role from a specific address for a vault (fleet contract). This removes the
address's ability to perform deposits and withdrawals on a whitelisted fleet.

**Required Role:** The executing address must have the `GOVERNOR_ROLE` to revoke roles from other
addresses.

**Parameters:**

- **chainId**: The chain where the contract (fleet) is deployed
- **role**: The contract-specific role to revoke. Use `ContractSpecificRoleName.WHITELISTED_ROLE`
  for whitelist revocations
- **contractAddress**: The target contract (e.g. Fleet / LazyVault) address
- **targetAddress**: The address (EOA or contract) to revoke the role from

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { ContractSpecificRoleName } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Fleet (vault) deployment address
const fleetAddress = Address.createFromEthereum({ value: '0xFLEETADDRESS...' })

// Address to revoke the whitelisted role from
const userAddress = Address.createFromEthereum({ value: '0xUSERADDRESS...' })

const revokeTxInfo = await sdk.armada.accessControl.revokeContractSpecificRole({
  chainId: ChainIds.Base,
  role: ContractSpecificRoleName.WHITELISTED_ROLE,
  contractAddress: fleetAddress,
  targetAddress: userAddress,
})

// Send transaction (implementation depends on your setup)
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the general `GOVERNOR_ROLE` can revoke roles
- After revoking, you can verify the role removal using `hasContractSpecificRole` method
- The same method can revoke other contract-specific roles by changing the `role` parameter

### Access Control - Grant Super Keeper Role

Grant the Super Keeper role to a specific address. The Super Keeper role is a general (global) role
that allows the address to perform keeper operations on any fleet without needing fleet-specific
KEEPER_ROLE grants.

**Required Role:** The executing address must have the general `GOVERNOR_ROLE` to grant general
roles to other addresses.

**Parameters:**

- **chainId**: The chain where the protocol is deployed
- **role**: The general role to grant. Use `GeneralRoles.SUPER_KEEPER_ROLE` for super keeper grants
- **targetAddress**: The address (EOA or contract) to grant the role to

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { GeneralRoles } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Address to grant the Super Keeper role to
const keeperAddress = Address.createFromEthereum({ value: '0xKEEPERADDRESS...' })

const grantTxInfo = await sdk.armada.accessControl.grantGeneralRole({
  chainId: ChainIds.Base,
  role: GeneralRoles.SUPER_KEEPER_ROLE,
  targetAddress: keeperAddress,
})

// Send transaction (implementation depends on your setup)
// const txHash = await sendTransaction(grantTxInfo)
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the general `GOVERNOR_ROLE` can grant general roles
- Super Keeper role allows performing keeper operations (like rebalancing) on any fleet globally
- After granting, you can verify the role using `hasGeneralRole` method
- Other general roles that can be granted: `GOVERNOR_ROLE`, `DECAY_CONTROLLER_ROLE`,
  `ADMIRALS_QUARTERS_ROLE`

### Access Control - Revoke Super Keeper Role

Revoke the Super Keeper role from a specific address. This removes the address's ability to perform
keeper operations globally across all fleets.

**Required Role:** The executing address must have the general `GOVERNOR_ROLE` to revoke general
roles from other addresses.

**Parameters:**

- **chainId**: The chain where the protocol is deployed
- **role**: The general role to revoke. Use `GeneralRoles.SUPER_KEEPER_ROLE` for super keeper
  revocations
- **targetAddress**: The address (EOA or contract) to revoke the role from

**Example:**

```typescript
import { ChainIds, Address } from '@summer_fi/sdk-client'
import { GeneralRoles } from '@summerfi/armada-protocol-common'
import { sdk } from './sdk'

// Address to revoke the Super Keeper role from
const keeperAddress = Address.createFromEthereum({ value: '0xKEEPERADDRESS...' })

const revokeTxInfo = await sdk.armada.accessControl.revokeGeneralRole({
  chainId: ChainIds.Base,
  role: GeneralRoles.SUPER_KEEPER_ROLE,
  targetAddress: keeperAddress,
})

// Send transaction (implementation depends on your setup)
// const txHash = await sendTransaction(revokeTxInfo)
```

**Response (TransactionInfo):**

Refer to the TransactionInfo structure in the main SDK documentation.

**Notes:**

- Only addresses with the general `GOVERNOR_ROLE` can revoke general roles
- After revoking, you can verify the role removal using `hasGeneralRole` method
- The same method can revoke other general roles by changing the `role` parameter

## Changelog

### v2.1.0

**First public release!**

**Features:**

- Armada Protocol - Rebalance Assets Between Arks
  - Get Ark Configuration
  - Set Ark Deposit Cap
  - Set Ark Max Rebalance Outflow
  - Set Ark Max Rebalance Inflow
  - Execute Rebalance Operation
- Access Control - Check Whitelisted Addresses
- Access Control - Grant Whitelisted Role
- Access Control - Revoke Whitelisted Role
- Access Control - Grant Super Keeper Role
- Access Control - Revoke Super Keeper Role
