import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'
import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { AuthService } from '@/features/auth/AuthService'
import { type SignInResponse } from '@/types/auth'

if (!process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING) {
  throw new Error(
    'EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING must be set in environment variables',
  )
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Decode token to get user info
    const payload = decodeJwt(accessToken)

    if (typeof payload.sub !== 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await AuthService.getUserData(accessToken)

    // check the user role
    const institutionsDB = await getSummerProtocolInstitutionDB({
      connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
    })

    const globalAdmin = await institutionsDB.db
      .selectFrom('globalAdmins')
      .select(['userSub'])
      .where('userSub', '=', payload.sub)
      .executeTakeFirst()

    if (globalAdmin) {
      return NextResponse.json({
        user: {
          id: user.sub,
          email: user.email,
          name: user.name,
          isGlobalAdmin: true,
        },
      } as SignInResponse)
    }
    // If not a global admin, check the institution data on the user
    const userInstitutions = await institutionsDB.db
      .selectFrom('institutionUsers')
      .innerJoin('institutions', 'institutions.id', 'institutionUsers.institutionId')
      .select([
        'institutionUsers.role',
        'institutionUsers.institutionId',
        'institutions.name as institutionName',
        'institutions.displayName as institutionDisplayName',
      ])
      .where('institutionUsers.userSub', '=', payload.sub)
      .execute()

    if (userInstitutions.length === 0) {
      return NextResponse.json(
        { error: 'User does not have any institution roles' },
        { status: 403 },
      )
    }

    return NextResponse.json({
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
        institutionsList: userInstitutions.map((inst) => ({
          id: inst.institutionId,
          name: inst.institutionName,
          displayName: inst.institutionDisplayName,
          role: inst.role,
        })),
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auth check error:', error)

    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
