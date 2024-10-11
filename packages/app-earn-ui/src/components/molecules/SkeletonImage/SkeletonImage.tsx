import { type FC, useState } from 'react'
import Image, { type ImageProps } from 'next/image'

import styles from './SkeletonImage.module.scss' // Import custom CSS

export const SkeletonImage: FC<ImageProps> = ({ src, alt, width, height, sizes, style }) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && <div className={styles.skeleton} style={{ width: '100%', height }}></div>}

      <Image
        sizes={sizes}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block', ...style }}
        priority
      />
    </div>
  )
}
