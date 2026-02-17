import { Text } from '@summerfi/app-earn-ui'

import daoManagedInfoBlockStyles from './DaoManagedInfoBlock.module.css'

export const DaoManagedInfoBlock = () => {
  return (
    <div className={daoManagedInfoBlockStyles.wrapper}>
      <div className={daoManagedInfoBlockStyles.cardsGrid}>
        <div className={daoManagedInfoBlockStyles.card}>
          <div className={daoManagedInfoBlockStyles.iconCircle}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: '#d1d5db' }}
            >
              <path
                d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M9 12L11 14L15 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>

          <div>
            <Text variant="p3semi" as="p">
              1. Rigorous Screening
            </Text>
            <Text
              variant="p4"
              as="p"
              style={{ marginTop: '12px', color: 'var(--color-text-secondary)' }}
            >
              Protocols undergo strict security audits and liquidity checks before being
              whitelisted.
            </Text>
          </div>
        </div>

        <div className={daoManagedInfoBlockStyles.card}>
          <div className={daoManagedInfoBlockStyles.barsWrapper}>
            <div className={daoManagedInfoBlockStyles.barsContainer}>
              <div
                className={`${daoManagedInfoBlockStyles.bar} ${daoManagedInfoBlockStyles.barSmall}`}
              ></div>
              <div
                className={`${daoManagedInfoBlockStyles.bar} ${daoManagedInfoBlockStyles.barMedium}`}
              ></div>
              <div
                className={`${daoManagedInfoBlockStyles.bar} ${daoManagedInfoBlockStyles.barMediumSmall}`}
              ></div>
            </div>

            <div className={daoManagedInfoBlockStyles.badgesContainer}>
              {['A', 'B', 'C'].map((letter) => (
                <div key={letter} className={daoManagedInfoBlockStyles.badge}>
                  {letter}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Text variant="p3semi" as="p">
              2. Risk Categorization
            </Text>
            <Text
              variant="p4"
              as="p"
              style={{ marginTop: '12px', color: 'var(--color-text-secondary)' }}
            >
              Vaults are classified into Category A, B, or C based on their risk profile and asset
              type.
            </Text>
          </div>
        </div>

        <div className={daoManagedInfoBlockStyles.card}>
          <div className={daoManagedInfoBlockStyles.iconCircle}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: '#d1d5db' }}
            >
              <path
                d="M23 6L13.5 15.5L8.5 10.5L1 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M17 6H23V12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>

          <div>
            <Text variant="p3semi" as="p">
              3. Auto-Rebalancing
            </Text>
            <Text
              variant="p4"
              as="p"
              style={{ marginTop: '12px', color: 'var(--color-text-secondary)' }}
            >
              Smart contracts automatically rebalance funds to maximize returns for the user.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
