import {
  type DropdownOption,
  type DropdownRawOption,
  type SDKVaultishType,
  type SDKVaultType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { InputWithDropdown } from '@/components/molecules/InputWithDropdown/InputWithDropdown'
import { ProjectedEarnings } from '@/components/molecules/ProjectedEarnings/ProjectedEarnings'
import { ProjectedEarningsExpanded } from '@/components/molecules/ProjectedEarnings/ProjectedEarningsExpanded'
import { getDisplayToken } from '@/helpers/get-display-token'
import { type EarningsEstimationsMap } from '@/helpers/get-earnings-estimations-map'

import styles from './ControlsDepositWithdraw.module.scss'

type ControlsDepositWithdrawProps = {
  amountDisplay: string
  amountDisplayUSD: string
  options: DropdownOption[]
  dropdownValue: DropdownOption
  tokenSymbol: string
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
  vault: SDKVaultType | SDKVaultishType
  estimatedEarnings: string
  isLoadingForecast: boolean
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDropdownChange: (option: DropdownRawOption) => void
  onFocus: () => void
  onBlur: () => void
  manualSetAmount: (amountParsed: string | undefined) => void
  ownerView?: boolean
  forecastSummaryMap?: EarningsEstimationsMap
  isSimulation?: boolean
  isOpen?: boolean
}

export const ControlsDepositWithdraw = ({
  amountDisplay,
  amountDisplayUSD,
  options,
  dropdownValue,
  tokenSymbol,
  tokenBalance,
  tokenBalanceLoading,
  vault,
  estimatedEarnings,
  isLoadingForecast,
  handleAmountChange,
  handleDropdownChange,
  onFocus,
  onBlur,
  manualSetAmount,
  ownerView,
  forecastSummaryMap,
  isSimulation = false,
  isOpen,
}: ControlsDepositWithdrawProps) => {
  return (
    <div className={styles.depositViewWrapper}>
      <InputWithDropdown
        value={amountDisplay}
        secondaryValue={amountDisplayUSD}
        handleChange={handleAmountChange}
        handleDropdownChange={handleDropdownChange}
        options={options}
        dropdownValue={dropdownValue}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={!ownerView}
        selectAllOnFocus
        heading={{
          // this was used as a 'row', like 'Balance: 1000 USDC', but now is used as columns
          // Deposit token      Balance: 10 USDC
          // some token         deposit amount
          // also i'm removing the `-` because its always showing up on landing page
          label: 'Deposit token',
          value: tokenBalanceLoading ? (
            <SkeletonLine width={60} height={10} />
          ) : tokenBalance ? (
            `Balance: ${formatCryptoBalance(tokenBalance)} ${tokenSymbol}`
          ) : (
            ''
          ),
          action: ownerView
            ? () => {
                if (tokenBalance) {
                  manualSetAmount(tokenBalance.toString())
                }
              }
            : undefined,
        }}
      />
      <AnimateHeight id="earnings" show={isOpen}>
        <ProjectedEarnings
          earnings={estimatedEarnings}
          symbol={getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList}
          isLoading={isLoadingForecast}
        />
      </AnimateHeight>
      <AnimateHeight
        id="earnings-expanded"
        show={
          amountDisplay !== '0' && !isOpen && ownerView && !isSimulation && !!forecastSummaryMap
        }
      >
        {forecastSummaryMap && (
          <ProjectedEarningsExpanded
            symbol={getDisplayToken(vault.inputToken.symbol) as TokenSymbolsList}
            forecastSummaryMap={forecastSummaryMap}
            isLoading={isLoadingForecast}
          />
        )}
      </AnimateHeight>
    </div>
  )
}
