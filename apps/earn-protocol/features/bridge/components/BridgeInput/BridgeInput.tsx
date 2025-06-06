'use client'

interface BridgeInputProps {
  children: React.ReactNode
}

import styles from './BridgeInput.module.css'

export const BridgeInput = ({ children }: BridgeInputProps) => {
  return (
    <div role="group" aria-label="Bridge Input Section" className={styles.inputSection}>
      {children}
    </div>
  )
}
