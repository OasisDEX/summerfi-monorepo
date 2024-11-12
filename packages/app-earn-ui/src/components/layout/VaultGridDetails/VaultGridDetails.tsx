'use client'

import { type ReactNode } from 'react'
import { type SDKVaultsListType, type SDKVaultType } from '@summerfi/app-types'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { VaultTitleDropdownContent } from '@/components/molecules/VaultTitleDropdownContent/VaultTitleDropdownContent'
import { VaultTitleWithRisk } from '@/components/molecules/VaultTitleWithRisk/VaultTitleWithRisk'
import { getVaultDetailsUrl, getVaultUrl } from '@/helpers/get-vault-url'

import vaultGridDetailsStyles from './VaultGridDetails.module.scss'

export const VaultGridDetails = ({
  vault,
  vaults,
  children,
}: {
  vault: SDKVaultType
  vaults: SDKVaultsListType
  children: ReactNode
}) => {
  return (
    <>
      <div className={vaultGridDetailsStyles.vaultGridDetailsBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Link href="/earn">
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Earn /
            </Text>
          </Link>
          <Link href={getVaultUrl(vault)}>
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              {' '}
              {vault.id}{' '}
            </Text>
          </Link>
          <Text as="span" variant="p3" color="white">
            / Details
          </Text>
        </div>
      </div>
      <div className={vaultGridDetailsStyles.vaultGridDetailsWrapper}>
        <div className={vaultGridDetailsStyles.vaultGridDetailsHeaderWrapper}>
          <Dropdown
            options={vaults.map((item) => ({
              value: item.id,
              content: <VaultTitleDropdownContent vault={item} link={getVaultDetailsUrl(item)} />,
            }))}
            dropdownValue={{
              value: vault.id,
              content: <VaultTitleDropdownContent vault={vault} link={getVaultDetailsUrl(vault)} />,
            }}
          >
            <VaultTitleWithRisk
              symbol={vault.inputToken.symbol}
              // TODO: fill data
              risk="low"
              networkName={vault.protocol.network}
            />
          </Dropdown>
          <Button variant="primarySmall" style={{ height: '48px', paddingRight: '40px' }}>
            <Link href={getVaultUrl(vault)}>
              <WithArrow as="span" variant="p2semi">
                Deposit
              </WithArrow>
            </Link>
          </Button>
        </div>
        <div className={vaultGridDetailsStyles.vaultGridDetailsContentWrapper}>{children}</div>
      </div>
    </>
  )
}
