import { Button, Card, SkeletonLine, Table, Text } from '@summerfi/app-earn-ui'

import { usersPanelColumns } from '@/features/panels/overview/components/PanelManageInternalUsers/constants'

import panelManageInternalUsersStyles from './PanelManageInternalUsers.module.css'

const skeletonRows = Array.from({ length: 5 }).map((_) => ({
  content: {
    actions: <SkeletonLine height={19} style={{ margin: '4px 0' }} />,
    cognitoEmail: <SkeletonLine height={19} style={{ margin: '4px 0' }} />,
    cognitoName: <SkeletonLine height={19} style={{ margin: '4px 0' }} />,
    createdAt: <SkeletonLine height={19} style={{ margin: '4px 0' }} />,
    role: <SkeletonLine height={19} style={{ margin: '4px 0' }} />,
  },
}))

export const PanelManageListInternalUsersLoading = () => {
  return (
    <Card
      variant="cardSecondary"
      className={panelManageInternalUsersStyles.panelManageInternalUsersWrapper}
    >
      <Text variant="h2">Manage Internal Users</Text>
      <Card variant="cardPrimarySmallPaddings">
        <div className={panelManageInternalUsersStyles.usersSection}>
          <div className={panelManageInternalUsersStyles.tableContainer}>
            <Table rows={skeletonRows} columns={usersPanelColumns} />
          </div>
        </div>
      </Card>
      <Text variant="h3">Add user</Text>
      <Card variant="cardPrimary">
        <form className={panelManageInternalUsersStyles.addUserForm}>
          <div className={panelManageInternalUsersStyles.formFields}>
            <div className={panelManageInternalUsersStyles.formField}>
              <label htmlFor="email" className={panelManageInternalUsersStyles.formLabel}>
                Email
              </label>
              <input disabled name="email" type="email" placeholder="Email" required />
            </div>
            <div className={panelManageInternalUsersStyles.formField}>
              <label htmlFor="name" className={panelManageInternalUsersStyles.formLabel}>
                Full name
              </label>
              <input disabled name="name" placeholder="Full name" required />
            </div>
            <div className={panelManageInternalUsersStyles.formField}>
              <label htmlFor="role" className={panelManageInternalUsersStyles.formLabel}>
                Role
              </label>
              <select disabled name="role" defaultValue="Viewer">
                <option value="RoleAdmin">RoleAdmin</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
          <Button
            variant="primarySmall"
            type="submit"
            disabled
            className={panelManageInternalUsersStyles.addUserButton}
          >
            Add&nbsp;User
          </Button>
        </form>
      </Card>
    </Card>
  )
}
