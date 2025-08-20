import { Button, Text } from '@summerfi/app-earn-ui'
import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'

import { createUser } from '@/app/server-handlers/admin/user'
import { readSession } from '@/app/server-handlers/auth/session'
import { type UserAdminTableRow, usersAdminPanelColumns } from '@/features/admin/constants'
import { institutionsAdminPanelDisplayRow } from '@/features/admin/helpers'

export const UsersAdminPanel = async () => {
  const session = await readSession()

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const [users, institutions] = await Promise.all([
    db.selectFrom('institutionUsers').selectAll().execute(),
    db.selectFrom('institutions').select(['id', 'displayName']).execute(),
  ])

  db.destroy()

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '80px' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Text variant="h1">Admin&nbsp;/&nbsp;Users</Text>
        <Text variant="p3semi">({session?.user.name})</Text>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Text variant="h2">Add user</Text>
        <form
          action={createUser}
          style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
          />
          <input
            name="name"
            placeholder="Full name"
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
          />
          <select
            name="role"
            defaultValue="Viewer"
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
          >
            <option value="RoleAdmin">RoleAdmin</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Viewer">Viewer</option>
          </select>
          <select
            name="institutionId"
            required
            defaultValue=""
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
          >
            <option value="" disabled>
              Select institution
            </option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.displayName} (#{i.id})
              </option>
            ))}
          </select>
          <Button variant="secondarySmall" type="submit" style={{ width: 'fit-content' }}>
            Add&nbsp;User
          </Button>
        </form>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Text variant="h2">Users</Text>
        {users.length === 0 ? (
          <Text>No users found.</Text>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
              }}
            >
              <thead>
                <tr>
                  {usersAdminPanelColumns.map((col) => (
                    <th
                      key={col.accessor}
                      style={{
                        textAlign: 'left',
                        borderBottom: '1px solid #ddd',
                        padding: '8px',
                        fontWeight: 600,
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((row: UserAdminTableRow) => {
                  const key = row.id

                  return (
                    <tr key={key}>
                      {usersAdminPanelColumns.map((col) => (
                        <td
                          key={col.accessor}
                          style={{
                            borderBottom: '1px solid #f0f0f0',
                            padding: '8px',
                            verticalAlign: 'top',
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: 12,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {institutionsAdminPanelDisplayRow(
                              row[col.accessor as keyof UserAdminTableRow] as unknown,
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
