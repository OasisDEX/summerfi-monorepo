import { EXTERNAL_LINKS, INTERNAL_LINKS, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

export const sumrFaqData = [
  {
    title: 'What is the $SUMR token airdrop?',
    content: (
      <>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          $SUMR is the token that powers DeFi’s best yield optimizer.
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          It ($SUMR) is the native token of the Lazy Summer Protocol, a new yield optimizer protocol
          that gives anyone effortless access to crypto’s best DeFi yields, continually rebalanced
          by AI powered Keepers.
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          $SUMR can be earned by depositing in the protocol, or by staking it in the protocol to
          delegate voting power.
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          $SUMR plays a critical role in the Lazy Summer Protocol ecosystem, giving holders and
          delegates the power to:
        </Text>
        <ul style={{ listStyleType: 'disc', paddingLeft: '32px' }}>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Curate the best of DeFi</strong> by approving or off boarding markets,
              ensuring only the best and safest yield opportunities are available.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Keep contributors accountable</strong> by monitoring and holding third-party
              contributors (Risk Curators) accountable, ensuring consistent, responsible protocol
              management.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Allocate Protocol Capital</strong> by Deciding on how to spend revenue,
              allocate $SUMR token rewards and issue grants to balance growth with long term
              sustainability.
            </Text>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Who qualifies for the $SUMR token airdrop? ',
    content: (
      <>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          Upon token launch, only{' '}
          <Link
            href={`${EXTERNAL_LINKS.KB.READ_ABOUT_RAYS}`}
            style={{ color: 'var(--earn-protocol-primary-100)' }}
            target="_blank"
          >
            $RAYS
          </Link>{' '}
          users will be eligible for the $SUMR token airdrop.
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          Although, as soon as Lazy Summer Protocol launches, anyone will be eligible to deposit
          into the protocol and earn $SUMR.
        </Text>{' '}
        <Text as="p" variant="p2" style={{}}>
          The protocol will be launching two weeks after the $SUMR airdrop, and users can get ready
          at{' '}
          <Link
            href={`${INTERNAL_LINKS.summerLazy}/earn/sumr`}
            style={{ color: 'var(--earn-protocol-primary-100)' }}
          >
            summer.fi
          </Link>
        </Text>
      </>
    ),
  },
  {
    title: 'When will the $SUMR tokens start trading?',
    content: (
      <>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          It is critical to attract users and protocol contributors aligned with the long-term
          vision of the Lazy Summer.
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          To support this goal, $SUMR will initially be non-transferable, meaning it cannot be
          swapped for other assets.
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          This approach ensures:
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          $SUMR plays a critical role in the Lazy Summer Protocol ecosystem, giving holders and
          delegates the power to:
        </Text>
        <ol style={{ listStyleType: 'decimals', paddingLeft: '32px' }}>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Incentive-aligned users and contributors have the opportunity to accumulate $SUMR
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Users and contributors remain focused on long-term value creation.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              The protocol discourages mercenary participants and mitigates predatory or uneconomic
              behaviours.
            </Text>
          </li>
        </ol>
        <Text
          as="p"
          variant="p2"
          style={{
            marginTop: 'var(--general-space-12)',
          }}
        >
          After six months of being live, $SUMR’s transferability will be subject to a governance
          vote. If approved, the token will become transferable and freely tradeable with a
          mark-to-market price. This rewards early users and contributors who demonstrated patience
          by accumulating $SUMR without immediate liquidity.
        </Text>
      </>
    ),
  },
  {
    title: 'Will the $RAYS points campaign continue?',
    content: (
      <>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          The{' '}
          <Link
            href={`${EXTERNAL_LINKS.KB.READ_ABOUT_RAYS}`}
            style={{ color: 'var(--earn-protocol-primary-100)' }}
            target="_blank"
          >
            $RAYS
          </Link>{' '}
          campaign will now have seasons, with season 1 concluding on the airdrop of $SUMR, January
          29 2025.
        </Text>
        <Text as="p" variant="p2" style={{}}>
          Season 2 will commence on January 30 2025, where eligible $RAYS position types on
          Summer.fi Pro will accrue $RAYS, that will be claimable for $SUMR. $RAYS Season 2
          conclusion date is to be announced.
        </Text>
      </>
    ),
  },
]
