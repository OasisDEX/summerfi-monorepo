'use client'

import { useState } from 'react'
import { Text } from '@summerfi/app-earn-ui'

export default function InstitutionsLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [challengeData, setChallengeData] = useState<{
    challenge: string
    session: string
    email: string
  } | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed')
      }

      // Check if there's a challenge
      if (data.challenge === 'NEW_PASSWORD_REQUIRED') {
        setChallengeData({
          challenge: data.challenge,
          session: data.session,
          email: data.email,
        })
      } else {
        // eslint-disable-next-line no-console
        console.log('Login successful:', data)
        // Redirect or update UI here
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')

      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')

      return
    }

    setIsLoading(true)

    if (!challengeData) {
      setError('No challenge data available')
      setIsLoading(false)

      return
    }

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: challengeData.email,
          newPassword,
          session: challengeData.session,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Password change failed')
      }

      // eslint-disable-next-line no-console
      console.log('Password set successfully:', data)
      setChallengeData(null)
      // Redirect or update UI here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (challengeData?.challenge === 'NEW_PASSWORD_REQUIRED') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          padding: '20px',
        }}
      >
        <Text variant="h1colorful">Set New Password</Text>
        <Text variant="h4">Please choose a new password</Text>

        <form
          onSubmit={handleSetNewPassword}
          style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div>
            <label
              htmlFor="newPassword"
              style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>

          {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Setting Password...' : 'Set New Password'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        padding: '20px',
      }}
    >
      <Text variant="h1colorful">Welcome to the new thing</Text>
      <Text variant="h4">please log in</Text>

      <form
        onSubmit={handleSignIn}
        style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <div>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>

        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
