import {
  Expander,
  getVaultDetailsUrl,
  subgraphNetworkToId,
  Text,
  VaultGridPreview,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import Link from 'next/link'

import { getVaultDetails } from '@/app/server-handlers/sdk/getVaultDetails'
import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'
import FormContainer from '@/components/organisms/Form/FormContainer'
import {
  RebalancingActivity,
  type RebalancingActivityRawData,
} from '@/components/organisms/RebalancingActivity/RebalancingActivity'
import {
  UserActivity,
  type UserActivityRawData,
} from '@/components/organisms/UserActivity/UserActivity'
import {
  VaultExposure,
  type VaultExposureRawData,
} from '@/components/organisms/VaultExposure/VaultExposure'
import type { FleetConfig } from '@/helpers/sdk/types'

type EarnVaultOpenManagePageProps = {
  params: {
    vaultId: string
    network: SDKNetwork
  }
}

const fleetConfig: FleetConfig = {
  tokenSymbol: 'USDC',
  fleetAddress: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
}

const vaultExposureRawData: VaultExposureRawData[] = [
  {
    vault: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Fixed yield',
  },
  {
    vault: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Isolated landing',
  },
  {
    vault: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Lending',
  },
  {
    vault: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Basic Trading',
  },
]

const rebalancingActivityRawData: RebalancingActivityRawData[] = [
  {
    type: 'reduce',
    action: {
      from: 'USDC',
      to: 'DAI',
    },
    amount: {
      token: 'USDC',
      value: '123123',
    },
    timestamp: '12321321',
    provider: {
      link: '/',
      label: 'Summer.fi',
    },
  },
  {
    type: 'increase',
    action: {
      from: 'USDT',
      to: 'USDC',
    },
    amount: {
      token: 'USDT',
      value: '123123',
    },
    timestamp: '1727385013506',
    provider: {
      link: '/',
      label: 'Summer.fi',
    },
  },
]

const userActivityRawData: UserActivityRawData[] = [
  {
    balance: '120000',
    amount: '123123',
    numberOfDeposits: '13',
    time: '1727385013506',
    earningStreak: {
      link: '/',
      label: 'View',
    },
  },
  {
    balance: '1420000',
    amount: '321321',
    numberOfDeposits: '9',
    time: '1727585013506',
    earningStreak: {
      link: '/',
      label: 'View',
    },
  },
]

const detailsLinks = [
  {
    label: 'How it all works',
    id: 'how-it-works',
  },
  {
    label: 'Advanced yield data',
    id: 'advanced-yield-data',
  },
  {
    label: 'Yield sources',
    id: 'yield-sources',
  },
  {
    label: 'Security',
    id: 'security',
  },
  {
    label: 'FAQ',
    id: 'faq',
  },
]

export const revalidate = 60

const EarnVaultOpenManagePage = async ({ params }: EarnVaultOpenManagePageProps) => {
  const networkId = subgraphNetworkToId(params.network)

  const [selectedVault, { vaults }] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      chainId: networkId,
    }),
    getVaultsList(),
  ])

  if (!selectedVault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {params.network}
      </Text>
    )
  }

  return (
    <VaultGridPreview
      vault={selectedVault}
      vaults={vaults}
      leftContent={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-x-large)',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-space-medium)',
            }}
          >
            <Text variant="h5">About the vault</Text>
            <Text
              variant="p2"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              The Summer Earn Protocol is a permissionless passive lending product, which sets out
              to offer effortless and secure optimised yield, while diversifying risk.
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                gap: 'var(--general-space-24)',
              }}
            >
              {detailsLinks.map(({ label, id }) => (
                <Link key={label} href={`${getVaultDetailsUrl(selectedVault)}#${id}`}>
                  <Text
                    as="p"
                    variant="p3semi"
                    style={{
                      color: 'var(--color-text-link)',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      paddingRight: 'var(--spacing-space-medium)',
                    }}
                  >
                    <WithArrow>{label}</WithArrow>
                  </Text>
                </Link>
              ))}
            </div>
          </div>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Historical yield
              </Text>
            }
            defaultExpanded
          >
            <MockedLineChart />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Vault exposure
              </Text>
            }
            defaultExpanded
          >
            <VaultExposure rawData={vaultExposureRawData} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Rebalancing activity
              </Text>
            }
            defaultExpanded
          >
            <RebalancingActivity rawData={rebalancingActivityRawData} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                User activity
              </Text>
            }
            defaultExpanded
          >
            <UserActivity rawData={userActivityRawData} />
          </Expander>
        </div>
      }
      rightContent={
        <FormContainer
          fleetConfig={fleetConfig}
          selectedVaultData={selectedVault}
          vaultsList={vaults}
        />
      }
    />
  )
}

export default EarnVaultOpenManagePage
