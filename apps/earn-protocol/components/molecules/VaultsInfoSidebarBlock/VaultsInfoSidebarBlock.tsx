'use client'
import { useState } from 'react'
import { Card, Expander, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'

import blockAnalyticaLogo from '@/public/img/campaigns/block-analytica.svg'

import vaultsInfoSidebarBlockStyles from './VaultsInfoSidebarBlock.module.css'

export const VaultsInfoSidebarBlock = () => {
  const [expanded, setExpanded] = useState<'risk-type' | 'risk-management' | 'difference' | null>(
    null,
  )

  return (
    <Card variant="cardPrimarySmallPaddings" className={vaultsInfoSidebarBlockStyles.cardWrapper}>
      <Expander
        expanded={expanded === 'risk-type'}
        onExpand={() => setExpanded(expanded === 'risk-type' ? null : 'risk-type')}
        title={
          <div className={vaultsInfoSidebarBlockStyles.expanderTitleRow}>
            <Icon iconName="warning" size={16} />
            <Text variant="p2semi">Higher vs Lower risk</Text>
          </div>
        }
        expanderButtonClassName={vaultsInfoSidebarBlockStyles.expanderButton}
      >
        <div className={vaultsInfoSidebarBlockStyles.expanderContent}>
          <div className={vaultsInfoSidebarBlockStyles.expanderContentRow}>
            <Icon iconName="earn_user_activities" size={16} style={{ marginTop: '1px' }} />
            <Text variant="p3semi">
              Risk tiers reflect how a fleet&apos;s underlying yield sources operate.
            </Text>
          </div>
          <div className={vaultsInfoSidebarBlockStyles.expanderContentRow}>
            <Icon iconName="earn_user_activities" size={16} style={{ marginTop: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Text variant="p3semi">Lower Risk Vaults</Text>
              <Text variant="p3">
                Stick to single chain, non-leveraged strategies with near-instant withdrawals and
                transparent, high-quality collateral.
              </Text>
            </div>
          </div>
          <div className={vaultsInfoSidebarBlockStyles.expanderContentRow}>
            <Icon iconName="earn_user_activities" size={16} style={{ marginTop: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Text variant="p3semi">Higher Risk Vaults</Text>
              <Text variant="p3">
                May include exposure to leverage, cross-chain bridges, required token swaps, longer
                exit times, or dynamic strategy rotation. Also have less conservative caps and
                parameters to accommodate these exposures.
              </Text>
            </div>
          </div>
        </div>
      </Expander>
      <Expander
        expanded={expanded === 'risk-management'}
        onExpand={() => setExpanded(expanded === 'risk-management' ? null : 'risk-management')}
        title={
          <div className={vaultsInfoSidebarBlockStyles.expanderTitleRow}>
            <Icon iconName="cog" size={16} />
            <Text variant="p2semi">Risk Management</Text>
          </div>
        }
        expanderButtonClassName={vaultsInfoSidebarBlockStyles.expanderButton}
      >
        <div className={vaultsInfoSidebarBlockStyles.expanderContent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Image
              src={blockAnalyticaLogo}
              alt="Block Analytica Logo"
              width={100}
              height={32}
              style={{ marginBottom: '12px' }}
            />
            <Text variant="p3semi">Independent Risk Scoring by Block Analitca</Text>
            <Text variant="p3">
              Block Analitica is the exclusive risk manager of the Lazy Summer protocol. Providing
              cross protocol risk analysis for all Lazy Summer vaults.
            </Text>
            <WithArrow variant="p4semi">
              <Link
                href="https://blockanalitica.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--earn-protocol-primary-100)' }}
              >
                <Text variant="p4semi">Learn about Block Analitica</Text>
              </Link>
            </WithArrow>
          </div>
          <div className={vaultsInfoSidebarBlockStyles.expanderContentRow}>
            <Icon iconName="earn_user_activities" size={16} style={{ marginTop: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text variant="p3semi">Active risk management</Text>
              <Text variant="p3">
                Block Analytica provides active 24/7 risk monitoring for Lazy Summer Prime Vaults.
                Responsible for setting allocation caps in real time.
              </Text>
              <WithArrow variant="p4semi">
                <Link
                  href="https://blockanalitica.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--earn-protocol-primary-100)' }}
                >
                  <Text variant="p4semi">View prime vault framework</Text>
                </Link>
              </WithArrow>
            </div>
          </div>
          <div className={vaultsInfoSidebarBlockStyles.expanderContentRow}>
            <Icon iconName="earn_user_activities" size={16} style={{ marginTop: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text variant="p3semi">Risk framework</Text>
              <Text variant="p3">
                In addition to real time risk monitoring for Lazy Summer prime vaults. Block
                Analitca developed the risk framework for Alpha vaults, which are governed by Lazy
                Summer DAO.
              </Text>
              <WithArrow variant="p4semi">
                <Link
                  href="https://blockanalitica.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--earn-protocol-primary-100)' }}
                >
                  <Text variant="p4semi">View Alpha vault risk framework</Text>
                </Link>
              </WithArrow>
            </div>
          </div>
        </div>
      </Expander>
      <Expander
        expanded={expanded === 'difference'}
        onExpand={() => setExpanded(expanded === 'difference' ? null : 'difference')}
        title={
          <div className={vaultsInfoSidebarBlockStyles.expanderTitleRow}>
            <Icon iconName="warning" size={16} />
            <Text variant="p2semi">Risk-Managed by Block Analitica vs DAO Risk-Managed</Text>
          </div>
        }
        expanderButtonClassName={vaultsInfoSidebarBlockStyles.expanderButton}
      >
        <div className={vaultsInfoSidebarBlockStyles.expanderContent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Image
              src={blockAnalyticaLogo}
              alt="Block Analytica Logo"
              width={100}
              height={32}
              style={{ marginBottom: '12px' }}
            />
            <Text variant="p3semi">
              What is the difference between Risk-Managed By Block Analitica & DAO Risk-Managed
            </Text>
            <Text variant="p3">
              The key difference between{' '}
              <Text as="span" variant="p3semi">
                Risk-Managed By Block Analitica
              </Text>{' '}
              and{' '}
              <Text as="span" variant="p3semi">
                DAO Risk-Managed
              </Text>{' '}
              vaults are their approaches to risk.{' '}
              <Text as="span" variant="p3semi">
                Risk-Managed By Block Analitica
              </Text>{' '}
              are more conservative.{' '}
              <Text as="span" variant="p3semi">
                DAO Risk-Managed
              </Text>{' '}
              vaults are more risk seeking, prioritizing a higher risk/reward ratio.
            </Text>
          </div>
          <div className={vaultsInfoSidebarBlockStyles.expanderContentRow}>
            <Icon iconName="earn_yield_trend" size={16} style={{ marginTop: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text variant="p3semi">Risk-Managed By Block Analitica</Text>
              <Text variant="p3">
                <Text as="span" variant="p3semi">
                  Risk-Managed By Block Analitica
                </Text>{' '}
                has an active approach to risk, constantly monitoring and adjusting risk parameters,
                and adapting to market conditions.
              </Text>
              <WithArrow variant="p4semi">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--earn-protocol-primary-100)' }}
                >
                  <Text variant="p4semi">Learn more about Prime vaults</Text>
                </Link>
              </WithArrow>
            </div>
          </div>
          <div className={vaultsInfoSidebarBlockStyles.expanderContentRow}>
            <Icon iconName="earn_rebalance_activities" size={16} style={{ marginTop: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text variant="p3semi">DAO Risk-Managed</Text>
              <Text variant="p3">
                <Text as="span" variant="p3semi">
                  DAO Risk-Managed
                </Text>{' '}
                vaults have a more passive approach to risk, simply accepting or rejecting yield
                sources based on a predefined framework. They also allow for more concentrated
                exposure to yield sources.
              </Text>
              <WithArrow variant="p4semi">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--earn-protocol-primary-100)' }}
                >
                  <Text variant="p4semi">View Alpha vault risk framework</Text>
                </Link>
              </WithArrow>
            </div>
          </div>
        </div>
      </Expander>
    </Card>
  )
}
