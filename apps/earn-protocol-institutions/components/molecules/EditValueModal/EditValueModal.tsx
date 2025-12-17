import { type ReactNode, useState } from 'react'
import {
  Button,
  type ButtonVariant,
  Card,
  Input,
  Modal,
  Text,
  useAmount,
} from '@summerfi/app-earn-ui'
import { slugify } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import editValueModalStyles from './EditValueModal.module.css'

export const EditTokenValueModal = ({
  modalTitle,
  modalDescription,
  buttonLabel,
  buttonVariant,
  editValue,
  onAddTransaction,
  loading,
}: {
  modalTitle: ReactNode
  modalDescription: ReactNode
  buttonLabel: ReactNode
  buttonVariant?: ButtonVariant
  editValue: {
    label: string
    valueNormalized: string | number
    decimals: number
    symbol?: string
  }
  loading?: boolean
  onAddTransaction: (value: BigNumber) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { amountDisplay, amountParsed, manualSetAmount, onBlur, onFocus } = useAmount({
    inputName: `insti-${slugify(editValue.label)}-edit-modal`,
    tokenDecimals: editValue.decimals,
    inputChangeHandler: () => {},
    initialAmount: editValue.valueNormalized.toString(),
  })

  const handleOpenClose = () => {
    if (loading) {
      return
    }
    setIsOpen((prev) => !prev)
  }

  const handleAddTransaction = () => {
    onAddTransaction(amountParsed)
    handleOpenClose()
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value

    if (nextValue === '') {
      manualSetAmount('0')

      return
    }

    if (Number(nextValue) < 0 || isNaN(Number(nextValue))) {
      manualSetAmount(editValue.valueNormalized.toString())
    }

    manualSetAmount(nextValue)
  }

  return (
    <>
      <Modal openModal={isOpen} closeModal={handleOpenClose} noScroll>
        <Card variant="cardSecondary">
          <div className={editValueModalStyles.editValueModalWrapper}>
            <Text
              as="h5"
              variant="h5"
              style={{ marginBottom: 'var(--general-space-20)', textAlign: 'center' }}
            >
              {modalTitle}
            </Text>
            <Text variant="p3" style={{ textAlign: 'center' }}>
              {modalDescription}
            </Text>
            <Input
              variant="dark"
              className={editValueModalStyles.editTokenModalInput}
              placeholder={editValue.label}
              value={amountDisplay}
              onChange={handleAmountChange}
              onBlur={onBlur}
              onFocus={onFocus}
            />
            <div className={editValueModalStyles.actionButtons}>
              <Button variant="textSecondarySmall" onClick={handleOpenClose}>
                Cancel
              </Button>
              <Button variant="primarySmall" onClick={handleAddTransaction}>
                Add transaction
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
      <Button
        variant={buttonVariant ?? 'textPrimarySmall'}
        onClick={handleOpenClose}
        disabled={loading}
        style={
          buttonVariant
            ? {}
            : {
                textDecoration: 'underline',
              }
        }
      >
        {buttonLabel}
      </Button>
    </>
  )
}
