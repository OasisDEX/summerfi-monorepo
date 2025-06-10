import { Logger } from '@aws-lambda-powertools/logger'
import { OkxQuestResult } from './types'
import { OkxQuestDataQuery } from '@summerfi/summer-earn-protocol-subgraph'
import { zeroAddress } from 'viem'

const secondsInAWeek = 7 * 24 * 60 * 60 // 7 days in seconds

const filterEligiblePositions = (positionData: OkxQuestDataQuery['okxPositionsData'][number]) => {
  // Check if the user has deposited 100 USDC, 100 EURC, or 0.1 ETH
  return (
    (['USDC', 'EURC'].includes(positionData.vault.inputToken.symbol) &&
      positionData.inputTokenBalanceNormalized >= 100) ||
    (['WETH', 'ETH'].includes(positionData.vault.inputToken.symbol) &&
      positionData.inputTokenBalanceNormalized >= 0.1)
  )
}

const checkQuest1 = ({
  logger,
  walletAddress,
  okxQuestData,
}: {
  walletAddress: string
  okxQuestData: OkxQuestDataQuery
  logger: Logger
}): OkxQuestResult => {
  // Quest 1 - Deposit 100 USDC or 100 EURC or 0.1 ETH on Base
  logger.info(`Checking OKX quest 1 for wallet: ${walletAddress}`)

  const eligiblePositions = okxQuestData.okxPositionsData.filter(filterEligiblePositions)

  return {
    questNumber: 1,
    completed: eligiblePositions.length > 0,
    debugData: {
      eligiblePosition: {
        token: eligiblePositions.map((position) => position.vault.inputToken.symbol)?.[0],
        amount: eligiblePositions.map((position) => position.inputTokenBalanceNormalized)?.[0],
      },
    },
  }
}

const checkQuest2 = ({
  logger,
  walletAddress,
  okxQuestData,
}: {
  walletAddress: string
  okxQuestData: OkxQuestDataQuery
  logger: Logger
}): OkxQuestResult => {
  // Quest 2 - Keep earning for 7 days
  logger.info(`Checking OKX quest 2 for wallet: ${walletAddress}`)

  const eligiblePositions = okxQuestData.okxPositionsData.filter(filterEligiblePositions)

  const eligiblePositionsWith7DaysOfEarnings = eligiblePositions.filter(
    (position) =>
      position.createdTimestamp &&
      Number(position.createdTimestamp) + secondsInAWeek <= Number(Date.now() / 1000),
  )

  return {
    questNumber: 2,
    completed: eligiblePositionsWith7DaysOfEarnings.length > 0,
    debugData: {
      eligiblePosition: {
        token: eligiblePositions.map((position) => position.vault.inputToken.symbol)?.[0],
        amount: eligiblePositions.map((position) => position.inputTokenBalanceNormalized)?.[0],
      },
      eligiblePositionsWith7DaysOfEarnings: eligiblePositionsWith7DaysOfEarnings.map(
        (position) => ({
          daysEarning: Math.floor(
            (Number(Date.now() / 1000) - Number(position.createdTimestamp)) / (60 * 60 * 24),
          ),
        }),
      ),
    },
  }
}

const checkQuest3 = ({
  logger,
  walletAddress,
  okxQuestData,
}: {
  walletAddress: string
  okxQuestData: OkxQuestDataQuery
  logger: Logger
}): OkxQuestResult => {
  // Quest 3 - Claim SUMR tokens
  logger.info(`Checking OKX quest 3 for wallet: ${walletAddress}`)

  const eligiblePositionsWithClaimedSUMRToken = okxQuestData.okxAccountData.filter(
    (position) =>
      position.claimedSummerTokenNormalized && position.claimedSummerTokenNormalized > 0,
  )

  return {
    questNumber: 3,
    completed: eligiblePositionsWithClaimedSUMRToken.length > 0,
    debugData: {
      eligiblePositionsWithClaimedSUMRToken: eligiblePositionsWithClaimedSUMRToken.map(
        (position) => ({
          claimedSUMR: Number(position.claimedSummerTokenNormalized),
        }),
      ),
    },
  }
}

const checkQuest4 = ({
  logger,
  walletAddress,
  delegatesData,
}: {
  walletAddress: string
  delegatesData: string
  logger: Logger
}): OkxQuestResult => {
  // Quest 4 - Stake and Delegate SUMR tokens
  logger.info(`Checking OKX quest 4 for wallet: ${walletAddress}`)

  if (!delegatesData) {
    logger.warn(`No delegates data provided for wallet: ${walletAddress}`)
    return {
      questNumber: 4,
      completed: false,
      debugData: {
        reason: 'No delegates data provided',
      },
    }
  }
  const resolvedDelegatesData = delegatesData.toLowerCase()
  const resolvedWalletAddress = walletAddress.toLowerCase()
  const isDelegatedToSelf = resolvedDelegatesData === resolvedWalletAddress
  const isDelegatedToSomeoneElse =
    resolvedDelegatesData !== zeroAddress.toLowerCase() && !isDelegatedToSelf

  return {
    questNumber: 4,
    completed: isDelegatedToSelf || isDelegatedToSomeoneElse,
    debugData: {
      isDelegatedToSelf,
      isDelegatedToSomeoneElse,
    },
  }
}

export const checkOKXQuestsUpTo = ({
  questNumber,
  walletAddress,
  okxQuestData,
  delegatesData,
  logger,
}: {
  questNumber: number
  walletAddress: string
  okxQuestData: OkxQuestDataQuery
  delegatesData: string // Optional, used for quest 4
  logger: Logger
}): OkxQuestResult[] => {
  const results: OkxQuestResult[] = []

  // Define quest checkers in order
  const questCheckers = [
    () => checkQuest1({ okxQuestData, walletAddress, logger }),
    () => checkQuest2({ okxQuestData, walletAddress, logger }),
    () => checkQuest3({ okxQuestData, walletAddress, logger }),
    () => checkQuest4({ walletAddress, delegatesData, logger }),
  ]

  // Execute quests sequentially, stopping if any quest fails
  for (let i = 0; i < Math.min(questNumber, questCheckers.length); i++) {
    const questResult = questCheckers[i]()
    results.push(questResult)

    // If this quest is not completed, mark all subsequent quests as not completed
    if (!questResult.completed) {
      // Add remaining quests as not completed without executing their logic
      for (let j = i + 1; j < Math.min(questNumber, questCheckers.length); j++) {
        results.push({
          questNumber: j + 1,
          completed: false,
          debugData: {
            reason: `Quest ${i + 1} not completed`,
          },
        })
      }
      break
    }
  }

  return results
}
