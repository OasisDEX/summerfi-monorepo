---
description:
  Read a user's balance in RWA (rounds-based) vaults — settled position, pending and claimable
  receipts — and work with rounds directly.
---

# RWA Vaults

> Applies to `@summer_fi/sdk-client` v2.3.0

RWA (real-world-asset) vaults settle deposits and withdrawals in **rounds** instead of instantly.
Two auxiliary RoundsVault contracts sit in front of the Fleet: the **Input vault** accepts the
underlying asset (e.g. USDC) and issues Fleet shares on settlement, and the **Output vault** accepts
Fleet shares and returns the underlying asset. Between a request and its settlement, a user's money
is represented by per-round **receipts** rather than by their Fleet position.

A user's real balance is therefore spread across three pools:

1. the **settled Fleet position** (what a regular position query shows),
2. **Input-vault receipts** — deposits pending settlement, plus settled-but-unclaimed deposits,
3. **Output-vault receipts** — withdrawals pending settlement.

## Setup

RWA vaults are served by the institutional SDK client
([`makeInstiSdk`](../reference/@summerfi/sdk-client/functions/makeInstiSdk.md)), not the standard
`makeSDK` — the `rwa` namespace lives on the institutional manager
([`SDKAdminManager`](../reference/@summerfi/sdk-client/classes/SDKAdminManager.md)). The `clientId`
identifies the institution (it is sent as the `Client-Id` header), and `instiVersion` defaults to
`'v2'` (the RWA / institutions-v2 deployment).

```typescript
import { makeInstiSdk } from '@summer_fi/sdk-client'

const sdk = makeInstiSdk({
  apiDomainUrl: 'https://summer.fi',
  clientId: 'YourInstitutionClientId',
})
```

## Get a user's total balance (exposure)

`getUserVaultExposure` stitches the three pools into a single
[`IRwaUserVaultExposure`](../reference/@summerfi/sdk-client/interfaces/IRwaUserVaultExposure.md)
result, denominated in the Fleet input asset:

```typescript
import { ChainIds } from '@summer_fi/sdk-client'

const exposure = await sdk.rwa.getUserVaultExposure({
  chainId: ChainIds.Base,
  fleetAddress: '0x...', // the Fleet (vault) address
  userAddress: '0x...',
})

console.log({
  total: exposure.total.toString(), // sum of the four components below
  totalUsd: exposure.totalUsd.toString(),

  settledPosition: exposure.settledPosition.toString(), // settled Fleet balance
  pendingDeposits: exposure.pendingDeposits.toString(), // deposits awaiting settlement
  claimableDeposits: exposure.claimableDeposits.toString(), // settled, not yet claimed
  pendingWithdrawals: exposure.pendingWithdrawals.toString(), // withdrawals awaiting settlement
})
```

`total = settledPosition + pendingDeposits + claimableDeposits + pendingWithdrawals`.

Two things worth understanding about the model:

- **`claimableDeposits` is a genuine additive term.** Once a deposit round settles, the resulting
  Fleet shares are held by the Input RoundsVault until the user claims them — so they are **not**
  part of `settledPosition`. Skipping this component undercounts users who have not claimed yet.
- **Claimable withdrawals are intentionally excluded.** A settled, unredeemed withdrawal is payable
  in the underlying asset and no longer exposed to the vault, so it does not count toward exposure.
- Withdrawal receipts are share-denominated on-chain; the SDK converts them to the input asset using
  the vault `pricePerShare`.

## Read raw receipts

If you need the per-round breakdown instead of the stitched total, query receipt balances for each
RoundsVault side directly. Each receipt is an ERC-1155 balance keyed by round ID:

```typescript
import { ChainIds, RoundsVaultType } from '@summer_fi/sdk-client'

const common = {
  chainId: ChainIds.Base,
  fleetAddress: '0x...',
  accountAddress: '0x...',
}

// deposit receipts (denominated in the input asset, e.g. USDC)
const depositReceipts = await sdk.rwa.getReceiptBalances({
  ...common,
  vaultType: RoundsVaultType.Input,
})

// withdrawal receipts (denominated in Fleet shares)
const withdrawalReceipts = await sdk.rwa.getReceiptBalances({
  ...common,
  vaultType: RoundsVaultType.Output,
})

// [{ roundId: 3n, balance: 1000000n }, ...]
```

To interpret a receipt you usually also want the round's status and its settlement price:

```typescript
const roundState = await sdk.rwa.getRoundState({
  chainId: ChainIds.Base,
  fleetAddress: '0x...',
  roundId: 3n,
  vaultType: RoundsVaultType.Input,
}) // NotOpened | Opened | InSettlement | Settled

const rate = await sdk.rwa.getExchangeRate({
  chainId: ChainIds.Base,
  fleetAddress: '0x...',
  roundId: 3n,
  vaultType: RoundsVaultType.Input,
}) // settlement price for the round
```

A receipt in a **settled** Input round is claimable via `getClaimSharesTx`; a receipt in a
**settled** Output round is redeemable via `getClaimAssetsTx`. Receipts in non-settled rounds can be
cancelled with `getCancelRoundDepositTx` where the vault allows it.

## Related reads

- [`getVaultMarketValue`](../reference/@summerfi/sdk-client/interfaces/IRwaVaultMarketValue.md) —
  vault-level NAV/market value.
- `getCurrentRound` — the currently open round for a vault side.
- The full RWA client surface (deposits, claims, round lifecycle, roles, whitelist) is documented on
  [`IRwaManagerClient`](../reference/@summerfi/sdk-client/interfaces/IRwaManagerClient.md).
