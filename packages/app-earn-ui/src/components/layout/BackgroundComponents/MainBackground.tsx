import { SummerBall } from '@/components/atoms/SummerBall/SummerBall'

import mainBackgroundStyles from './MainBackground.module.scss'

export const MainBackground = () => {
  return (
    <div className={mainBackgroundStyles.underwear}>
      <SummerBall size={95} style={{ top: '360px', left: 'calc(50% + 340px)' }} />
      <SummerBall size={130} blurSize={20} style={{ top: '550px', left: 'calc(50% - 650px)' }} />
      <SummerBall size={192} blurSize={10} style={{ top: '700px', left: 'calc(50% + 470px)' }} />
      <SummerBall size={150} style={{ top: '960px', left: 'calc(50% - 410px)' }} />
      <SummerBall size={60} blurSize={5} style={{ top: '1360px', left: 'calc(50% + 510px)' }} />
      <SummerBall size={200} blurSize={50} style={{ top: '1560px', left: 'calc(50% - 610px)' }} />
      <SummerBall size={150} style={{ top: '1700px', left: 'calc(50% + 550px)' }} />
      <SummerBall size={100} style={{ top: '1950px', left: 'calc(50% - 450px)' }} />
    </div>
  )
}
