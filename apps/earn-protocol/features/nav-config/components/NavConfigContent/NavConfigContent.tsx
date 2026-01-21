'use client'
import { type ChangeEvent, type FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain, useSmartAccountClient, useUser } from '@account-kit/react'
import {
  Badge,
  Button,
  Card,
  getAccountType,
  Icon,
  Input,
  isUserSmartAccount,
  SUCCESS_TOAST_CONFIG,
  Text,
  ToggleButton,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import { formatAddress, formatCryptoBalance, mapNumericInput } from '@summerfi/app-utils'
import Link from 'next/link'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { useSlippageConfig } from '@/features/nav-config/hooks/useSlippageConfig'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'
import { getMarketCapIndexByValue, sumrMarketCapOptions } from '@/helpers/sumr-market-cap'

import classNames from './NavConfigContent.module.css'

interface NavConfigContentProps {
  handleOpenClose?: () => void
  sumrPriceUsd?: number
}

const slippageOptions = ['0.05', '0.10', '0.20', '0.50']

export const NavConfigContent: FC<NavConfigContentProps> = ({ handleOpenClose, sumrPriceUsd }) => {
  const [isSmartAccountDeployed, setIsSmartAccountDeployed] = useState<boolean | null>(null)
  const [sumrNetApyConfig, setSumrNetApyConfig] = useSumrNetApyConfig()
  const [slippageConfig, setSlippageConfig] = useSlippageConfig()
  const { features } = useSystemConfig()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const userAAKit = useUser()
  const userIsSmartAccount = isUserSmartAccount(userAAKit)
  const { chain } = useChain()
  const { client: smartAccountClient } = useSmartAccountClient({
    type: getAccountType(chain.id),
  })
  // const [customAccountType, setCustomAccountType] = useLocalStorage(
  //   `smart-account-custom-account-type-${chain.id}`,
  //   getAccountType(chain.id, true),
  // )
  const [isDeployingSmartAccount, setIsDeployingSmartAccount] = useState(false)

  const [inputValue, setInputValue] = useState(mapNumericInput(sumrNetApyConfig.dilutedValuation))
  const [slippage, setSlippage] = useState(mapNumericInput(slippageConfig.slippage))
  const [activeSlippageOption, setActiveSlippageOption] = useState<number | undefined>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    slippageOptions.findIndex((item) => item === slippageConfig.slippage) ?? 1,
  )
  const [activeMarketCapOption, setActiveMarketCapOption] = useState<number | undefined>(
    getMarketCapIndexByValue(sumrNetApyConfig.dilutedValuation),
  )
  const [sumrToggle, setSumrToggle] = useState(sumrNetApyConfig.withSumr)

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      setInputValue(mapNumericInput(ev.target.value))
    } else {
      setInputValue('')
    }
  }

  const handleSlippageChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      setSlippage(mapNumericInput(ev.target.value))
      setActiveSlippageOption(undefined)
    } else {
      setSlippage('')
    }
  }

  const handleSlippageSave = () => {
    setSlippageConfig({ slippage })
    setSumrNetApyConfig({
      withSumr: sumrToggle,
      dilutedValuation: inputValue,
    })
    toast.success('Settings saved successfully', SUCCESS_TOAST_CONFIG)
    handleOpenClose?.()
  }

  const fetchSmartAccountDeploymentStatus = useCallback(async () => {
    if (!userIsSmartAccount) return

    if (smartAccountClient) {
      const isDeployed = await smartAccountClient.account.isAccountDeployed()

      setIsSmartAccountDeployed(isDeployed)
    } else {
      // eslint-disable-next-line no-console
      console.log('User is Smart account, but the client is not available')
      setIsSmartAccountDeployed(false)
    }
  }, [smartAccountClient, userIsSmartAccount])

  const handleDeploySmartAccount = useCallback(async () => {
    if (!smartAccountClient || !userAAKit?.address) {
      toast.error('Smart account client is not available')

      return
    }

    setIsDeployingSmartAccount(true)

    try {
      const alreadyDeployed = await smartAccountClient.account.isAccountDeployed()

      setIsSmartAccountDeployed(alreadyDeployed)

      if (!alreadyDeployed) {
        const deployHash = await smartAccountClient.sendUserOperation({
          uo: {
            target: smartAccountClient.account.address,
            data: '0x',
            value: 0n,
          },
        })

        await smartAccountClient.waitForUserOperationTransaction(deployHash)
        await fetchSmartAccountDeploymentStatus()

        toast.success('Smart account deployed successfully', SUCCESS_TOAST_CONFIG)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while deploying smart account', error)
      toast.error('Failed to deploy smart account')
    } finally {
      setIsDeployingSmartAccount(false)
    }
  }, [fetchSmartAccountDeploymentStatus, smartAccountClient, userAAKit?.address])

  useEffect(() => {
    void fetchSmartAccountDeploymentStatus()
  }, [fetchSmartAccountDeploymentStatus])

  return (
    <Card variant="cardSecondary" style={{ maxWidth: '446px' }}>
      <div className={classNames.navConfigContent}>
        <Text
          as="h5"
          variant="h5"
          style={{ marginBottom: 'var(--general-space-20)', textAlign: 'center' }}
        >
          Settings
        </Text>
        <div className={classNames.spacerHeader} />
        <div className={classNames.navConfigContentScrollable}>
          {!features?.UseSumrCoingeckoPrice && (
            <>
              <Text
                as="p"
                variant="p2semi"
                style={{
                  marginBottom: 'var(--general-space-8)',
                }}
              >
                Update $SUMR valuation
              </Text>
              <Text
                as="p"
                variant="p3"
                style={{
                  marginBottom: 'var(--general-space-16)',
                  color: 'var(--earn-protocol-secondary-60)',
                }}
              >
                Across the app, $SUMR Reward APYs depend on a Fully Diluted Valuation of the $SUMR
                token. Because the token is not currently transferrable, you must choose an
                appropriate valuation to best reflect the reward rate of the $SUMR token, or
                alternatively, exclude $SUMR from any calculations.
              </Text>
              <div className={classNames.toggleWrapper}>
                <ToggleButton
                  title="Include $SUMR"
                  checked={sumrToggle}
                  onChange={(ev) => {
                    setSumrToggle(ev.target.checked)
                  }}
                  titleVariant="p3semi"
                  wrapperStyle={{ width: '100%', justifyContent: 'space-between' }}
                  trackVariant="dark"
                />
              </div>
              <Input
                placeholder="Enter fully diluted valuation"
                variant="dark"
                value={inputValue}
                onChange={handleInputChange}
              />
              <div className={classNames.slippageOptionsWrapper}>
                {sumrMarketCapOptions.map((item, idx) => (
                  <Badge
                    value={`$${Number(item) / 1000000}M`}
                    key={item}
                    onClick={() => {
                      setInputValue(mapNumericInput(item))
                      setActiveMarketCapOption(idx)
                    }}
                    isActive={activeMarketCapOption === idx}
                  />
                ))}
              </div>
              <div className={classNames.spacerContent} />
            </>
          )}
          {sumrPriceUsd && Number(sumrPriceUsd) ? (
            <>
              <Text
                as="p"
                variant="p2semi"
                style={{
                  marginBottom: 'var(--general-space-8)',
                }}
              >
                Current $SUMR price
              </Text>
              <Text
                as="p"
                variant="p3"
                style={{
                  marginTop: 'var(--general-space-8)',
                  marginBottom: 'var(--general-space-24)',
                  color: 'var(--earn-protocol-secondary-60)',
                }}
              >
                <strong>${formatCryptoBalance(sumrPriceUsd)} SUMR/USD</strong>
              </Text>
              <div className={classNames.spacerContent} />
            </>
          ) : null}
          <Text
            as="p"
            variant="p2semi"
            style={{
              marginBottom: 'var(--general-space-8)',
            }}
          >
            Max. Slippage
          </Text>
          <Text
            as="p"
            variant="p3"
            style={{
              marginBottom: 'var(--general-space-24)',
              color: 'var(--earn-protocol-secondary-60)',
            }}
          >
            Select the amount of slippage you would like.{' '}
            <Link
              href="http://docs.summer.fi/summer.fi-pro/products/multiply/frequently-asked-questions"
              target="_blank"
            >
              <span style={{ color: 'var(--earn-protocol-primary-100)' }}>Learn more</span>
            </Link>
          </Text>
          <Input
            placeholder="Enter slippage"
            variant="dark"
            value={slippage}
            onChange={handleSlippageChange}
          />
          <div className={classNames.slippageOptionsWrapper}>
            {slippageOptions.map((item, idx) => (
              <Badge
                value={`${item}%`}
                key={item}
                onClick={() => {
                  setSlippage(mapNumericInput(item))
                  setActiveSlippageOption(idx)
                }}
                isActive={activeSlippageOption === idx}
              />
            ))}
          </div>
          {userIsSmartAccount && (
            <>
              <div className={classNames.spacerContent} />
              <Text
                as="p"
                variant="p2semi"
                style={{
                  marginBottom: 'var(--general-space-8)',
                }}
              >
                Smart account
              </Text>
              <Text
                as="p"
                variant="p3"
                style={{
                  marginBottom: 'var(--general-space-24)',
                  color: 'var(--earn-protocol-secondary-60)',
                }}
              >
                {isSmartAccountDeployed === null
                  ? 'Checking smart account status...'
                  : isSmartAccountDeployed
                    ? `Your smart account${userAAKit ? ` ${formatAddress(userAAKit.address)}` : ''} is deployed.`
                    : `Your smart account${userAAKit ? ` ${formatAddress(userAAKit.address)}` : ''} is not deployed yet.`}
              </Text>
              {isSmartAccountDeployed === false && (
                <Button
                  variant="secondaryMedium"
                  onClick={handleDeploySmartAccount}
                  disabled={isDeployingSmartAccount}
                  style={{ marginBottom: 'var(--general-space-24)' }}
                >
                  {isDeployingSmartAccount ? 'Deploying...' : 'Deploy smart account'}
                </Button>
              )}
              {/** This isnt working well, commenting it out for now */}
              {/* <Text
                as="p"
                variant="p3"
                style={{
                  marginBottom: 'var(--general-space-24)',
                  color: 'var(--earn-protocol-secondary-60)',
                }}
              >
                {`Your account type is ${customAccountType && getAccountType(chain.id, true) !== customAccountType ? `overriden to ${customAccountType}` : getAccountType(chain.id)}`}
                . You can change it below.
              </Text>

              <div className={classNames.slippageOptionsWrapper}>
                {['ModularAccountV2', 'MultiOwnerModularAccount', 'Remove override'].map((item) => (
                  <Badge
                    value={item}
                    key={item}
                    onClick={() => {
                      if (item === 'Remove override') {
                        setCustomAccountType(null)

                        return
                      }
                      setCustomAccountType(item as 'ModularAccountV2' | 'MultiOwnerModularAccount')
                    }}
                    isActive={customAccountType === item && getAccountType(chain.id, true) !== item}
                  />
                ))}
              </div> */}
            </>
          )}
        </div>
        <div
          style={
            handleOpenClose && isMobile
              ? {
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingTop: 'var(--general-space-16)',
                  backgroundColor: 'var(--earn-protocol-neutral-90)',
                }
              : {
                  paddingTop: 'var(--general-space-16)',
                  backgroundColor: 'var(--earn-protocol-neutral-90)',
                }
          }
        >
          {handleOpenClose && isMobile && (
            <Button variant="secondaryMedium" onClick={handleOpenClose}>
              <Icon iconName="close" size={12} style={{ opacity: 0.5 }} />
              Close
            </Button>
          )}
          <Button
            variant="primaryMedium"
            onClick={handleSlippageSave}
            disabled={
              (sumrNetApyConfig.dilutedValuation === inputValue.replaceAll(',', '') &&
                sumrNetApyConfig.withSumr === sumrToggle &&
                slippageConfig.slippage === slippage.replaceAll(',', '')) ||
              slippage === '' ||
              slippage.endsWith('.')
            }
          >
            Save changes
          </Button>
        </div>
      </div>
    </Card>
  )
}
