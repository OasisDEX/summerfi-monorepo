import { type FC } from 'react'
import { Button, Card, Icon, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { UnstakeVaultTokenContent } from '@/features/unstake-vault-token/components/UnstakeVaultTokenContent/UnstakeVaultTokenContent'
import {
  type UnstakeVaultTokenBalance,
  type UnstakeVaultTokenState,
  UnstakeVaultTokenStep,
} from '@/features/unstake-vault-token/types'

import { whatAreVaultTokensList } from './consts'
import { getUnstakeVaultTokenInfoButtonLabel, getUnstakeVaultTokenInfoLabel } from './helpers'

import classNames from './UnstakeVaultTokenInfo.module.css'

interface UnstakeVaultTokenInfoProps {
  state: UnstakeVaultTokenState
  handleTx: () => Promise<void>
  balance: UnstakeVaultTokenBalance
  isOwner: boolean
  isOnCorrectChain: boolean
}

export const UnstakeVaultTokenInfo: FC<UnstakeVaultTokenInfoProps> = ({
  state,
  balance,
  handleTx,
  isOwner,
  isOnCorrectChain,
}) => {
  const resolvedAmount = balance.amount ? parseFloat(balance.amount) : 0
  const usdValue = state.vaultTokenPrice ? state.vaultTokenPrice * resolvedAmount : undefined

  return (
    <UnstakeVaultTokenContent>
      <div className={classNames.unstakeVaultTokenInfoWrapper}>
        <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          {getUnstakeVaultTokenInfoLabel({ state, balance })}
        </Text>
        <div className={classNames.iconTextWrapper}>
          {state.vaultToken && <Icon tokenName={state.vaultToken} size={24} />}
          <Text as="p" variant="p1semi">
            {formatCryptoBalance(resolvedAmount)} {balance.token?.symbol}
          </Text>
        </div>
        {usdValue && (
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            ${formatFiatBalance(usdValue)}
          </Text>
        )}
        {state.step !== UnstakeVaultTokenStep.COMPLETED && (
          <Button
            variant="primaryMedium"
            onClick={handleTx}
            className={classNames.actionButton}
            disabled={state.step === UnstakeVaultTokenStep.PENDING || !isOwner}
          >
            {getUnstakeVaultTokenInfoButtonLabel({ state, isOnCorrectChain })}
          </Button>
        )}
        {state.step === UnstakeVaultTokenStep.INIT && (
          <Card variant="cardPrimary" className={classNames.whatAreVaultTokensWrapper}>
            <div className={classNames.title}>
              <Icon iconName="info" size={24} />
              <Text as="p" variant="p3semi">
                What are vault tokens
              </Text>
            </div>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-70)' }}>
              Lazy Summer vault tokens are a yield bearing tokenized version of your Lazy Summer
              position that unlocks unique benefits.
            </Text>
            <ul className={classNames.list}>
              {whatAreVaultTokensList.map((item) => (
                <li key={item.id} className={classNames.listItem}>
                  <Icon iconName="checkmark" size={14} className={classNames.icon} />
                  <Text
                    as="p"
                    variant="p3semi"
                    style={{ color: 'var(--earn-protocol-secondary-60)' }}
                  >
                    {item.title}
                  </Text>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </UnstakeVaultTokenContent>
  )
}
