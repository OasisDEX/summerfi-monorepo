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
  `grantContractSpecificRole` / `revokeContractSpecificRole` methods (see future sections)
- The same method can check other contract-specific roles by swapping the `role` value

## Changelog

### v2.1.0

**First public release!**

**Features:**

- Access Control - Check Whitelisted Addresses.
