import { type IArmadaPosition } from '@summerfi/app-types'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getBackendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { rwaSupportedChainIds } from '@/app/server-handlers/subgraphs-map'
import { getRwaClientIdsForChain, isVaultDisabled } from '@/helpers/vault-custom-value-helpers'

/**
 * Fetches the wallet's claimed RWA Fleet positions (shares). These live in the institutional
 * subgraph, so they must be read through the institutional SDK ({@link getBackendInstiSDK}: Client-Id
 * + Insti-Version headers) — the public SDK returns nothing for them. The shape is the standard
 * IArmadaPosition, so these positions flow through the same portfolio pipeline as regular vault
 * positions.
 *
 * Supported networks are derived from rwaSubgraphsMap; the institutions per network are derived from
 * the fleet config's `vaultInstitutionId`. `getUserPositions` has no clientId param — it's scoped to
 * the SDK instance's `Client-Id` header — so we fetch once per (network, institution) instance.
 */
export async function getRwaUserPositions({ walletAddress }: { walletAddress: string }) {
  try {
    const systemConfig = await getCachedConfig()

    const positionsByChainAndClient = await Promise.all(
      rwaSupportedChainIds.flatMap((chainId) => {
        const chainInfo = getChainInfoByChainId(Number(chainId))

        const wallet = Wallet.createFrom({
          address: Address.createFromEthereum({
            value: walletAddress.toLowerCase(),
          }),
        })
        const user = User.createFrom({
          chainInfo,
          wallet,
        })

        // Per (network, institution) resilience: one failing must not drop the others' positions.
        // The outer catch is the last-resort safety net.
        return getRwaClientIdsForChain(chainId, systemConfig).map((clientId) =>
          getBackendInstiSDK(clientId)
            .armada.users.getUserPositions({ user })
            // Exclude positions in vaults flagged `disabled: true` in config (hidden/unused).
            .then((positions) =>
              positions.filter(
                (position) =>
                  !isVaultDisabled(position.pool.id.fleetAddress.value, chainId, systemConfig),
              ),
            )
            .catch((error: unknown) => {
              // eslint-disable-next-line no-console
              console.error(
                `getRwaUserPositions failed for chainId ${chainId} clientId ${clientId}`,
                error,
              )

              return [] as IArmadaPosition[]
            }),
        )
      }),
    )

    const positionsList = positionsByChainAndClient
      .filter(Boolean)
      .reduce<IArmadaPosition[]>((acc, positions) => [...acc, ...positions], [])

    return positionsList as IArmadaPosition[] | undefined
  } catch (error) {
    // RWA positions are additive to the portfolio — degrade gracefully (return none) rather than
    // throwing, so an institutional-subgraph hiccup never takes down the whole portfolio page.
    // eslint-disable-next-line no-console
    console.error('getRwaUserPositions failed', error)

    return [] as IArmadaPosition[]
  }
}
