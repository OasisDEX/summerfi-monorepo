import {
  AssociateSoftwareTokenCommand,
  GetUserCommand,
  SetUserMFAPreferenceCommand,
  VerifySoftwareTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { cookies } from 'next/headers'

import { ACCESS_TOKEN_COOKIE } from '@/constants/cookies'
import { cognitoClient } from '@/features/auth/constants'
import { type MfaInfo } from '@/types/mfa'

async function getAccessTokenFromCookiesOrEnv() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  return token
}

export async function getMfaInfoAction(): Promise<MfaInfo | null> {
  try {
    const accessToken = await getAccessTokenFromCookiesOrEnv()

    const cmd = new GetUserCommand({ AccessToken: accessToken })
    const res = await cognitoClient.send(cmd)

    return {
      preferredMfa: res.PreferredMfaSetting,
      enabledMfas: res.UserMFASettingList,
      username: res.Username,
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('getMfaInfoAction error', err)

    throw err
  }
}

export async function associateSoftwareTokenAction(): Promise<{ secret: string }> {
  const accessToken = await getAccessTokenFromCookiesOrEnv()
  const cmd = new AssociateSoftwareTokenCommand({ AccessToken: accessToken })
  const res = await cognitoClient.send(cmd)
  const secret = (res.SecretCode as unknown as string) || null

  if (!secret) throw new Error('Failed to get secret from Cognito')

  return { secret }
}

export async function verifySoftwareTokenAction(tokenCode: string): Promise<{ success: boolean }> {
  const accessToken = await getAccessTokenFromCookiesOrEnv()

  const cmd = new VerifySoftwareTokenCommand({
    AccessToken: accessToken,
    UserCode: tokenCode,
  })
  const res = await cognitoClient.send(cmd)
  const success = res.Status === 'SUCCESS'

  return { success }
}

export async function setUserMfaAction(mfa: 'SOFTWARE_TOKEN_MFA' | 'SMS_MFA') {
  const accessToken = await getAccessTokenFromCookiesOrEnv()

  const payload = {
    AccessToken: accessToken,
    SMSMfaSettings: { Enabled: false, PreferredMfa: false },
    SoftwareTokenMfaSettings: { Enabled: false, PreferredMfa: false },
    PreferredMfa: 'NOMFA',
  }

  if (mfa === 'SOFTWARE_TOKEN_MFA') {
    payload.SoftwareTokenMfaSettings = { Enabled: true, PreferredMfa: true }
    payload.SMSMfaSettings = { Enabled: false, PreferredMfa: false }
    payload.PreferredMfa = 'SOFTWARE_TOKEN_MFA'
  } else {
    throw new Error('Only SOFTWARE_TOKEN_MFA is supported')
  }

  const cmd = new SetUserMFAPreferenceCommand(payload)

  await cognitoClient.send(cmd)

  return { ok: true }
}

export async function disableMfaAction() {
  const accessToken = await getAccessTokenFromCookiesOrEnv()

  const cmd = new SetUserMFAPreferenceCommand({
    AccessToken: accessToken,
    SMSMfaSettings: { Enabled: false, PreferredMfa: false },
    SoftwareTokenMfaSettings: { Enabled: false, PreferredMfa: false },
  })

  await cognitoClient.send(cmd)

  return { ok: true }
}
