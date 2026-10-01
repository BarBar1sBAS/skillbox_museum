import { useState } from 'react'
import styles from './PixelScene.module.scss'

type Props = {
  src: string
  srcSet?: string
  alt: string
  className?: string
  priority?: boolean
}
const assetUrl = (src: string) =>
  `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`
export function PixelScene(props: Props) {
  return <SceneAsset key={props.src} {...props} />
}
function SceneAsset({ src, srcSet, alt, className, priority = false }: Props) {
  const [failed, setFailed] = useState(false)
  const sources = {
    src: assetUrl(src),
    srcSet: srcSet
      ?.split(',')
      .map((source) => assetUrl(source.trim()))
      .join(', '),
    sizes: '(min-width: 900px) 560px, calc(100vw - 40px)',
    width: 1536,
    height: 1024,
  }
  return (
    <figure
      className={[styles.frame, failed && styles.failed, className]
        .filter(Boolean)
        .join(' ')}
    >
      {failed ? (
        <figcaption className={styles.fallback}>{alt}</figcaption>
      ) : (
        <>
          <img
            {...sources}
            className={styles.image}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
          />
          <img
            {...sources}
            aria-hidden
            alt=""
            className={styles.glitch}
            loading={priority ? 'eager' : 'lazy'}
          />
        </>
      )}
    </figure>
  )
}
