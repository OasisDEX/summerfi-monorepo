import { Button, Text } from '@summerfi/app-earn-ui'
import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'
import Image from 'next/image'

import { createInstitution } from '@/app/server-handlers/admin/institution'
import { readSession } from '@/app/server-handlers/auth/session'
import { institutionsAdminPanelColumns } from '@/features/admin/constants'
import {
  institutionsAdminPanelDisplayRow,
  institutionsAdminPanelGetLogoSrc,
} from '@/features/admin/helpers'

export const InstitutionsAdminPanel = async () => {
  const session = await readSession()

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  const institutions = await db.selectFrom('institutions').selectAll().execute()

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '80px' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Text variant="h1">Admin&nbsp;/&nbsp;Institutions</Text>
        <Text variant="p3semi">({session?.user.name})</Text>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Text variant="h2">Add Institution</Text>
        <form
          action={createInstitution}
          encType="multipart/form-data"
          style={{ display: 'grid', gap: 12, maxWidth: 640, gridTemplateColumns: 'repeat(5, 1fr)' }}
        >
          <div style={{ display: 'grid', gap: 4 }}>
            <label htmlFor="name" style={{ fontWeight: 600 }}>
              Name
            </label>
            <input id="name" name="name" required placeholder="internal-name" />
          </div>

          <div style={{ display: 'grid', gap: 4 }}>
            <label htmlFor="displayName" style={{ fontWeight: 600 }}>
              Display Name
            </label>
            <input id="displayName" name="displayName" required placeholder="Human Friendly Name" />
          </div>

          <div style={{ display: 'grid', gap: 4 }}>
            <label htmlFor="logoUrl" style={{ fontWeight: 600 }}>
              Logo URL (optional)
            </label>
            <input id="logoUrl" name="logoUrl" type="url" placeholder="https://..." />
          </div>

          <div style={{ display: 'grid', gap: 4 }}>
            <label htmlFor="logoFile" style={{ fontWeight: 600 }}>
              Logo File (optional)
            </label>
            <input id="logoFile" name="logoFile" type="file" accept="image/*" />
          </div>

          <Button variant="secondarySmall" type="submit" style={{ width: 'fit-content' }}>
            Add&nbsp;Institution
          </Button>
        </form>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Text variant="h2">Institutions</Text>
        {institutions.length === 0 ? (
          <Text>No institutions found.</Text>
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
                  {institutionsAdminPanelColumns.map(({ label, accessor }) => (
                    <th
                      key={accessor}
                      style={{
                        textAlign: 'left',
                        borderBottom: '1px solid #ddd',
                        padding: '8px',
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {institutions.map((row) => {
                  const key = row.id
                  const logo = institutionsAdminPanelGetLogoSrc(row.logoFile)

                  return (
                    <tr key={key}>
                      {institutionsAdminPanelColumns.map(({ accessor }) => (
                        <td
                          key={accessor}
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
                            {accessor === 'displayName' && logo && (
                              <Image
                                src={logo}
                                alt={institutionsAdminPanelDisplayRow(
                                  (row as { [key: string]: unknown })[accessor],
                                )}
                                style={{ maxWidth: '100%', height: 'auto' }}
                                width={32}
                                height={32}
                              />
                            )}
                            {accessor === 'displayName' && !logo && row.logoUrl && (
                              <Image
                                src={row.logoUrl}
                                alt={institutionsAdminPanelDisplayRow(
                                  (row as { [key: string]: unknown })[accessor],
                                )}
                                style={{ maxWidth: '100%', height: 'auto' }}
                                width={32}
                                height={32}
                              />
                            )}
                            {institutionsAdminPanelDisplayRow(
                              (row as { [key: string]: unknown })[accessor],
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
