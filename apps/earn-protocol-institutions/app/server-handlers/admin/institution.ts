import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'

// Server Action: create institution
export async function createInstitution(formData: FormData) {
  'use server'

  const institutionName = formData.get('name')
  const displayName = formData.get('displayName')
  const logoUrl = formData.get('logoUrl')
  const logoFileInput = formData.get('logoFile') as File | null

  if (
    typeof institutionName !== 'string' ||
    !institutionName.trim() ||
    typeof displayName !== 'string' ||
    !displayName.trim()
  ) {
    throw new Error('Name and displayName are required')
  }

  let logoFile: Buffer | null = null

  if (logoFileInput && typeof logoFileInput.arrayBuffer === 'function' && logoFileInput.size > 0) {
    const buf = await logoFileInput.arrayBuffer()

    logoFile = Buffer.from(buf)
  }

  const { db } = await getSummerProtocolInstitutionDB({
    connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
  })

  // If your DB sets createdAt automatically, you can omit it here.
  await db
    .insertInto('institutions')
    .values({
      name: institutionName.trim(),
      displayName: displayName.trim(),
      logoUrl: typeof logoUrl === 'string' ? logoUrl.trim() : '',
      logoFile,
    })
    .execute()
}
