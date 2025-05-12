import { type RaysApiResponse } from '@summerfi/app-types'
import { Card, EXTERNAL_LINKS, Icon, Text, Tooltip } from '@summerfi/app-ui'
import Link from 'next/link'

import criteriaListStyles from '@/components/molecules/CriteriaList/CriteriaList.module.css'

interface CriteriaListProps {
  userRays:
    | {
        rays: RaysApiResponse
        error?: undefined
      }
    | {
        error: unknown
        rays?: undefined
      }
    | null
}

const getCriteriaItems = ({ userTypes }: { userTypes?: RaysApiResponse['userTypes'] }) => [
  {
    title: 'Active Ethereum wallet',
    tooltip: {
      title: 'Active Ethereum wallet',
      description:
        'Have a non-custodial wallet with at least 0.2 ETH on Mainnet, ARB, OP or Base and at least 5 transactions',
    },
    post: '$',
    done: !!userTypes?.includes('General Ethereum User'),
  },
  {
    title: 'Active DeFi user',
    tooltip: {
      title: 'Active DeFi user',
      description: 'Currently active position on June 18th on a supported protocol and network',
    },
    post: '$$',
    done: !!userTypes?.includes('DeFi User'),
  },
  {
    title: 'Summer.fi user',
    tooltip: {
      title: 'Summer.fi user',
      description: 'Performed a transaction on Summer.fi since June 2021',
    },
    post: '$$$',
    done: !!userTypes?.includes('SummerFi User'),
  },
  {
    title: 'Summer.fi power user',
    tooltip: {
      title: 'Summer.fi power user',
      description:
        'Performed a Multiply or Yield Loop Transaction, used migrate or refinance, or enabled automation',
    },
    post: '$$$$',
    done: !!userTypes?.includes('SummerFi Power User'),
  },
]

export const CriteriaList = ({ userRays }: CriteriaListProps) => {
  return (
    <div className={criteriaListStyles.wrapper}>
      <Card variant="cardDark">
        <div className={criteriaListStyles.cardContent}>
          <Text as="h5" variant="h5">
            Criteria
          </Text>
          <ul>
            {getCriteriaItems({ userTypes: userRays?.rays?.userTypes }).map((item) => (
              <li key={item.title} className={criteriaListStyles.listItem}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      marginRight: '18px',
                      paddingBottom: 'var(--space-xxs)',
                    }}
                  >
                    <Icon
                      iconName="checkmark_colorful"
                      size={item.done ? 20 : 15}
                      style={item.done ? { opacity: 1 } : { opacity: 0.3 }}
                    />
                  </div>
                  <Text as="p" variant="p2" style={{ marginRight: 'var(--space-xs)' }}>
                    {item.title}
                  </Text>
                  <Tooltip
                    tooltip={
                      <div className={criteriaListStyles.tooltipWrapper}>
                        <Text as="p" variant="p2semi" style={{ color: 'var(--color-primary-100' }}>
                          {item.tooltip.title}
                        </Text>
                        <Text as="p" variant="p2">
                          {item.tooltip.description}
                        </Text>
                      </div>
                    }
                    style={{ color: 'var(--color-primary-60' }}
                    tooltipWrapperStyles={{ minWidth: '300px' }}
                  >
                    <Icon iconName="tooltip" size={17} color="gray" />
                  </Tooltip>
                </div>
                <Text
                  as="p"
                  variant={item.done ? 'p3semiColorful' : 'p3'}
                  style={{ letterSpacing: 'var(--space-xxs)', color: 'var(--color-neutral-80)' }}
                >
                  {item.post}
                </Text>
              </li>
            ))}
          </ul>
          <Text as="p" variant="p3semi">
            <Link href={EXTERNAL_LINKS.KB.READ_ABOUT_RAYS} target="_blank">
              Read about Rays →
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}
