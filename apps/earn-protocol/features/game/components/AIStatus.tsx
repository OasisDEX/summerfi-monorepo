import { useEffect, useState } from 'react'
import clsx from 'clsx'

import styles from './AIStatus.module.css'

const messages = [
  'AI always picks the highest APY for optimal results.',
  'AI is making a smart choice for you.',
  "AI's speed and precision surpass manual play every time.",
  "No human can match the AI's quick and accurate decisions!",
  'AI delivers instant, flawless choices—faster than any player.',
  'Enjoy the efficiency: AI never hesitates or makes mistakes.',
  'AI is crunching the numbers in milliseconds!',
  'AI never gets tired or distracted.',
  'AI is scanning for the best possible move...',
  'AI is on a streak of perfect decisions!',
  'AI is evaluating every card for maximum gain.',
  'AI is always focused and ready to play.',
  'AI is making another lightning-fast pick!',
  'AI is optimizing your score with every move.',
  'AI is working at superhuman speed!',
  'AI is calculating the optimal outcome...',
  'AI is always one step ahead!',
  'With AI playing, you can relax and enjoy your free time!',
  'Let AI handle the details—use your time for what matters most.',
  'AI is working for you, so you can take a break!',
  'Spend your saved time on something fun while AI plays.',
  'AI is optimizing your game—now you can optimize your day!',
  'Let AI do the work, you enjoy the results.',
  'AI is playing, so you can focus on what you love.',
]

const FADE_DURATION = 400 // ms
const DISPLAY_DURATION = 5000 // ms

const AIStatus: React.FC = () => {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const fadeOut = setTimeout(() => setFade(false), DISPLAY_DURATION)
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % messages.length)
      setFade(true)
    }, DISPLAY_DURATION + FADE_DURATION)

    return () => {
      clearTimeout(fadeOut)
      clearTimeout(next)
    }
  }, [index])

  return (
    <div
      className={clsx(styles.aiStatus, fade ? styles.fadeIn : styles.fadeOut)}
      aria-live="polite"
    >
      {messages[index]}
    </div>
  )
}

export default AIStatus
