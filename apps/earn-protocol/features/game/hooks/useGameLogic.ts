/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRef, useCallback, useEffect, useRef, useState } from 'react' // Import createRef

import { playCorrectSound, playIncorrectSound } from '@/features/game/helpers/audioHelpers'
import { generateCards } from '@/features/game/helpers/gameHelpers'
import { type CardData } from '@/features/game/types'

import { useAIPlayer } from './useAIPlayer'

interface UseGameLogicProps {
  isAI: boolean
  onGameOver: (params: {
    score: number
    streak: number
    rounds: number
    lastCards?: CardData[]
    lastSelected?: number | null
    avgResponse?: number
    timedOut?: boolean
  }) => void
}

// Helper for random label
function getRandomLabel() {
  const labels = [
    'NICE!',
    'PERFECT!',
    'GREAT!',
    'AWESOME!',
    'EXCELLENT!',
    'IMPRESSIVE!',
    'SUPERB!',
    'FANTASTIC!',
    'BRILLIANT!',
    'AMAZING!',
    'WOW!',
    'STELLAR!',
    'ON\u00A0FIRE!',
    'UNSTOPPABLE!',
    'LEGENDARY!',
  ]

  return labels[Math.floor(Math.random() * labels.length)]
}

function getRandomPastelColor() {
  // HSL with high lightness and medium saturation for pastel
  const hue = Math.floor(Math.random() * 360)

  return `hsl(${hue}, 60%, 70%)`
}

// Define structure for flying APY state
interface FlyingApyState {
  id: number
  apy: number
  x: number
  y: number
  color: string
}

