'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type IArmadaVaultInfo, type SDKVaultishType, type VaultApyData } from '@summerfi/app-types'
import { findVaultInfo } from '@summerfi/app-utils'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'

import {
  SlideCarouselButton,
  usePrevNextButtons,
} from '@/components/molecules/SlideCarousel/SlideCarouselButtons'
import { VaultCardHomepage } from '@/components/molecules/VaultCardHomepage/VaultCardHomepage'
import { SUMR_CAP } from '@/constants/earn-protocol'
import { useLocalConfig } from '@/contexts/LocalConfigContext/LocalConfigContext'

import homepageCarouselStyles from './HomepageCarousel.module.css'

type HomepageCarouselProps = {
  vaultsList?: SDKVaultishType[]
  vaultsApyByNetworkMap?: {
    [key: `${string}-${number}`]: VaultApyData
  }
  onGetStartedClick?: (vault?: SDKVaultishType) => void
  vaultsInfo?: IArmadaVaultInfo[]
}

export const HomepageCarousel = ({
  vaultsList,
  vaultsApyByNetworkMap,
  onGetStartedClick,
  vaultsInfo,
}: HomepageCarouselProps): React.ReactNode => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    skipSnaps: true,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

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

  const vaultsDots = useMemo(() => {
    return vaultsList?.map((_, idx) => (
      <div
        key={idx}
        className={`${homepageCarouselStyles.dot} ${idx === selectedIndex ? homepageCarouselStyles.dotActive : ''}`}
        onClick={selectSlide(idx)}
      />
    ))
  }, [vaultsList, selectedIndex, selectSlide])

  return (
    <div className={homepageCarouselStyles.homepageCarouselWrapper}>
      <section className={`${homepageCarouselStyles.embla}`}>
        <div className={homepageCarouselStyles.emblaButtonsWrapper}>
          <div className={homepageCarouselStyles.emblaButtons}>
            <SlideCarouselButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              direction="left"
              iconVariant="xs"
              className={homepageCarouselStyles.homepageEmblaButton}
            />
            <SlideCarouselButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              direction="right"
              iconVariant="xs"
              className={homepageCarouselStyles.homepageEmblaButton}
            />
          </div>
        </div>
        <div className={homepageCarouselStyles.emblaViewport} ref={emblaRef}>
          <div className={homepageCarouselStyles.emblaContainer}>
            {vaultsCards.map((vault, vaultIndex) => (
              <div
                className={clsx(homepageCarouselStyles.emblaSlide, 'embla__slide')}
                key={`VaultCardHomepage_${vault?.id ?? vaultIndex}_${vault?.protocol.network}`}
              >
                <div className={homepageCarouselStyles.emblaSlideNumber}>
                  <VaultCardHomepage
                    vault={vault}
                    onSelect={selectSlide(vaultIndex)}
                    vaultsApyByNetworkMap={vaultsApyByNetworkMap}
                    selected={selectedIndex === vaultIndex}
                    sumrPrice={estimatedSumrPrice}
                    isLoading={!vaultsList}
                    onGetStartedClick={onGetStartedClick}
                    vaultInfo={findVaultInfo(vaultsInfo, vault)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={homepageCarouselStyles.dotsBottom}>{vaultsDots}</div>
      </section>
    </div>
  )
}
