import { type ReactNode, useState } from 'react'
import {
  Button,
  type ButtonVariant,
  Card,
  Input,
  Modal,
  Text,
  useAmount,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { slugify } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'

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
  const { userWalletAddress, isLoadingAccount } = useUserWallet()
  const [isOpen, setIsOpen] = useState(false)

  const { amountDisplay, amountParsed, manualSetAmount, onBlur, onFocus } = useAmount({
    inputName: `insti-${slugify(editValue.label)}-token-edit-modal`,
    tokenDecimals: editValue.decimals,
    inputChangeHandler: () => {},
    initialAmount: editValue.valueNormalized.toString(),
  })

  const handleOpenClose = () => {
    if (loading) {
      return
    }
    manualSetAmount(editValue.valueNormalized.toString())
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

      return
    }

    manualSetAmount(nextValue)
  }

  const isValueChanged = !amountParsed.isEqualTo(new BigNumber(editValue.valueNormalized))
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const buttonsDisabled = loading || isLoadingAccount || !userWalletAddress

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
              <Button variant="secondarySmall" onClick={handleOpenClose}>
                Cancel
              </Button>
              <Button
                variant="primarySmall"
                onClick={handleAddTransaction}
                disabled={!isValueChanged}
              >
                Add transaction
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
      {buttonVariant ? (
        <Button variant={buttonVariant} onClick={handleOpenClose} disabled={buttonsDisabled}>
          {buttonLabel}
        </Button>
      ) : (
        <span
          onClick={!buttonsDisabled ? handleOpenClose : undefined}
          className={clsx(editValueModalStyles.defaultUnderlineOnHover, {
            [editValueModalStyles.disabledDefaultUnderlineOnHover]: buttonsDisabled,
          })}
        >
          {buttonLabel}
        </span>
      )}
    </>
  )
}

// basically the same as EditTokenValueModal but with fixed 4 decimals
export const EditPercentageValueModal = ({
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
  }
  loading?: boolean
  onAddTransaction: (value: BigNumber) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { userWalletAddress, isLoadingAccount } = useUserWallet()

  const { amountDisplay, amountParsed, manualSetAmount, onBlur, onFocus } = useAmount({
    inputName: `insti-${slugify(editValue.label)}-percentage-edit-modal`,
    tokenDecimals: 4,
    inputChangeHandler: () => {},
    initialAmount: editValue.valueNormalized.toString(),
  })

  const handleOpenClose = () => {
    if (loading) {
      return
    }
    manualSetAmount(editValue.valueNormalized.toString())
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

      return
    }

    manualSetAmount(nextValue)
  }

  const isValueChanged = !amountParsed.isEqualTo(new BigNumber(editValue.valueNormalized))
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const buttonsDisabled = loading || isLoadingAccount || !userWalletAddress

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
              <Button variant="secondarySmall" onClick={handleOpenClose}>
                Cancel
              </Button>
              <Button
                variant="primarySmall"
                onClick={handleAddTransaction}
                disabled={!isValueChanged}
              >
                Add transaction
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
      {buttonVariant ? (
        <Button variant={buttonVariant} onClick={handleOpenClose} disabled={buttonsDisabled}>
          {buttonLabel}
        </Button>
      ) : (
        <span
          onClick={!buttonsDisabled ? handleOpenClose : undefined}
          className={clsx(editValueModalStyles.defaultUnderlineOnHover, {
            [editValueModalStyles.disabledDefaultUnderlineOnHover]: buttonsDisabled,
          })}
        >
          {buttonLabel}
        </span>
      )}
    </>
  )
}
