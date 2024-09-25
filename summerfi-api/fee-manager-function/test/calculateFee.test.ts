import { calculateFee } from '../src/calculateFee'
import {
  supportedCloseEvents,
  supportedDeriskEvents,
  supportedOpenEvents,
  supportedWithdrawEvents,
} from '../src/constants'
import type { OasisPosition } from '../src/types'

const startTimestamp = 1620000000000
const dayInMilis = 1 * 24 * 60 * 60 * 1000

describe('calculateFee', () => {
  it('should throw for position without open event', () => {
    const position = {
      events: [
        {
          kind: supportedCloseEvents[0],
          timestamp: startTimestamp,
          swapToToken: 'stETH',
          swapToAmount: '1000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'stETH',
        },
      ],
    } as unknown as OasisPosition

    expect(() => calculateFee(position)).toThrow(
      'Position is missing open event, not possible to calculate fee',
    )
  })

  it('should throw for closed positions', () => {
    const position = {
      events: [
        {
          kind: supportedOpenEvents[0],
          timestamp: startTimestamp,
          swapToToken: 'stETH',
          swapToAmount: '1000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'stETH',
        },
        {
          kind: supportedCloseEvents[0],
          timestamp: startTimestamp + dayInMilis,
          swapToToken: 'stETH',
          swapToAmount: '1000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'stETH',
        },
      ],
    } as unknown as OasisPosition

    expect(() => calculateFee(position)).toThrow(
      'Position is closed, not possible to calculate fee',
    )
  })

  it('should calculate fee correctly for 0 deposit', () => {
    const position = {
      events: [
        {
          kind: supportedOpenEvents[0],
          timestamp: startTimestamp,
          swapToToken: 'USDC',
          swapToAmount: '0',
          swapFromToken: 'wETH',
          swapFromAmount: '0',
          debtToken: 'USDC',
        },
      ],
    } as unknown as OasisPosition

    const fee = calculateFee(position, startTimestamp + dayInMilis * 100)
    expect(fee).toBe('0')
  })
  it('should calculate fee correctly for single deposit', () => {
    const position = {
      events: [
        {
          kind: supportedOpenEvents[0],
          timestamp: startTimestamp,
          swapToToken: 'USDC',
          swapToAmount: '900000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
      ],
    } as unknown as OasisPosition

    const fee = calculateFee(position, startTimestamp + dayInMilis * 100)
    expect(fee).toBe('49.31506849315068')
  })

  it('should calculate fee correctly for two deposits', () => {
    const position = {
      events: [
        {
          kind: supportedOpenEvents[0],
          timestamp: startTimestamp,
          swapToToken: 'USDC',
          swapToAmount: '90',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: 'DEPOSIT',
          timestamp: startTimestamp + dayInMilis * 10,
          swapToToken: 'USDC',
          swapToAmount: 900000 - 90,
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
      ],
    } as unknown as OasisPosition

    const closeTimestamp = startTimestamp + dayInMilis * 110
    const fee = calculateFee(position, closeTimestamp)
    expect(fee).toBe('49.3155616438356115068')
  })

  it('should calculate fee correctly for deposits and withdraw', () => {
    const position = {
      events: [
        {
          kind: supportedOpenEvents[0],
          timestamp: startTimestamp,
          swapToToken: 'USDC',
          swapToAmount: '90',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: 'DEPOSIT',
          timestamp: startTimestamp + dayInMilis * 10,
          swapToToken: 'USDC',
          swapToAmount: 900000 - 90,
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: supportedWithdrawEvents[0],
          timestamp: startTimestamp + dayInMilis * 110,
          swapToToken: 'USDC',
          swapToAmount: '450000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
      ],
    } as unknown as OasisPosition

    const closeTimestamp = startTimestamp + dayInMilis * 310
    const fee = calculateFee(position, closeTimestamp)
    expect(fee).toBe('98.6306301369862915068')
  })

  it('should calculate fee correctly for deposit in reopened position', () => {
    const position = {
      events: [
        {
          kind: supportedOpenEvents[0],
          timestamp: startTimestamp,
          swapToToken: 'USDC',
          swapToAmount: '90',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: 'DEPOSIT',
          timestamp: startTimestamp + dayInMilis * 10,
          swapToToken: 'USDC',
          swapToAmount: '900000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: supportedWithdrawEvents[0],
          timestamp: startTimestamp + dayInMilis * 110,
          swapToToken: 'USDC',
          swapToAmount: '450000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: supportedCloseEvents[0],
          timestamp: startTimestamp + dayInMilis * 310,
          swapToToken: 'USDC',
          swapToAmount: '450000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: 'DEPOSIT',
          timestamp: startTimestamp + dayInMilis * 350,
          swapToToken: 'USDC',
          swapToAmount: '90000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
      ],
    } as unknown as OasisPosition

    const closeTimestamp = startTimestamp + dayInMilis * 715
    const fee = calculateFee(position, closeTimestamp)
    expect(fee).toBe('18')
  })

  it('should calculate fee correctly for deposit and derisk in reopened position', () => {
    const position = {
      events: [
        {
          kind: supportedOpenEvents[0],
          timestamp: startTimestamp,
          swapToToken: 'USDC',
          swapToAmount: '90',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: 'DEPOSIT',
          timestamp: startTimestamp + dayInMilis * 10,
          swapToToken: 'USDC',
          swapToAmount: '900000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: supportedWithdrawEvents[0],
          timestamp: startTimestamp + dayInMilis * 110,
          swapToToken: 'USDC',
          swapToAmount: '450000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: supportedCloseEvents[0],
          timestamp: startTimestamp + dayInMilis * 310,
          swapToToken: 'USDC',
          swapToAmount: '450000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: 'DEPOSIT',
          timestamp: startTimestamp + dayInMilis * 350,
          swapToToken: 'USDC',
          swapToAmount: '90000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
        {
          kind: supportedDeriskEvents[0],
          timestamp: startTimestamp + dayInMilis * 715,
          swapToToken: 'USDC',
          swapToAmount: '25000',
          swapFromToken: 'wETH',
          swapFromAmount: '1',
          debtToken: 'USDC',
        },
      ],
    } as unknown as OasisPosition

    const closeTimestamp = startTimestamp + dayInMilis * 750
    const fee = calculateFee(position, closeTimestamp)
    expect(fee).toBe('1.2465753424657533')
  })
})
