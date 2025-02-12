'use client'
import React from 'react'
import { Text } from '@summerfi/app-earn-ui'
import styles from './TokenSelector.module.scss'

interface TokenSelectorProps {
  token: string
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ token }) => {
  return (
    <div className={styles.tokenSelector}>
      <Text variant="p2semi">{token}</Text>
    </div>
  )
}

export default TokenSelector
