import { type FC } from 'react'
import { Button, EXTERNAL_LINKS, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { UnstakeVaultTokenContent } from '@/features/unstake-vault-token/components/UnstakeVaultTokenContent/UnstakeVaultTokenContent'

import classNames from './UnstakeVaultTokenError.module.css'

interface UnstakeVaultTokenErrorProps {
  handleTx: () => Promise<void>
}

export const UnstakeVaultTokenError: FC<UnstakeVaultTokenErrorProps> = ({ handleTx }) => {
  return (
    <UnstakeVaultTokenContent>
      <Text
        as="p"
        variant="p2"
        style={{ color: 'var(--earn-protocol-secondary-60)', textAlign: 'center' }}
      >
        Something went wrong. Please try again or contact us on{' '}
        <Link
          href={EXTERNAL_LINKS.DISCORD}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--earn-protocol-primary-100)' }}
        >
          Discord
        </Link>
        .
      </Text>
      <Button
        variant="primaryMedium"
        onClick={handleTx}
        className={classNames.unstakeVaultTokenErrorButton}
      >
        Try again
      </Button>
    </UnstakeVaultTokenContent>
  )
}
