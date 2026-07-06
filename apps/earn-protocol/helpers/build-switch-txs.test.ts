import { Token } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { buildSwitchTransactions } from '@/helpers/build-switch-txs'

const USER_ADDRESS = '0x1111111111111111111111111111111111111111' as const
const SOURCE_FLEET_ADDRESS = '0x2222222222222222222222222222222222222222'
const DESTINATION_FLEET_ADDRESS = '0x3333333333333333333333333333333333333333'

const vaultToken = Token.createFromEthereum({
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  chainId: 1,
  addressValue: '0x4444444444444444444444444444444444444444',
})

describe('buildSwitchTransactions', () => {
  it('parses the destination fleet address out of `selectedSwitchVault` and forwards it', async () => {
    const getVaultSwitchTx = jest.fn().mockResolvedValue([])

    await buildSwitchTransactions({
      selectedSwitchVault: `${DESTINATION_FLEET_ADDRESS}-8453`,
      vaultToken,
      amount: new BigNumber(10),
      userWalletAddress: USER_ADDRESS,
      sourceFleetAddress: SOURCE_FLEET_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vaultChainId: 1 as any,
      slippage: 0.5,
      getVaultSwitchTx,
    })

    expect(getVaultSwitchTx).toHaveBeenCalledTimes(1)
    const [[callArgs]] = getVaultSwitchTx.mock.calls

    expect(callArgs.destinationFleetAddress).toBe(DESTINATION_FLEET_ADDRESS)
    expect(callArgs.sourceFleetAddress).toBe(SOURCE_FLEET_ADDRESS)
    expect(callArgs.slippage).toBe(0.5)
    expect(callArgs.walletAddress.value).toBe(USER_ADDRESS)
  })

  it('uses the explicit amount (in the vault token decimals) when it is greater than zero', async () => {
    const getVaultSwitchTx = jest.fn().mockResolvedValue([])

    await buildSwitchTransactions({
      selectedSwitchVault: `${DESTINATION_FLEET_ADDRESS}-8453`,
      vaultToken,
      amount: new BigNumber('150.5'),
      positionAmount: new BigNumber('999'),
      userWalletAddress: USER_ADDRESS,
      sourceFleetAddress: SOURCE_FLEET_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vaultChainId: 1 as any,
      slippage: 0.5,
      getVaultSwitchTx,
    })

    const [[callArgs]] = getVaultSwitchTx.mock.calls

    expect(callArgs.amount.amount).toBe('150.5')
    expect(callArgs.amount.token.symbol).toBe('USDC')
  })

  it('falls back to the full position amount when amount is undefined', async () => {
    const getVaultSwitchTx = jest.fn().mockResolvedValue([])

    await buildSwitchTransactions({
      selectedSwitchVault: `${DESTINATION_FLEET_ADDRESS}-8453`,
      vaultToken,
      amount: undefined,
      positionAmount: new BigNumber('75.25'),
      userWalletAddress: USER_ADDRESS,
      sourceFleetAddress: SOURCE_FLEET_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vaultChainId: 1 as any,
      slippage: 0.5,
      getVaultSwitchTx,
    })

    expect(getVaultSwitchTx.mock.calls[0][0].amount.amount).toBe('75.25')
  })

  it('falls back to the full position amount when amount is zero', async () => {
    const getVaultSwitchTx = jest.fn().mockResolvedValue([])

    await buildSwitchTransactions({
      selectedSwitchVault: `${DESTINATION_FLEET_ADDRESS}-8453`,
      vaultToken,
      amount: new BigNumber(0),
      positionAmount: new BigNumber('42'),
      userWalletAddress: USER_ADDRESS,
      sourceFleetAddress: SOURCE_FLEET_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vaultChainId: 1 as any,
      slippage: 0.5,
      getVaultSwitchTx,
    })

    expect(getVaultSwitchTx.mock.calls[0][0].amount.amount).toBe('42')
  })

  it('defaults to "0" when neither amount nor positionAmount are provided', async () => {
    const getVaultSwitchTx = jest.fn().mockResolvedValue([])

    await buildSwitchTransactions({
      selectedSwitchVault: `${DESTINATION_FLEET_ADDRESS}-8453`,
      vaultToken,
      amount: undefined,
      positionAmount: undefined,
      userWalletAddress: USER_ADDRESS,
      sourceFleetAddress: SOURCE_FLEET_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vaultChainId: 1 as any,
      slippage: 0.5,
      getVaultSwitchTx,
    })

    expect(getVaultSwitchTx.mock.calls[0][0].amount.amount).toBe('0')
  })

  it('marks every returned transaction as not-yet-executed', async () => {
    const getVaultSwitchTx = jest
      .fn()
      .mockResolvedValue([{ description: 'tx1' }, { description: 'tx2' }])

    const result = await buildSwitchTransactions({
      selectedSwitchVault: `${DESTINATION_FLEET_ADDRESS}-8453`,
      vaultToken,
      amount: new BigNumber(1),
      userWalletAddress: USER_ADDRESS,
      sourceFleetAddress: SOURCE_FLEET_ADDRESS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vaultChainId: 1 as any,
      slippage: 0.5,
      getVaultSwitchTx,
    })

    expect(result).toEqual([
      { description: 'tx1', executed: false },
      { description: 'tx2', executed: false },
    ])
  })
})
