import { useEffect, useState } from 'react'
import { Button, Card, Input, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import QRCode from 'qrcode'

import mfaSettingStyles from './MFASetting.module.css'

type MfaInfo = {
  preferredMfa?: string | null
  enabledMfas?: string[] | null
  username?: string | null
}

export const MFASetting = () => {
  const [loading, setLoading] = useState(false)
  const [mfaInfo, setMfaInfo] = useState<MfaInfo | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [otpAuthurl, setOtpAuthurl] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function fetchStatus() {
    setLoading(true)
    try {
      const res = await fetch('/api/mfa')
      const json = await res.json()

      if (json.ok) {
        setMfaInfo(json.data)
      } else {
        // eslint-disable-next-line no-console
        console.error('MFA fetch failed', json.error)
        setMessage('Something went wrong. Please retry.')
      }
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('MFA fetch failed', err)
      setMessage('Something went wrong. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchStatus()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)

      return () => clearTimeout(timer)
    }

    return () => {}
  }, [message])

  async function startTotpSetup() {
    setLoading(true)
    setMessage(null)
    setOtpAuthurl(null)

    try {
      const res = await fetch('/api/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'associate' }),
      })

      const json = await res.json()

      if (!json.ok) throw new Error(json.error || 'Failed to associate')

      const secretCode: string = json.data.secret

      setSecret(secretCode)

      const label = encodeURIComponent(mfaInfo?.username ?? 'account')
      const issuer = encodeURIComponent('summerfi')
      const otpauth = `otpauth://totp/${issuer}:${label}?secret=${secretCode}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`

      setOtpAuthurl(otpauth)

      const dataUrl = await QRCode.toDataURL(otpauth, {
        color: {
          dark: '#ffffff', // QR code color
          light: '#2b2b2b', // Background color
        },
        margin: 2,
        width: 280,
      })

      setQrDataUrl(dataUrl)
    } catch (err: unknown) {
      setMessage(String(err))
    } finally {
      setLoading(false)
    }
  }

  async function verifyCode() {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', code }),
      })

      const json = await res.json()

      if (!json.ok) throw new Error(json.error || 'Verification failed')

      if (json.data.success) {
        const res2 = await fetch('/api/mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'set', mfa: 'SOFTWARE_TOKEN_MFA' }),
        })

        const j2 = await res2.json()

        if (!j2.ok) throw new Error(j2.error || 'Failed to set MFA')

        setQrDataUrl(null)
        setSecret(null)
        setCode('')
        await fetchStatus()
      } else {
        setMessage('Verification failed')
      }
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('MFA verification failed', err)
      setMessage('Something went wrong. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  async function disableMfa() {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable' }),
      })

      const json = await res.json()

      if (!json.ok) throw new Error(json.error || 'Failed to disable')

      setMessage('MFA disabled')
      await fetchStatus()
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('MFA disable failed', err)
      setMessage('Something went wrong. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  const mfaEnabled = mfaInfo?.preferredMfa && mfaInfo.preferredMfa !== 'NOMFA'

  return (
    <div className={mfaSettingStyles.mfaWrapper}>
      <Text variant="p1semi" as="p" className={mfaSettingStyles.headingText}>
        Multi-factor authentication&nbsp;
      </Text>
      <Card
        variant="cardPrimaryMediumPaddingsColorfulBorder"
        className={mfaSettingStyles.cardCenter}
      >
        {!loading && mfaInfo ? (
          <>
            {qrDataUrl && otpAuthurl ? (
              <div className={mfaSettingStyles.mfaScanQrWrapper}>
                <Text as="p" variant="p1semi" className={mfaSettingStyles.qrInstruction}>
                  Scan this QR code
                  <br />
                  with your authenticator app
                </Text>
                <a href={otpAuthurl}>
                  <Image
                    src={qrDataUrl}
                    alt="TOTP QR code"
                    width={280}
                    height={280}
                    className={mfaSettingStyles.qrImage}
                  />
                </a>
                <Text as="p" variant="p3semi" className={mfaSettingStyles.qrInstruction}>
                  Or enter secret manually
                </Text>
                <textarea className={mfaSettingStyles.secretTextarea} readOnly>
                  {secret}
                </textarea>
              </div>
            ) : (
              <Text as="p" variant="p2" className={mfaSettingStyles.statusText}>
                MFA is currently{' '}
                <Text as="span" variant="p2semi">
                  {mfaEnabled ? 'enabled' : 'disabled'}
                </Text>
              </Text>
            )}
          </>
        ) : (
          <SkeletonLine
            width="70%"
            height={24}
            style={{
              margin: '32px auto',
            }}
          />
        )}
      </Card>
      {message && <div className={mfaSettingStyles.mfaMessage}>{message}</div>}

      <div className={mfaSettingStyles.mfaActions}>
        {mfaEnabled && (
          <Button variant="primaryMedium" onClick={disableMfa} disabled={loading}>
            Disable MFA
          </Button>
        )}

        {!mfaEnabled && !qrDataUrl && (
          <Button variant="primaryMedium" onClick={startTotpSetup} disabled={loading}>
            Set up MFA
          </Button>
        )}
        {!mfaEnabled && qrDataUrl && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Input
              variant="dark"
              name="mfaCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              placeholder="Enter 6 digit code"
              inputWrapperStyles={{
                letterSpacing: code ? '15px' : '0px',
                border: '1px solid rgba(25, 25, 25, 0.5)',
                borderRadius: '12px',
                marginBottom: '12px',
              }}
            />
            <Button
              variant="primaryMedium"
              onClick={verifyCode}
              disabled={code.length !== 6 || loading}
            >
              Verify & enable
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
