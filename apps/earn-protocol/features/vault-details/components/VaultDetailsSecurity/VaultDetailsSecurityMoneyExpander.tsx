import { type FC } from 'react'
import {
  Card,
  Expander,
  getScannerAddressUrl,
  Icon,
  Text,
  Tooltip,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import Link from 'next/link'

import { getProtocolLabel } from '@/helpers/get-protocol-label'

const whitelistedActorsLinks = [{ title: 'BlockAnalytica ', link: 'https://blockanalytica.com/' }]

type VaultDetailsSecurityMoneyExpanderProps = {
  vault: SDKVaultishType
}

export const VaultDetailsSecurityMoneyExpander: FC<VaultDetailsSecurityMoneyExpanderProps> = ({
  vault,
}) => {
  const arkLinks = vault.arks.map((ark) => {
    const protocol = ark.name?.split('-') ?? []
    const label = getProtocolLabel(protocol)

    return {
      title: label,
      link: getScannerAddressUrl(subgraphNetworkToSDKId(vault.protocol.network), ark.id),
    }
  })

  return (
    <Card>
      <Expander
        title={
          <Text as="p" variant="p1semi">
            Where is your money going?
          </Text>
        }
      >
        <Text
          as="p"
          variant="p2"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginTop: 'var(--spacing-space-medium)',
            marginBottom: 'var(--spacing-space-x-large)',
          }}
        >
          Your money will be routed and continuously rebalanced by the Summer Protocol smart
          contract. Once routed or rebalanced, your money will be held in smart contracts of the
          curated protocols and strategies selected for this strategy.
        </Text>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 'var(--spacing-space-medium)',
            gap: 'var(--spacing-space-x-small)',
          }}
        >
          <Text as="p" variant="p2semi">
            Verifiable smart contract code
          </Text>
          <Tooltip
            tooltip={
              <Text as="p" variant="p4semi">
                Source code that can be publicly verified to match the deployed contract on the
                blockchain, ensuring transparency and security.
              </Text>
            }
            tooltipWrapperStyles={{ minWidth: '260px' }}
          >
            <Icon iconName="question_o" variant="xs" color="rgba(255, 251, 253, 1)" />
          </Tooltip>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-x-small)',
            width: 'fit-content',
          }}
        >
          {arkLinks.map((item) => (
            <Link href={item.link} key={item.title}>
              <WithArrow
                as="p"
                variant="p3semi"
                style={{ color: 'var(--earn-protocol-primary-100)' }}
              >
                {item.title} Smart Contract
              </WithArrow>
            </Link>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 'var(--spacing-space-medium)',
            marginTop: 'var(--spacing-space-large)',
            gap: 'var(--spacing-space-x-small)',
          }}
        >
          <Text as="p" variant="p2semi">
            Whitelisted Actors
          </Text>
          <Tooltip
            tooltip={
              <Text as="p" variant="p4semi">
                Whitelist actors are entities with special permissions or access granted after
                approval.
              </Text>
            }
            tooltipWrapperStyles={{ minWidth: '260px' }}
          >
            <Icon iconName="question_o" variant="xs" color="rgba(255, 251, 253, 1)" />
          </Tooltip>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-x-small)',
            width: 'fit-content',
          }}
        >
          {whitelistedActorsLinks.map((item) => (
            <Link href={item.link} key={item.title}>
              <WithArrow
                as="p"
                variant="p3semi"
                style={{ color: 'var(--earn-protocol-primary-100)' }}
              >
                {item.title}
              </WithArrow>
            </Link>
          ))}
        </div>
      </Expander>
    </Card>
  )
}
