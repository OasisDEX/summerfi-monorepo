'use client'
import { useState } from 'react'
import { Button, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { sanitizeReferralCode } from '@/helpers/sanitize-referral-code'

interface ReferralData {
  referral_code: string | null
  id: string
  active_users_count: number | null
  custom_code: string | null
  total_deposits_referred_usd: string | null
}

interface ReferralTableProps {
  referralsList: ReferralData[]
  refreshView: () => Promise<void>
}

export function ReferralTable({ referralsList, refreshView }: ReferralTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const [manualWalletAddress, setManualWalletAddress] = useState('')

  const handleEdit = (id: string, currentValue: string | null) => {
    setEditingId(id)
    setEditValue(currentValue ?? '')
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  const submitReferralHandler = async (formData: FormData) => {
    const response = await fetch('/earn/api/secure/referral-handlers', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to update custom code')
    }
    await refreshView()
  }

  const handleManualWalletAddressCodeSubmit = async () => {
    if (!manualWalletAddress) {
      // eslint-disable-next-line no-alert
      alert('Please enter a wallet address')

      return
    }

    const alreadyExists = referralsList.filter(
      (referral) => referral.id === manualWalletAddress.toLowerCase(),
    )

    if (alreadyExists.length > 0) {
      // eslint-disable-next-line no-alert
      alert(
        `This wallet address already has a referral code associated with it - ${alreadyExists[0].referral_code}`,
      )

      setManualWalletAddress('')

      return
    }

    const formData = new FormData()

    formData.append('manualWalletAddress', manualWalletAddress)

    try {
      setIsUpdating(true)
      await submitReferralHandler(formData)
      setManualWalletAddress('')
      setIsUpdating(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add referral code to wallet:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to add referral code to wallet. Please try again later.')
      setIsUpdating(false)
    }
  }

  const handleCustomCodeSubmit = async (referralCodeId: string) => {
    const formData = new FormData()

    formData.append('referralCodeId', referralCodeId.toString())
    formData.append('customCode', editValue)

    try {
      setIsUpdating(true)
      await submitReferralHandler(formData)
      setEditingId(null)
      setEditValue('')
      setIsUpdating(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update custom code:', error)
      // eslint-disable-next-line no-alert
      alert('Failed to update custom code. Please try again later.')
      setIsUpdating(false)
      setEditingId(null)
      setEditValue('')
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '1200px' }}>
      <div
        style={{
          margin: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="p2semi">Manually add ref. code to a wallet</Text>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
          <form
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignContent: 'center',
              gap: '1rem',
            }}
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              type="text"
              value={manualWalletAddress}
              onChange={(e) => setManualWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
              disabled={isUpdating}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '300px',
              }}
            />
            <Button
              onClick={() => handleManualWalletAddressCodeSubmit()}
              variant="primarySmall"
              style={{ padding: '8px 16px' }}
              disabled={isUpdating || !manualWalletAddress}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#0f0f0f' }}>
            <th style={{ padding: '12px', border: '1px solid #090909', textAlign: 'left' }}>
              User ID
            </th>
            <th style={{ padding: '12px', border: '1px solid #090909', textAlign: 'left' }}>
              Referral Code ID
            </th>
            <th style={{ padding: '12px', border: '1px solid #090909', textAlign: 'left' }}>
              Custom Code
            </th>
            <th style={{ padding: '12px', border: '1px solid #090909', textAlign: 'left' }}>
              Total Deposits (USD)
            </th>
            <th style={{ padding: '12px', border: '1px solid #090909', textAlign: 'left' }}>
              Active Users
            </th>
            <th style={{ padding: '12px', border: '1px solid #090909', textAlign: 'center' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {referralsList.map((referral) => (
            <tr
              key={referral.id}
              style={{
                opacity: isUpdating && editingId === referral.referral_code ? 0.5 : 1,
              }}
            >
              <td
                style={{
                  padding: '12px',
                  border: '1px solid #090909',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                }}
              >
                {referral.id}
              </td>
              <td style={{ padding: '12px', border: '1px solid #090909' }}>
                {referral.referral_code ?? 'N/A'}
              </td>
              <td style={{ padding: '12px', border: '1px solid #090909', width: '200px' }}>
                {editingId === referral.referral_code ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(sanitizeReferralCode(e.target.value, true) ?? '')}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      width: '100%',
                    }}
                  />
                ) : (
                  referral.custom_code ?? '-'
                )}
              </td>
              <td style={{ padding: '12px', border: '1px solid #090909' }}>
                $
                {referral.total_deposits_referred_usd
                  ? formatCryptoBalance(referral.total_deposits_referred_usd)
                  : '0'}
              </td>
              <td style={{ padding: '12px', border: '1px solid #090909' }}>
                {referral.active_users_count ?? 0}
              </td>
              <td style={{ padding: '12px', border: '1px solid #090909', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <Button
                    onClick={() =>
                      referral.referral_code
                        ? handleEdit(referral.referral_code, referral.custom_code)
                        : null
                    }
                    variant="textPrimarySmall"
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                    disabled={!referral.referral_code || editingId === referral.referral_code}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() =>
                      referral.referral_code ? handleCustomCodeSubmit(referral.referral_code) : null
                    }
                    variant="textPrimarySmall"
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                    disabled={!referral.referral_code || editingId !== referral.referral_code}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="textSecondarySmall"
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                    disabled={!referral.referral_code || editingId !== referral.referral_code}
                  >
                    Cancel
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
