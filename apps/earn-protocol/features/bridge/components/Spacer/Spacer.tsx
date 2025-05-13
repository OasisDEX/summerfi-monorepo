import styles from './Spacer.module.css'

interface SpacerProps {
  className?: string
}

export function Spacer({ className }: SpacerProps) {
  return (
    <div className={`${styles.spacer} ${className ?? ''}`} role="separator" aria-hidden="true" />
  )
}
