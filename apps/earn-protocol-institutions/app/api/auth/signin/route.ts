import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'
import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { AuthService } from '@/features/auth/AuthService'
import { type SignInResponse } from '@/types/auth'

if (
  !process.env.INSTITUTIONS_COGNITO_CLIENT_ID ||
  !process.env.INSTITUTIONS_COGNITO_CLIENT_SECRET
) {
  throw new Error('Cognito client ID and secret must be set in environment variables')
}

if (!process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING) {
  throw new Error(
    'EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING must be set in environment variables',
  )
}

function generateSecretHash(username: string): string {
  const clientId = process.env.INSTITUTIONS_COGNITO_CLIENT_ID as string
  const clientSecret = process.env.INSTITUTIONS_COGNITO_CLIENT_SECRET as string

  const message = username + clientId

  return createHmac('sha256', clientSecret).update(message).digest('base64')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const secretHash = generateSecretHash(email)
    const result = await AuthService.signIn({ email, password }, secretHash)

    // Check if it's a challenge response
    if ('challenge' in result) {
      return NextResponse.json({
        challenge: result.challenge,
        session: result.session,
        email,
      })
    }

    // check the user role
    const institutionsDB = await getSummerProtocolInstitutionDB({
      connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING as string,
    })

    const globalAdmin = await institutionsDB.db
      .selectFrom('globalAdmins')
      .select(['userSub'])
      .where('userSub', '=', result.id)
      .executeTakeFirst()

    // Normal authentication success
    const cookieStore = await cookies()

    cookieStore.set('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    })

    cookieStore.set('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    cookieStore.set('username', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    if (globalAdmin) {
      return NextResponse.json({
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
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
      .where('institutionUsers.userSub', '=', result.id)
      .execute()

    if (userInstitutions.length === 0) {
      return NextResponse.json(
        { error: 'User does not have any institution roles' },
        { status: 403 },
      )
    }

    return NextResponse.json({
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        institutionsList: userInstitutions.map((inst) => ({
          id: inst.institutionId,
          name: inst.institutionName,
          displayName: inst.institutionDisplayName,
          role: inst.role,
        })),
      },
    } as SignInResponse)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Sign in error:', error)

    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
