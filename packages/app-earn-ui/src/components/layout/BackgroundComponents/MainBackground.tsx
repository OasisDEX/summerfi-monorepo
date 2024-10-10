import { SummerBall } from '@/components/atoms/SummerBall/SummerBall'

import mainBackgroundStyles from './MainBackground.module.scss'

export const MainBackground = () => {
  return (
    <div className={mainBackgroundStyles.underware}>
      <SummerBall size={95} style={{ top: '360px', left: 'calc(50% + 340px)' }} />
      <SummerBall size={130} blurSize={20} style={{ top: '550px', left: 'calc(50% - 650px)' }} />
      <SummerBall size={192} blurSize={10} style={{ top: '700px', left: 'calc(50% + 470px)' }} />
      <SummerBall size={150} style={{ top: '960px', left: 'calc(50% - 410px)' }} />
    </div>
  )
}
