'use client'
import { useCallback, useMemo } from 'react'
import {
  type IArmadaVaultInfo,
  type RewardTokenPrices,
  type SDKVaultishType,
  type VaultApyData,
} from '@summerfi/app-types'
import { findVaultInfo } from '@summerfi/app-utils'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'

import {
  SlideCarouselButton,
  usePrevNextButtons,
} from '@/components/molecules/SlideCarousel/SlideCarouselButtons'
import { VaultCardHomepage } from '@/components/molecules/VaultCardHomepage/VaultCardHomepage'

import vaultCardsCarouselStyles from './VaultCardsCarousel.module.css'

type VaultCardsCarouselProps = {
  vaultsList?: SDKVaultishType[]
  vaultsApyByNetworkMap?: {
    [key: `${string}-${number}`]: VaultApyData
  }
  onGetStartedClick?: (vault?: SDKVaultishType) => void
  vaultsInfo?: IArmadaVaultInfo[]
  rewardTokenPrices?: RewardTokenPrices
}

export const VaultCardsCarousel = ({
  vaultsList,
  vaultsApyByNetworkMap,
  onGetStartedClick,
  vaultsInfo,
  rewardTokenPrices,
}: VaultCardsCarouselProps): React.ReactNode => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    skipSnaps: true,
  })
  // const [selectedIndex, setSelectedIndex] = useState(0)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  // useEffect(() => {
  //   if (emblaApi) {
  //     emblaApi.on('select', () => {
  //       setSelectedIndex(emblaApi.selectedScrollSnap())
  //     })
  //   }
  // }, [emblaApi])

  const selectSlide = useCallback(
    (slideIndex: number) => () => {
      if (emblaApi) {
        emblaApi.scrollTo(slideIndex)
      }
    },
    [emblaApi],
  )

  const vaultsCards = useMemo(() => {
    return (
      vaultsList ? vaultsList : (Array.from({ length: 10 }) as (SDKVaultishType | undefined)[])
    ).sort((a, b) => {
      const aTime = a?.createdTimestamp ?? 0
      const bTime = b?.createdTimestamp ?? 0

      return Number(bTime) - Number(aTime)
    })
  }, [vaultsList])

  // const vaultsDots = useMemo(() => {
  //   return vaultsList?.map((_, idx) => (
  //     <div
  //       key={idx}
  //       className={`${vaultCardsCarouselStyles.dot} ${idx === selectedIndex ? vaultCardsCarouselStyles.dotActive : ''}`}
  //       onClick={selectSlide(idx)}
  //     />
  //   ))
  // }, [vaultsList, selectedIndex, selectSlide])

  return (
    <div className={vaultCardsCarouselStyles.vaultCardsCarouselWrapper}>
      <section className={`${vaultCardsCarouselStyles.embla}`}>
        <div className={vaultCardsCarouselStyles.emblaButtonsWrapper}>
          <div className={vaultCardsCarouselStyles.emblaButtons}>
            <SlideCarouselButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              direction="left"
              iconVariant="xs"
              className={vaultCardsCarouselStyles.homepageEmblaButton}
            />
            <SlideCarouselButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              direction="right"
              iconVariant="xs"
              className={vaultCardsCarouselStyles.homepageEmblaButton}
            />
          </div>
        </div>
        <div className={vaultCardsCarouselStyles.emblaViewport} ref={emblaRef}>
          <div className={vaultCardsCarouselStyles.emblaContainer}>
            {vaultsCards.map((vault, vaultIndex) => (
              <div
                className={clsx(vaultCardsCarouselStyles.emblaSlide, 'embla__slide')}
                key={`VaultCardHomepage_${vault?.id ?? vaultIndex}_${vault?.protocol.network}`}
              >
                <div className={vaultCardsCarouselStyles.emblaSlideNumber}>
                  <VaultCardHomepage
                    vault={vault}
                    onSelect={selectSlide(vaultIndex)}
                    vaultsApyByNetworkMap={vaultsApyByNetworkMap}
                    selected // in new design all cards are 'active'
                    rewardTokenPrices={rewardTokenPrices}
                    isLoading={!vaultsList}
                    onGetStartedClick={onGetStartedClick}
                    vaultInfo={findVaultInfo(vaultsInfo, vault)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className={vaultCardsCarouselStyles.dotsBottom}>{vaultsDots}</div> */}
      </section>
    </div>
  )
}
