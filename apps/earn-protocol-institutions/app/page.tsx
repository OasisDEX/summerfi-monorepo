'use client'

import { AnimateHeight, Button, Card, Input, LoadingSpinner, Text } from '@summerfi/app-earn-ui'

import { useLogin } from '@/hooks/useLogin'

export default function InstitutionsLoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleLoginSubmit,
    handleSetNewPassword,
    challengeData,
  } = useLogin()

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

  const buttonDisabled = isLoading || !email || !password

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
        onSubmit={handleLoginSubmit}
        style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <div>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
          >
            Email
          </label>
          <Input
            variant="dark"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
          >
            Password
          </label>
          <Input
            variant="dark"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={buttonDisabled}
          variant={buttonDisabled ? 'secondaryMedium' : 'primaryMedium'}
          style={{ padding: '24px 32px', marginTop: '10px' }}
        >
          {isLoading ? <LoadingSpinner size={14} /> : 'Sign In'}
        </Button>

        <AnimateHeight show={!!error} id="error-message">
          <Card
            variant="cardSecondarySmallPaddings"
            style={{
              border: '1px solid var(--earn-protocol-critical-50)',
              color: 'var(--earn-protocol-critical-100)',
              textAlign: 'center',
              padding: '24px 32px',
              margin: '30px auto 0 auto',
              width: 'fit-content',
            }}
          >
            <Text variant="p3" style={{ width: '100%' }}>
              {error}
            </Text>
          </Card>
        </AnimateHeight>
      </form>
    </div>
  )
}