export function useGameLogic({ isAI, onGameOver }: Omit<UseGameLogicProps, 'handleSelect'>) {
  const [cards, setCards] = useState<CardData[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)
  const [timer, setTimer] = useState(5)
  const [gameOver, setGameOver] = useState(false)
  const [scoreAnim, setScoreAnim] = useState(false)
  const [streakAnim, setStreakAnim] = useState(false)
  const [streakAnimProps, setStreakAnimProps] = useState({
    angle: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    label: 'PERFECT!',
    color: '#ffb300',
  })
  const [responseTimes, setResponseTimes] = useState<number[]>([])
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const prevStreakRef = useRef(streak)
  const [flyingApys, setFlyingApys] = useState<FlyingApyState[]>([])
  const flyingApyIdCounter = useRef(0)
  const cardRefs = useRef<HTMLDivElement[]>([]) // Ref to hold card DOM elements

  const validResponses = responseTimes.length > 1 ? responseTimes.slice(1) : []
  const avgResponse =
    validResponses.length > 0
      ? validResponses.reduce((a, b) => a + b, 0) / validResponses.length
      : 0

  const nextRound = useCallback((decreaseTime = true, nextRoundNumber: number) => {
    setSelected(null) // Clear selection immediately
    setCards(() => generateCards(nextRoundNumber))
    setRound(nextRoundNumber)
    setTimer((t) => {
      const newTime = decreaseTime ? Math.max(1.2, t - 0.1) : t

      setTimeLeft(newTime)

      return newTime
    })
    setRoundStartTime(Date.now())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    nextRound(false, 1) // Start with round 1
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setGameOver(false)
    setResponseTimes([])
  }, [nextRound])

  // Ensure refs array has the correct size when cards change
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, cards.length)
    for (let i = 0; i < cards.length; i++) {
      // Ensure each index has a ref object, even if the element isn't mounted yet
      if (!cardRefs.current[i]) {
        cardRefs.current[i] = createRef<HTMLDivElement>().current!
      }
    }
  }, [cards])

  // Handle card selection - update signature to include event and aiCoords
  const handleSelect = useCallback(
    (
      idx: number,
      ev?: React.MouseEvent<HTMLDivElement>,
      aiCoords?: { x: number; y: number }, // Add optional AI coordinates
    ) => {
      if (selected !== null || gameOver) return

      const currentCards = cards
      const maxApy = Math.max(...currentCards.map((c) => c.apy))
      const correctIdx = currentCards.findIndex((c) => c.apy === maxApy)

      let startX: number | null = null
      let startY: number | null = null
      let cardDataForAnim: CardData | null = null

      if (idx === correctIdx) {
        cardDataForAnim = currentCards[idx]
        if (ev) {
          // User click
          startX = ev.clientX
          startY = ev.clientY
        } else if (aiCoords) {
          // AI selection - Use provided coords
          startX = aiCoords.x
          startY = aiCoords.y
        } else {
          // Fallback if neither event nor aiCoords provided (shouldn't happen for correct idx)
          // eslint-disable-next-line no-console
          console.warn(`Correct selection at index ${idx} but no coordinates provided.`)
          startX = window.innerWidth / 2
          startY = window.innerHeight * 0.4
        }
      }

      setSelected(idx)

      const now = Date.now()
      const responseTime = (now - roundStartTime) / 1000
      const actualRemainingTime = Math.max(0, timer - responseTime)

      if (idx !== -1) {
        setResponseTimes((times) => [...times, responseTime])
      }

      let points = 0
      const perfect = responseTime > 1 ? actualRemainingTime > 1 : true

      if (idx === correctIdx) {
        playCorrectSound(actualRemainingTime, timer)
        points = Math.floor(Number(100 * (actualRemainingTime / timer)) + 10)
        nextRound(
          true,
          round + 1, // Cap at round 30
        )

        if (startX !== null && startY !== null && cardDataForAnim !== null) {
          const newId = flyingApyIdCounter.current++
          let apyColor = '#1a2233'

          if (cardDataForAnim.apy >= 10) apyColor = '#1db954'
          else if (cardDataForAnim.apy <= 3) apyColor = '#d7263d'
          else if (cardDataForAnim.apy <= 5) apyColor = 'rgb(120,40,40)'

          setFlyingApys((prev) => [
            ...prev,
            {
              id: newId,
              apy: cardDataForAnim.apy,
              x: startX!,
              y: startY!,
              color: apyColor,
            },
          ])
        }
      } else {
        playIncorrectSound()

        setGameOver(true)
        onGameOver({
          score,
          streak: bestStreak,
          rounds: round,
          lastCards: currentCards,
          lastSelected: idx === -1 ? null : idx,
          avgResponse,
          timedOut: idx === -1,
        })
      }

      setScore((s) => Math.max(0, s + points + (perfect && streak >= 2 ? 5 : 0)))
      setStreak((s) => (perfect ? s + 1 : 0))
      setBestStreak((s) => (perfect ? Math.max(s, streak + 1) : s))
    },
    [
      selected,
      gameOver,
      roundStartTime,
      cards,
      timer,
      streak,
      bestStreak,
      round,
      score,
      nextRound,
      onGameOver,
      avgResponse,
    ],
  )

  // Function to remove completed flying APY animations
  const handleFlyingApyComplete = useCallback((id: number) => {
    setFlyingApys((prev) => prev.filter((apy) => apy.id !== id))
  }, [])

  // Timer logic
  useEffect(() => {
    if (gameOver) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    let last = Date.now()

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const now = Date.now()
        const dt = (now - last) / 1000

        last = now
        if (t - dt <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          handleSelect(-1) // time out

          return 0
        }

        return t - dt
      })
    }, 30)

    // eslint-disable-next-line consistent-return
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [round, gameOver, handleSelect])

  // Animate score
  useEffect(() => {
    if (score > 0) {
      setScoreAnim(true)
      setTimeout(() => setScoreAnim(false), 350)
    }
  }, [score])

  // Animate streak (now called 'perfect', based on answer time < 1s)
  useEffect(() => {
    if (responseTimes.length > 1 && responseTimes[responseTimes.length - 1] < 1) {
      setStreakAnim(false)
      setTimeout(() => {
        // Calculate scale based on round, capped at 3
        const calculatedScale = Math.min(3, 1 + Number(round * 0.05)) // Adjust factor as needed

        setStreakAnimProps({
          angle: Number(Math.random() * 60) - 30,
          offsetX: Number(Math.random() * 60) - 30,
          offsetY: Number(Math.random() * 30) - 15,
          scale: calculatedScale, // Use calculated scale
          label: getRandomLabel(),
          color: getRandomPastelColor(),
        })
        setStreakAnim(true)
      }, 10)
      setTimeout(() => setStreakAnim(false), 360)
    }
    prevStreakRef.current = streak
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseTimes, round]) // Add round to dependency array

  // AI integration - Use refs instead of querySelector
  useAIPlayer({
    enabled: isAI && !gameOver,
    cards,
    onSelect: (idx) => {
      const cardElement = cardRefs.current[idx] // Get element from ref array
      let coords = { x: window.innerWidth / 2, y: window.innerHeight * 0.4 } // Fallback

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect()

        coords = {
          x: rect.left + Number(rect.width / 2),
          y: rect.top + Number(rect.height / 2),
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `[useAIPlayer] Card ref for index ${idx} not found before calling handleSelect.`,
        )
      }
      handleSelect(idx, undefined, coords) // Call handleSelect with coords
    },
    round,
  })

  // End game if time runs out
  useEffect(() => {
    if (timeLeft <= 0 && !gameOver && selected === null) {
      setGameOver(true)
      onGameOver({
        score,
        streak: bestStreak,
        rounds: round,
        lastCards: cards,
        lastSelected: null,
        avgResponse,
        timedOut: true,
      })
    }
  }, [timeLeft, gameOver, selected, score, bestStreak, round, onGameOver, cards, avgResponse])

  return {
    cards,
    setCards,
    selected,
    setSelected,
    score,
    setScore,
    streak,
    setStreak,
    bestStreak,
    setBestStreak,
    round,
    setRound,
    timeLeft,
    setTimeLeft,
    timer,
    setTimer,
    gameOver,
    setGameOver,
    scoreAnim,
    setScoreAnim,
    streakAnim,
    setStreakAnim,
    streakAnimProps,
    responseTimes,
    setResponseTimes,
    roundStartTime,
    setRoundStartTime,
    intervalRef,
    avgResponse,
    validResponses,
    nextRound,
    onGameOver,
    isAI,
    handleSelect,
    flyingApys,
    handleFlyingApyComplete,
    cardRefs, // Pass down the ref array
  }
}
