'use client'

import { type FC, useMemo, useState } from 'react'
import { Button, Card, Icon, Input, Table, Text } from '@summerfi/app-earn-ui'

import { revokedUsersTableColumns } from './revoked-users-table/columns'
import { revokedUsersTableMapper } from './revoked-users-table/mapper'
import { type VaultClientAdminUser } from './types'
import { whitelistedUsersTableColumns } from './whitelisted-users-table/columns'
import { filterClientAdminUsers } from './whitelisted-users-table/helpers'
import { whitelistedUsersTableMapper } from './whitelisted-users-table/mapper'

import styles from './PanelClient.module.css'

interface LabelWrapperProps {
  children: React.ReactNode
  htmlFor: string
}

const LabelWrapper = ({ children, htmlFor }: LabelWrapperProps) => {
  return (
    <label htmlFor={htmlFor}>
      <Text as="p" variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
        {children}
      </Text>
    </label>
  )
}

const NoDataAvailable = () => {
  return (
    <div className={styles.noDataAvailable}>
      <Text as="p" variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
        No data available
      </Text>
    </div>
  )
}

interface PanelClientAdminProps {
  whitelistedUsers: VaultClientAdminUser[]
  revokedUsers: VaultClientAdminUser[]
}

export const PanelClientAdmin: FC<PanelClientAdminProps> = ({ whitelistedUsers, revokedUsers }) => {
  const [search, setSearch] = useState('')
  const [isAddingUser, setIsAddingUser] = useState(false)

  const filteredWhitelistedUsers = useMemo(
    () => filterClientAdminUsers(whitelistedUsers, search),
    [whitelistedUsers, search],
  )
  const filteredRevokedUsers = useMemo(
    () => filterClientAdminUsers(revokedUsers, search),
    [revokedUsers, search],
  )

  const whitelistedUsersTableRows = whitelistedUsersTableMapper(filteredWhitelistedUsers)
  const revokedUsersTableRows = revokedUsersTableMapper(filteredRevokedUsers)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleOpenAddUserForm = () => {
    setIsAddingUser((prev) => !prev)
  }

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: add user
    // eslint-disable-next-line no-console
    console.log('add user')
  }

  return (
    <Card variant="cardSecondary" className={styles.panelClientAdminWrapper}>
      <div className={styles.header}>
        <Text as="h5" variant="h5">
          Client admin
        </Text>
        <Button variant="primaryMedium" onClick={handleOpenAddUserForm}>
          <Icon iconName="plus" size={20} />
          Whitelist a new user
        </Button>
      </div>
      {isAddingUser && (
        <Card className={styles.card}>
          <form onSubmit={handleAddUser} className={styles.form}>
            <div className={styles.inputWrapper}>
              <LabelWrapper htmlFor="address">Address</LabelWrapper>
              <Input
                placeholder="0x..."
                variant="withBorder"
                className={styles.input}
                id="address"
              />
            </div>
            <div className={styles.inputWrapper}>
              <LabelWrapper htmlFor="username">User name (optional)</LabelWrapper>
              <Input
                placeholder="John Doe"
                variant="withBorder"
                className={styles.input}
                id="username"
              />
            </div>
            <div className={styles.buttonsWrapper}>
              <Button variant="secondaryMedium" onClick={() => setIsAddingUser(false)}>
                Cancel
              </Button>
              <Button variant="primaryMedium" type="submit">
                Confirm
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Input
        placeholder="Search for a user"
        variant="withBorder"
        className={styles.input}
        icon={{ name: 'search_icon', size: 20 }}
        iconWrapperClassName={styles.iconWrapper}
        value={search}
        onChange={handleSearch}
      />
      <Card className={styles.card}>
        <Text as="p" variant="p4semi">
          Whitelisted users
        </Text>
        <div className={styles.tableWrapper}>
          <Table columns={whitelistedUsersTableColumns} rows={whitelistedUsersTableRows} />
          {whitelistedUsersTableRows.length === 0 && <NoDataAvailable />}
        </div>
      </Card>
      <Card className={styles.card}>
        <Text as="p" variant="p4semi">
          Currently revoked users
        </Text>
        <div className={styles.tableWrapper}>
          <Table columns={revokedUsersTableColumns} rows={revokedUsersTableRows} />
          {revokedUsersTableRows.length === 0 && <NoDataAvailable />}
        </div>
      </Card>
    </Card>
  )
}
